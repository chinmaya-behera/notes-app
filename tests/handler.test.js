import * as handler from '../handler';
import AWS from 'aws-sdk';

jest.mock('aws-sdk');

beforeEach(() => {
  AWS.DynamoDB.DocumentClient.mockClear();
});

test('hello', async () => {
  const event = 'event';
  const context = 'context';
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
  };

  await handler.hello(event, context, callback);
});

// Signup Test
test('signup success', async () => {
  const event = {
    body: JSON.stringify({ email: 'test@example.com', password: 'Password123!' }),
  };
  const response = await handler.signup(event);
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body).message).toEqual('User created successfully');
});

// Login Test
test('login success', async () => {
  const event = {
    body: JSON.stringify({ email: 'test@example.com', password: 'Password123!' }),
  };
  const response = await handler.login(event);
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body).message).toEqual('Login successful');
});

// Create Note Test
test('create note success', async () => {
  const event = {
    body: JSON.stringify({ title: 'Test Note', content: 'This is a test note.' }),
  };
  const response = await handler.create(event);
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body).message).toEqual('Note created successfully');
});

// Update Note Test
test('update note success', async () => {
  const event = {
    pathParameters: { id: '123' },
    body: JSON.stringify({ title: 'Updated Note', content: 'This is an updated test note.' }),
  };
  const response = await handler.update(event);
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body).message).toEqual('Note updated successfully');
});

// Delete Note Test
test('delete note success', async () => {
  const event = {
    pathParameters: { id: '123' },
  };
  const response = await handler.delete(event);
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body).message).toEqual('Note deleted successfully');
});

test('hello', async () => {
  const event = 'event';
  const context = 'context';
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
  };

  await handler.hello(event, context, callback);
});
