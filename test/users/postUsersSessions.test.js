const request = require('supertest');

const DataTest = require('../data/users');
const handleAsyncError = require('../testUtils');
const { truncateDatabase, createUsers } = require('../setup');
const initUsersData = require('../data/initUsersData');
const app = require('../../app');

beforeAll(async () => {
  await truncateDatabase();
  await createUsers(initUsersData);
});

describe('POST users/sessions - SignIn', () => {
  const { email, password } = initUsersData[0];
  test(
    'Should signing a user correctly',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users/sessions')
        .set('Accept', 'application/json')
        .send({ email, password });

      const {
        status,
        body: { token }
      } = response;

      expect(status).toBe(200);
      expect(token).not.toBeNull();
      expect(token).not.toBeUndefined();
    })
  );

  test(
    'Should not work correctly when only one required value is sent',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users/sessions')
        .set('Accept', 'application/json')
        .send({ email });

      const {
        status,
        body: { message }
      } = response;

      expect(status).toBe(400);
      expect(message).toBe(DataTest.NotValidPasswordMessage);
    })
  );

  test(
    'Should not work correctly when an incorrect password is sent',
    handleAsyncError(async () => {
      const incorrectPassword = DataTest.IncorrectPassword;

      const response = await request(app)
        .post('/users/sessions')
        .set('Accept', 'application/json')
        .send({ email, password: incorrectPassword });

      const {
        status,
        body: { message }
      } = response;

      expect(status).toBe(401);
      expect(message).toBe(DataTest.IncorrectPasswordMessage);
    })
  );

  test(
    'Should not work correctly when the user does not exist',
    handleAsyncError(async () => {
      const notExistingEmail = DataTest.NotExistingEmail;

      const response = await request(app)
        .post('/users/sessions')
        .set('Accept', 'application/json')
        .send({ email: notExistingEmail, password });

      const {
        status,
        body: { message }
      } = response;

      expect(status).toBe(404);
      expect(message).toBe(DataTest.UserNotFoundMessage);
    })
  );

  test(
    'Should not work correctly when email is not valid',
    handleAsyncError(async () => {
      const notValidEmail = DataTest.NotValidEmail;

      const response = await request(app)
        .post('/users/sessions')
        .set('Accept', 'application/json')
        .send({ email: notValidEmail, password });

      const {
        status,
        body: { message }
      } = response;

      expect(status).toBe(400);
      expect(message).toBe(DataTest.OnlyWoloxEmail);
    })
  );
});
