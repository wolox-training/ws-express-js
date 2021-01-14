const { checkSchema } = require('express-validator');
const { requestHandler } = require('./helpers/requestHandler');
const {
  post: userPostSchema,
  postSessions: userSessionsPostSchema
} = require('./middlewares/validators/users');

const WitterController = require('./controllers/witter');
const UsersController = require('./controllers/users');
const { healthCheck } = require('./controllers/healthCheck');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/witter', requestHandler(WitterController.getWitter));
  app.post('/users', checkSchema(userPostSchema), requestHandler(UsersController.createUser));
  app.post('/users/sessions', checkSchema(userSessionsPostSchema), requestHandler(UsersController.signIn));
};
