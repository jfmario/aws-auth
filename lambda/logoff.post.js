
var AWS = require ( 'aws-sdk' );
var dynamodb = new AWS.DynamoDB.DocumentClient ();

exports.handler = ( event, context, callback ) => {

    var req = JSON.parse ( event.body );
}