
var AWS = require ( 'aws-sdk' );
var dynamodb = new AWS.DynamoDB.DocumentClient ();

exports.handler = ( event, context, callback ) => {
    
    var req = event;
    if ( !req.hasOwnProperty ( 'username' ) )
    {
        callback ( null, {
                success: false,
                reason: "No username specified."
            });
    }
    if ( !req.hasOwnProperty ( 'password' ) )
    {
        callback ( null, {
                success: false,
                reason: "No password specified."
            });
    }
    if ( !req.hasOwnProperty ( 'emailAddress' ) )
    {
        callback ( null, {
                success: false,
                reason: "No e-mail address specified."
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
                    success: false,
                    reason: "Username exists."
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
                        callback ( null, { success: true });
                });
            }
        }
    });
}