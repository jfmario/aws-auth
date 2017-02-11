
var AWS = require ( 'aws-sdk' );
var dynamodb = new AWS.DynamoDB.DocumentClient ();

exports.handler = ( event, context, callback ) => {

    var req = JSON.parse ( event.body );
    if ( !req.hasOwnProperty ( 'username' ) )
    {
        callback ( null, {
            body: JSON.stringify ({
                success: false,
                reason: "No username specified."
            }),
            headers: {},
            statusCode: 400
        });
    }
    if ( !req.hasOwnProperty ( 'password' ) )
    {
        callback ( null, {
            body: JSON.stringify ({
                success: false,
                reason: "No password specified."
            }),
            headers: {},
            statusCode: 400
        });
    }
    if ( !req.hasOwnProperty ( 'emailAddress' ) )
    {
        callback ( null, {
            body: JSON.stringify ({
                success: false,
                reason: "No e-mail address specified."
            }),
            headers: {},
            statusCode: 400
        });
    }
    var userQuery = {
        TableName: 'Users',
        ProjectionExpression: '#username',
        KeyConditionExpression: '#username = :username',
        ExpressionAttributeNames: { '#username': 'username' },
        ExpressionAttributeValues: { ':username': req.username }
    };
    
    dynamodb.query ( userQuery, function ( err, data )
    {
        if ( err ) callback ( err )
        else 
        {
            if ( data.Count >= 1 ) callback ( null, {
                body: JSON.stringify ({
                    success: false,
                    reason: "Username exists."
                }),
                headers: {},
                statusCode: 409
            });
            else
            {
                var userObject = {
                    username: req.username,
                    data: {
                        password: req.password,
                        emailAddress: req.emailAddress
                    }
                };
                var userRecord = {
                    TableName: 'Users', Item: userObject
                };
                dynamodb.put ( userRecord, function ( err, data )
                {
                    if ( err )
                        callback ( err );
                    else
                        callback ( null, {
                            body: JSON.stringify ({ success: true }),
                            headers: {},
                            statusCode: 201
                        });
                });
            }
        }
    });
}