import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = async (event) => {
  const noteId = event.pathParameters.id;

  // Validate noteId
  if (!noteId) {
      return {
          statusCode: 400,
          body: JSON.stringify({ error: "Note ID is required" }),
      };
  }

  const params = {
    TableName: process.env.tableName,
    Key: {
      noteId: noteId,
    },
  };
  try {
    const data = await dynamoDb.get(params).promise();
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Note not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
