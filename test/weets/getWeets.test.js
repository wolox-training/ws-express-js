const request = require('supertest');

const getToken = require('../../app/helpers/generateToken');
const { truncateDatabase, createUsers, createWeets } = require('../setup');
const initUsersData = require('../data/initUsersData');
const initWeetsData = require('../data/initWeetsData');
const handleAsyncError = require('../testUtils');
const app = require('../../app');

const BASE_URL = '/weets';

beforeAll(async () => {
  await truncateDatabase();
  await createUsers(initUsersData);
  await createWeets(initWeetsData);
});

describe('GET /weets - list all weets paginated', () => {
  const userData = initUsersData[0];
  const { email, name } = userData;
  const token = getToken({ email, name });

  test(
    'Should list all weets paginated',
    handleAsyncError(async () => {
      const { status } = await request(app)
        .get(`${BASE_URL}/`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .query({ page: 1, size: 10 });

      expect(status).toBe(200);
    })
  );

  test(
    'Should return status 400 when required fields are not sent',
    handleAsyncError(async () => {
      const { status } = await request(app)
        .get(`${BASE_URL}/`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`);

      expect(status).toBe(400);
    })
  );

  test(
    'Should return status 401 when authorization header is not sent',
    handleAsyncError(async () => {
      const { status } = await request(app)
        .get(`${BASE_URL}/`)
        .set('Accept', 'application/json');

      expect(status).toBe(401);
    })
  );
});
