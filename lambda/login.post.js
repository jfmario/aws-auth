
var AWS = require ( 'aws-sdk' );
var dynamodb = new AWS.DynamoDB.DocumentClient ();

var makeToken = function ()
{

    var options = 'abcdefghijklmnopqrstuvwxyz';
    options += options.toUpperCase ();
    options += '0123456789';

    var tokenChars = [];
    for ( var i = 0; i < 32; ++i )
        tokenChars.push ( options [parseInt(Math.random()*options.length)] );
    return tokenChars.join ( '' );
}

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
                if ( data.Count === 0 ) 
                {
                    callback ( null, {
                        body: JSON.stringify ({
                            success: false,
                            reason: "Bad username or password."
                        }),
                        headers: {},
                        statusCode: 401
                    });  
                }
                else
                {

                    var usernameMatch = data.Items [0];
                    if ( req.password == usernameMatch.obj.password )
                    {
                        var token = makeToken ();
                        var expirationDate = new Date ( new Date ().getTime () + 48 * 60 * 60 * 1000 );
                        var userUpdate = {
                            TableName: 'Users',
                            Key: { "username": req.username },
                            UpdateExpression: "set obj.#auth_token = :auth_token",
                            ExpressionAttributeNames: {
                                "#auth_token": 'auth_token'
                            },
                            ExpressionAttributeValues: {
                                ':auth_token': { auth_token: token, expiration: expirationDate.toISOString () }
                            },
                            ReturnValues: 'UPDATED_NEW'
                        };

                        dynamodb.update ( userUpdate, function ( err, data )
                        {
                            if ( err ) callback ( null, {
                                body: JSON.stringify ( err ),
                                headers: {},
                                statusCode: 500
                            });
                            else callback ( null, {
                                body: JSON.stringify ({
                                    success: true,
                                    token: token
                                }),
                                headers: {},
                                statusCode: 202
                            });
                        });
                    }
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