
var AWS = require ( 'aws-sdk' );
var dynamodb = new AWS.DynamoDB.DocumentClient ();

function main ( req, callback )
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
                success: true
            });
    });
}
function authCheck ( req, next, awsCb )
{
    if ( !req.hasOwnProperty ( 'username' ) || !req.hasOwnProperty ( 'token' ) )
    {
        awsCb ( null, {
                success: false,
                reason: "No authentication."
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
            if ( err ) callback ( null, err );
            else
            {
                if ( data.Count === 0 ) 
                {
                    callback ( null, {
                            success: false,
                            reason: "Bad username."
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
                        next ( req, awsCb, usernameMatch );
                    }
                    else awsCb ( null, {
                            success: false,
                            reason: "Bad or expired token."
                        });
                }
            }
        });
    }
}
exports.handler = ( event, context, callback ) => {
    var req = event;
    authCheck ( req, main, callback );
}