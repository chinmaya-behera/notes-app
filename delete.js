const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.delete = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2)); // Log the incoming event

    try {
        const noteId = event.pathParameters.id; // Get the note ID from path parameters

        const params = {
            TableName: process.env.NOTES_TABLE,
            Key: {
                noteId: noteId, // Specify the key to delete
            },
        };

        await dynamoDB.delete(params).promise(); // Delete the item from DynamoDB
        console.log("Note deleted successfully:", { noteId }); // Log success
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Note deleted successfully' }),
        };
    } catch (error) {
        console.error("Error deleting note:", error); // Log error
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
