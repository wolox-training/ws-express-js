const request = require('supertest');

const getToken = require('../app/helpers/generateToken');
const truncateDatabase = require('./setup');
const errors = require('../app/errors');
const app = require('../app');

beforeAll(async () => {
  await truncateDatabase();
});

const newUserData = {
  name: 'William',
  lastName: 'Salazar',
  email: 'william.salazar@wolox.co',
  password: 'thisIsAVerySecurePassword'
};

describe('POST users', () => {
  test('create new user', async done => {
    const response = await request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send(newUserData);

    const {
      status,
      body: { name }
    } = response;

    expect(status).toBe(201);
    expect(name).toBe('William');
    done();
  });

  test('Should return an error when email is already in use', async done => {
    const response = await request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send(newUserData);

    const {
      status,
      body: { message }
    } = response;

    expect(status).toBe(400);
    expect(message).toBe('Email address already in use!');
    done();
  });

  test('Should return an error when email is not valid', async done => {
    const response = await request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send({ ...newUserData, email: 'william@gmail.com' });

    const { status } = response;

    expect(status).toBe(400);
    done();
  });

  test('Should return an error when password is not valid', async done => {
    const response = await request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send({ ...newUserData, password: 'min8' });

    const {
      status,
      body: { message }
    } = response;

    expect(status).toBe(400);
    expect(message).toBe('Password length should be minimum 8');
    done();
  });

  test('Should return an error is any required value is missing', async done => {
    const response = await request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send({ email: 'william.salazar@wolox.co' });

    const {
      status,
      body: { message }
    } = response;

    expect(status).toBe(400);
    expect(message).toBe('Name cannot be null or empty');
    done();
  });
});

describe('POST users/sessions', () => {
  test('Should work correctly', async done => {
    const { email, password } = newUserData;

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
    done();
  });

  test('Should not work correctly when only one required value is sent', async done => {
    const { email } = newUserData;

    const response = await request(app)
      .post('/users/sessions')
      .set('Accept', 'application/json')
      .send({ email });

    const {
      status,
      body: { message }
    } = response;

    expect(status).toBe(400);
    expect(message).toBe('Password should not be null or empty');
    done();
  });

  test('Should not work correctly when an incorrect password is sent', async done => {
    const { email } = newUserData;
    const password = 'thisIsAnIncorrectPassword';

    const response = await request(app)
      .post('/users/sessions')
      .set('Accept', 'application/json')
      .send({ email, password });

    const {
      status,
      body: { message }
    } = response;

    expect(status).toBe(401);
    expect(message).toBe('Incorrect password');
    done();
  });

  test('Should not work correctly when the user does not exist', async done => {
    const { password } = newUserData;
    const email = 'notexist@wolox.co';

    const response = await request(app)
      .post('/users/sessions')
      .set('Accept', 'application/json')
      .send({ email, password });

    const {
      status,
      body: { message }
    } = response;

    expect(status).toBe(404);
    expect(message).toBe('User not found');
    done();
  });

  test('Should not work correctly when email is not valid', async done => {
    const { password } = newUserData;
    const email = 'notvalid@gmail.com';

    const response = await request(app)
      .post('/users/sessions')
      .set('Accept', 'application/json')
      .send({ email, password });

    const {
      status,
      body: { message }
    } = response;

    expect(status).toBe(400);
    expect(message).toBe('You may only use email addresses from wolox');
    done();
  });
});

describe('GET users', () => {
  test('Should work correctly', async done => {
    const { name, email } = newUserData;

    const token = getToken({ name, email });

    const response = await request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .query({ page: 1, size: 10 });

    const { status } = response;

    expect(status).toBe(200);
    done();
  });

  test('Should not work correctly when query params are not sent', async done => {
    const { name, email } = newUserData;

    const token = getToken({ name, email });

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
    done();
  });

  test('Should not work correctly when query params are not numbers', async done => {
    const { name, email } = newUserData;

    const token = getToken({ name, email });
    const notNumber = 'definablyNotANumber';

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
    expect(message).toBe('Should be a number greater than 0');
    expect(internalCode).toBe(errors.BAD_REQUEST_ERROR);
    done();
  });

  test('Should send database_error when database error occurs', async done => {
    const { name, email } = newUserData;

    const token = getToken({ name, email });
    const tooBigNumber = 99999999999999999;

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
    done();
  });
});
