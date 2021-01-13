const request = require('supertest');
const DataTest = require('./data/users');
const handleAsyncError = require('./testUtils');
const truncateDatabase = require('./setup');
const app = require('../app');

const { newUserData } = DataTest;

beforeAll(async () => {
  await truncateDatabase();
});

describe('POST /users - Signup', () => {
  test(
    'Should signup a new valid user',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(newUserData);

      const {
        body: { name }
      } = response;

      expect(name).toBe(newUserData.name);
    })
  );

  test(
    'Should return an error when email is already in use and return status 400',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(newUserData);

      const { status } = response;

      expect(status).toBe(400);
    })
  );

  test(
    'Should return an error when email is already in use returning a valid message',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(newUserData);

      const {
        body: { message }
      } = response;

      expect(message).toBe(DataTest.EmailAlreadyInUseMessage);
    })
  );

  test(
    'Should return an error when email is not valid',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({ ...newUserData, email: DataTest.NotValidEmail });

      const { status } = response;

      expect(status).toBe(400);
    })
  );

  test(
    'Should return an error when password is not valid and return status 400',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({ ...newUserData, password: 'min8' });

      const { status } = response;

      expect(status).toBe(400);
    })
  );

  test(
    'Should return an error when password is not valid returning a valid message',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({ ...newUserData, password: 'min8' });

      const {
        body: { message }
      } = response;

      expect(message).toBe(DataTest.PasswordMinLengthMessage);
    })
  );

  test(
    'Should return error with status 400 when any required value is missing',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({ email: 'william.salazar@wolox.co' });

      const { status } = response;

      expect(status).toBe(400);
    })
  );

  test(
    'Should return an valid error message when any required value is missing',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({ email: 'william.salazar@wolox.co' });

      const {
        body: { message }
      } = response;

      expect(message).toBe(DataTest.NotValidNameMessage);
    })
  );
});
