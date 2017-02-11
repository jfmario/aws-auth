
var AWS = require ( 'aws-sdk' );
var dynamodb = new AWS.DynamoDB.DocumentClient ();

function logoff ( req, callback )
{
    var userUpdate = {
        TableName: 'Users',
        Key: { "username": req.username },
        UpdateExpression: "set obj.#auth_token = :auth_token",
        ExpressionAttributeNames: {
            "#auth_token": 'auth_token'
        },
        ExpressionAttributeValues: {
            ':auth_token': {}
        },
        ReturnValues: 'UPDATED_NEW'
    };
    dynamodb.update ( userUpdate, function ( err, data )
    {
        if ( err ) callback ( err );
        else callback ( null, {
            body: JSON.stringify ({
                success: true
            }),
            headers: {},
            statusCode: 202
        });
    });
}

function authCheck ( req, next, awsCb )
{
    if ( !req.hasOwnProperty ( 'username' ) || !req.hasOwnProperty ( 'token' ) )
    {
        awsCb ( null, {
            body: JSON.stringify ({
                success: false,
                reason: "No authentication."
            }),
            headers: {},
            statusCode: 403
        });
    }
    else
    {
        var userQuery = {
            TableName: 'Users',
            ProjectionExpression: '#username, obj.auth_token.auth_token, obj.auth_token.expiration',
            KeyConditionExpression: '#username = :username',
            ExpressionAttributeNames: {
                '#username': 'username'
            },
            ExpressionAttributeValues: { ':username': req.username }
        };
        dynamodb.query ( userQuery, function ( err, data )
        {
            if ( err ) callback ( null, {
                body: JSON.stringify ( err ),
                headers: {},
                statusCode: 500
            });
            else
            {
                if ( data.Count === 0 ) 
                {
                    callback ( null, {
                        body: JSON.stringify ({
                            success: false,
                            reason: "Bad username."
                        }),
                        headers: {},
                        statusCode: 403
                    });  
                }
                else
                {
                    var usernameMatch = data.Items [0];
                    if ( 
                        ( req.token == usernameMatch.obj.auth_token.auth_token ) &&
                        ( new Date () < new Date ( usernameMatch.obj.auth_token.expiration ) )
                    )
                    {
                        next ( req, awsCb );
                    }
                    else awsCb ( null, {
                        body: JSON.stringify ({
                            success: false,
                            reason: "Bad or expired token."
                        }),
                        headers: {},
                        statusCode: 403
                    });
                }
            }
        });
    }
}
exports.handler = ( event, context, callback ) => {
    var req = JSON.parse ( event.body );
    authCheck ( req, logoff, callback );
}