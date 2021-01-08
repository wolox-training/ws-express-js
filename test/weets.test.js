const request = require('supertest');

const axios = require('axios');
const getToken = require('../app/helpers/generateToken');
const { truncateDatabase, createUsers } = require('./setup');
const initUsersData = require('./data/initUsersData');
const DataTest = require('./data/weets');
const handleAsyncError = require('./testUtils');
const app = require('../app');

jest.mock('axios');

const BASE_URL = '/weets';

beforeAll(async () => {
  await truncateDatabase();
  await createUsers(initUsersData);
});

describe('POST /weets', () => {
  const userData = initUsersData[0];
  const { email, name } = userData;
  const token = getToken({ email, name });

  test(
    'Should create a new weet',
    handleAsyncError(async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve(DataTest.getMockedResponseFromAxios));

      const response = await request(app)
        .post(`${BASE_URL}/`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`);

      const { status } = response;

      expect(status).toBe(201);
    })
  );

  test(
    'Should return status 401 when authorization header is not sent',
    handleAsyncError(async () => {
      const response = await request(app)
        .post(`${BASE_URL}/`)
        .set('Accept', 'application/json');

      const { status } = response;

      expect(status).toBe(401);
    })
  );
});
