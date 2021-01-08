const request = require('supertest');

const getToken = require('../app/helpers/generateToken');
const { truncateDatabase, createUsers } = require('./setup');
const initUsersData = require('./data/initUsersData');
const app = require('../app');

const BASE_URL = '/weets';

beforeAll(async () => {
  await truncateDatabase();
  await createUsers(initUsersData);
});

describe('POST /weets', () => {
  const userData = initUsersData[0];
  const { email, name } = userData;
  const token = getToken({ email, name });

  test('Should create a new weet', async () => {
    const response = await request(app)
      .post(`${BASE_URL}/`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`);

    const { status } = response;

    expect(status).toBe(201);
  });

  test('Should return status 401 when authorization header is not sent', async () => {
    const response = await request(app)
      .post(`${BASE_URL}/`)
      .set('Accept', 'application/json');

    const { status } = response;

    expect(status).toBe(401);
  });
});
