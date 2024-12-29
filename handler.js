const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.signup = async (event) => {
    let email, password;
    try {
        const body = JSON.parse(event.body);
        email = body.email;
        password = body.password;
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request body' }),
        };
    }

    // Check environment variables
    if (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_USER_POOL_CLIENT_ID) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Missing environment variables' }),
        };
    }

    console.log("Received signup request:", { email, password });

    const params = {
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
        Username: `user_${Date.now()}`, // Use a unique identifier for the username
        Password: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email,
            },
        ],
    };

    try {
        await cognito.signUp(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User signed up successfully' }),
        };
    } catch (error) {
        console.error("Error during signup:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

exports.login = async (event) => {
    const { email, password } = JSON.parse(event.body);
    
    // Check environment variables
    if (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_USER_POOL_CLIENT_ID) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Missing environment variables' }),
        };
    }

    const params = {
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    };

    try {
        const data = await cognito.adminInitiateAuth(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User logged in successfully', token: data.AuthenticationResult.IdToken }),
        };
    } catch (error) {
        console.error("Error during login:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

exports.resetPassword = async (event) => {
    const { username, code, newPassword } = JSON.parse(event.body);

    const params = {
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
        ConfirmationCode: code,
        Username: username,
        Password: newPassword,
    };

    try {
        await cognito.confirmForgotPassword(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Password reset successfully' }),
        };
    } catch (error) {
        console.error("Error during password reset:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
