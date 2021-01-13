const request = require('supertest');

const getToken = require('../../app/helpers/generateToken');
const DataTest = require('../data/users');
const handleAsyncError = require('../testUtils');
const { truncateDatabase, createUsers } = require('../setup');
const errors = require('../../app/errors');
const app = require('../../app');
const initUsersData = require('../data/InitUsersData');

beforeAll(async () => {
  await truncateDatabase();
  await createUsers(initUsersData);
});

describe('GET users - List users', () => {
  const adminUserData = initUsersData[0];
  const { email, name } = adminUserData;
  const token = getToken({ email, name });

  test(
    'Should list users correctly',
    handleAsyncError(async () => {
      const response = await request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .query({ page: 1, size: 10 });

      const { status } = response;

      expect(status).toBe(200);
    })
  );

  test(
    'Should not work correctly when query params are not sent',
    handleAsyncError(async () => {
      const response = await request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .query({});

      const {
        status,
        body: { internal_code: internalCode }
      } = response;

      expect(status).toBe(400);
      expect(internalCode).toBe(errors.BAD_REQUEST_ERROR);
    })
  );

  test(
    'Should not work correctly when query params are not numbers',
    handleAsyncError(async () => {
      const notNumber = DataTest.NotANumber;

      const response = await request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .query({ page: notNumber, size: notNumber });

      const {
        status,
        body: { message, internal_code: internalCode }
      } = response;

      expect(status).toBe(400);
      expect(message).toBe(DataTest.ShouldBeANumberGreaterThanZero);
      expect(internalCode).toBe(errors.BAD_REQUEST_ERROR);
    })
  );

  test(
    'Should send database_error when database error occurs',
    handleAsyncError(async () => {
      const tooBigNumber = DataTest.TooBigNumber;

      const response = await request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .query({ page: tooBigNumber, size: tooBigNumber });

      const {
        status,
        body: { internal_code: internalCode }
      } = response;

      expect(status).toBe(503);
      expect(internalCode).toBe(errors.DATABASE_ERROR);
    })
  );
});
