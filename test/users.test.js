const request = require('supertest');
const truncateDatabase = require('./setup');
const app = require('../app');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await truncateDatabase();
});

describe('POST users', () => {
  const newUserData = {
    name: 'William',
    lastName: 'Salazar',
    email: 'william.salazar@wolox.co',
    password: 'thisIsAVerySecurePassword'
  };

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
    expect(message).toBe('Validation error: Password length should be between 8 and 60');
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
    expect(message).toBe('notNull Violation: Name cannot be null');
    done();
  });
});
