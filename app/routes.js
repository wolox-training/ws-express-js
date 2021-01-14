const { checkSchema } = require('express-validator');
const { requestHandler } = require('./helpers/requestHandler');
const {
  post: userPostSchema,
  postSessions: userSessionsPostSchema,
  get: userGetSchema
} = require('./middlewares/validators/users');
const AuthenticationMiddleware = require('./middlewares/authentication');

const WitterController = require('./controllers/witter');
const UsersController = require('./controllers/users');
const { healthCheck } = require('./controllers/healthCheck');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/witter', requestHandler(WitterController.getWitter));
  app.post('/users', checkSchema(userPostSchema), requestHandler(UsersController.createUser));
  app.get(
    '/users',
    AuthenticationMiddleware,
    checkSchema(userGetSchema),
    requestHandler(UsersController.getUsersList)
  );
  app.post('/users/sessions', checkSchema(userSessionsPostSchema), requestHandler(UsersController.signIn));
};
