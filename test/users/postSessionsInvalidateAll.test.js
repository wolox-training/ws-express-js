const request = require('supertest');

const DataTest = require('../data/users');
const handleAsyncError = require('../testUtils');
const { truncateDatabase, createUsers, createBlacklistedTokens } = require('../setup');
const initUsersData = require('../data/initUsersData');
const app = require('../../app');
const getToken = require('../../app/helpers/generateToken');

const BASE_URL = '/users/sessions/invalidate_all';

let userId = null;
let email = null;
let name = null;
let token = null;

beforeAll(async () => {
  await truncateDatabase();
  [
    {
      dataValues: { id: userId, email, name }
    }
  ] = await createUsers(initUsersData);
  token = getToken({ email, name });
  await createBlacklistedTokens([{ userId, token }]);
});

describe('POST users/sessions/invalidate_all - Disable all active sessions', () => {
  test(
    'Should Disable all active sessions of a user successfully',
    handleAsyncError(async () => {
      const { status } = await request(app)
        .post(BASE_URL)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .send();

      expect(status).toBe(204);
    })
  );

  test(
    'Should return a an error when we try to use a disabled token ',
    handleAsyncError(async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .send();

      const {
        status,
        body: { message }
      } = response;

      expect(status).toBe(401);
      expect(message).toBe(DataTest.DisabledTokenMessage);
    })
  );

  test(
    'Should return status 401 when authorization header is not sent',
    handleAsyncError(async () => {
      const response = await request(app)
        .post(`${BASE_URL}`)
        .set('Accept', 'application/json');

      const { status } = response;

      expect(status).toBe(401);
    })
  );
});
