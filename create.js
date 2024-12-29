const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.create = async (event) => {
    if (!event || !event.body) {
        console.error("Invalid event object:", event); // Log error for invalid event
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid event object' }),
        };
    }

    console.log("Received event:", JSON.stringify(event, null, 2)); // Log the incoming event

    try {
        const { title, content } = JSON.parse(event.body); // Ensure correct typing
        const noteId = new Date().getTime().toString(); // Simple unique ID based on timestamp

        const params = {
            TableName: process.env.NOTES_TABLE, // Ensure TableName is a string
            Item: {
                noteId,
                title,
                content,
            },
        };

        await dynamoDB.put(params).promise();
        console.log("Note created successfully:", { noteId }); // Log success
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Note created successfully', noteId }),
        };
    } catch (error) {
        console.error("Error creating note:", error); // Log error
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
