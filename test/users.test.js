const request = require('supertest');
const DataTest = require('./data/users');
const handleAsyncError = require('./testUtils');
const truncateDatabase = require('./setup');
const app = require('../app');

const { newUserData } = DataTest;

beforeAll(async () => {
  await truncateDatabase();
});

describe('POST /users - Signup', () => {
  test(
    'Should signup a new valid user',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(newUserData);

      const {
        body: { name }
      } = response;

      expect(name).toBe(newUserData.name);
    })
  );

  test(
    'Should return an error when email is already in use and return status 400',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(newUserData);

      const { status } = response;

      expect(status).toBe(400);
    })
  );

  test(
    'Should return an error when email is already in use returning a valid message',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(newUserData);

      const {
        body: { message }
      } = response;

      expect(message).toBe(DataTest.EmailAlreadyInUseMessage);
    })
  );

  test(
    'Should return an error when email is not valid',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({ ...newUserData, email: DataTest.NotValidEmail });

      const { status } = response;

      expect(status).toBe(400);
    })
  );

  test(
    'Should return an error when password is not valid and return status 400',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({ ...newUserData, password: 'min8' });

      const { status } = response;

      expect(status).toBe(400);
    })
  );

  test(
    'Should return an error when password is not valid returning a valid message',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({ ...newUserData, password: 'min8' });

      const {
        body: { message }
      } = response;

      expect(message).toBe(DataTest.PasswordMinLengthMessage);
    })
  );

  test(
    'Should return error with status 400 when any required value is missing',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({ email: 'william.salazar@wolox.co' });

      const { status } = response;

      expect(status).toBe(400);
    })
  );

  test(
    'Should return an valid error message when any required value is missing',
    handleAsyncError(async () => {
      const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({ email: 'william.salazar@wolox.co' });

      const {
        body: { message }
      } = response;

      expect(message).toBe(DataTest.NotValidNameMessage);
    })
  );
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
    expect(message).toBe(DataTest.NotValidPasswordMessage);
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
    expect(message).toBe(DataTest.IncorrectPasswordMessage);
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
    expect(message).toBe(DataTest.NotFoundUserMessage);
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
    expect(message).toBe(DataTest.OnlyWoloxEmail);
    done();
  });
});
