const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.update = async (event) => {
    console.log("Received update request:", JSON.stringify(event)); // Log the incoming event
    const { id } = event.pathParameters;
    const { title, content } = JSON.parse(event.body);

    const params = {
        TableName: process.env.NOTES_TABLE,
        Key: {
            noteId: id,
        },
        UpdateExpression: 'set title = :title, content = :content',
        ExpressionAttributeValues: {
            ':title': title,
            ':content': content,
        },
        ReturnValues: 'UPDATED_NEW',
    };

    try {
        const data = await dynamoDB.update(params).promise();
        console.log("Update successful:", data); // Log successful update
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Note updated successfully', data }),
        };
    } catch (error) {
        console.error("Error during update:", error); // Log error
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

