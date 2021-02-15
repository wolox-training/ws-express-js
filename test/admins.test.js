const request = require('supertest');

const getToken = require('../app/helpers/generateToken');
const { truncateDatabase, createUsers } = require('./setup');
const initUsersData = require('./data/initUsersData');
const DataTest = require('./data/admins');
const errors = require('../app/errors');
const app = require('../app');

const BASE_URL = '/admin';

const { newAdminData } = DataTest;

beforeAll(async () => {
  await truncateDatabase();
  await createUsers(initUsersData);
});

describe('POST admin/users - Create or update user to admin', () => {
  const adminUserData = initUsersData[0];
  const { email: adminEmail, name: adminName } = adminUserData;
  const adminToken = getToken({ email: adminEmail, name: adminName });

  const notAdminUserData = initUsersData[1];
  const { email: notAdminEmail, name: notAdminName } = notAdminUserData;
  const notAdminToken = getToken({ email: notAdminEmail, name: notAdminName });

  test('Create new admin user', async done => {
    const response = await request(app)
      .post(`${BASE_URL}/users`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${adminToken}`)
      .send(newAdminData);

    const {
      status,
      body: { email }
    } = response;

    expect(status).toBe(201);
    expect(email).toBe(newAdminData.email);
    done();
  });

  test('Should not work correctly when the requesting user is not admin', async done => {
    const response = await request(app)
      .post(`${BASE_URL}/users`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${notAdminToken}`)
      .send(newAdminData);

    const {
      status,
      body: { internal_code: internalCode }
    } = response;

    expect(status).toBe(403);
    expect(internalCode).toBe(errors.FORBIDDEN_ERROR);
    done();
  });

  test('Become an existing user to admin', async done => {
    const { name, lastName, email, password } = notAdminUserData;
    const response = await request(app)
      .post(`${BASE_URL}/users`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${adminToken}`)
      .send({ name, lastName, email, password });

    const {
      status,
      body: { email: emailResponse, isAdmin }
    } = response;

    expect(status).toBe(200);
    expect(isAdmin).toBe(true);
    expect(emailResponse).toBe(notAdminUserData.email);
    done();
  });

  test('Should not work correctly when required data is not sent', async done => {
    const { name, password } = notAdminUserData;
    const response = await request(app)
      .post(`${BASE_URL}/users`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${adminToken}`)
      .send({ name, password });

    const {
      status,
      body: { internal_code: internalCode }
    } = response;

    expect(status).toBe(400);
    expect(internalCode).toBe(errors.BAD_REQUEST_ERROR);
    done();
  });
});
