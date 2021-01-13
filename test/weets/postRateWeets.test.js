const request = require('supertest');

const getToken = require('../../app/helpers/generateToken');
const { truncateDatabase, createUsers, createWeets } = require('../setup');
const initUsersData = require('../data/initUsersData');
const initWeetsData = require('../data/initWeetsData');
const DataTest = require('../data/weets');
const handleAsyncError = require('../testUtils');
const app = require('../../app');

const BASE_URL = '/weets';

beforeAll(async () => {
  await truncateDatabase();
  await createUsers(initUsersData);
  await createWeets(initWeetsData);
});

describe('POST /weets/:id/ratings - Rate a weet', () => {
  const userData = initUsersData[0];
  const { email, name } = userData;
  const token = getToken({ email, name });
  const weetId = '1';

  test(
    'Should rate weet successfully',
    handleAsyncError(async () => {
      const { status } = await request(app)
        .post(`${BASE_URL}/${weetId}/ratings`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .send({ rate: '1' });

      expect(status).toBe(201);
    })
  );

  test(
    'Should return status 400 when the weet has already been rated',
    handleAsyncError(async () => {
      const { status } = await request(app)
        .post(`${BASE_URL}/${weetId}/ratings`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .send({ rate: '1' });

      expect(status).toBe(400);
    })
  );

  test(
    'Should return message when the weet has already been rated',
    handleAsyncError(async () => {
      const {
        body: { message }
      } = await request(app)
        .post(`${BASE_URL}/${weetId}/ratings`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .send({ rate: '1' });

      expect(message).toBe(DataTest.weetAlreadyRatedMessage);
    })
  );

  test(
    'Should return status 404 when the weet does not exist',
    handleAsyncError(async () => {
      const { notExistingWeetId } = DataTest;

      const { status } = await request(app)
        .post(`${BASE_URL}/${notExistingWeetId}/ratings`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .send({ rate: '1' });

      expect(status).toBe(404);
    })
  );

  test(
    'Should return a message when the weet does not exist',
    handleAsyncError(async () => {
      const { notExistingWeetId, weetDoNotExistsMessage } = DataTest;

      const {
        body: { message }
      } = await request(app)
        .post(`${BASE_URL}/${notExistingWeetId}/ratings`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .send({ rate: '1' });

      expect(message).toBe(weetDoNotExistsMessage);
    })
  );

  test(
    'Should return status 401 when authorization header is not sent',
    handleAsyncError(async () => {
      const response = await request(app)
        .post(`${BASE_URL}/${weetId}/ratings`)
        .set('Accept', 'application/json');

      const { status } = response;

      expect(status).toBe(401);
    })
  );
});
