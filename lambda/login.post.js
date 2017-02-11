
var AWS = require ( 'aws-sdk' );
var dynamodb = new AWS.DynamoDB.DocumentClient ();

exports.handler = ( event, context, callback ) => {

    var req = JSON.parse ( event.body );
    var validated = true;

    if ( !req.hasOwnProperty ( 'username' ) )
    {
        validated = false;
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
        validated = false;
        callback ( null, {
            body: JSON.stringify ({
                success: false,
                reason: "No password specified."
            }),
            headers: {},
            statusCode: 400
        });
    }

    if ( validated )
    {
        var userQuery = {
            TableName: 'Users',
            ProjectionExpression: '#username, obj.password',
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
                if ( data.Count === 0 ) callback ( null, {
                    body: JSON.stringify ({
                        success: false,
                        reason: "Bad username or password."
                    }),
                    headers: {},
                    statusCode: 401
                });
                else
                {

                    var usernameMatch = data.Items [0];
                    if ( req.password == usernameMatch.obj.password )
                        callback ( null, {
                            body: JSON.stringify ({
                                success: true
                            }),
                            headers: {},
                            statusCode: 202
                        });
                    else callback ( null, {
                        body: JSON.stringify ({
                            success: false,
                            reason: "Bad username or password."
                        }),
                        headers: {},
                        statusCode: 401
                    });
                }
            }
        });
    }
};