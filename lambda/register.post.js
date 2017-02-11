
var AWS = require ( 'aws-sdk' );

AWS.config.update({
    region: 'us-west-2',
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

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

    var userObject = {
        username: req.username,
        data: {
            password: req.password,
            emailAddress: req.emailAddress
        }
    };
    var params = {
        TableName: 'Users', Item: userObject
    };
    
    dynamodb.put ( params, function ( err, data )
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