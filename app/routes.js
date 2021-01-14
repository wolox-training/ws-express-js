const { checkSchema } = require('express-validator');
const { requestHandler } = require('./helpers/requestHandler');
const {
  post: userPostSchema,
  postSessions: userSessionsPostSchema,
  get: userGetSchema
} = require('./middlewares/validators/users');

const { postUsers: adminUsersPostSchema } = require('./middlewares/validators/admins');
const { get: weetsGetSchema, postRateWeet } = require('./middlewares/validators/weets');
const AuthenticationMiddleware = require('./middlewares/authentication');

const UsersController = require('./controllers/users');
const AdminsController = require('./controllers/admins');
const WeetsController = require('./controllers/weets');
const { healthCheck } = require('./controllers/healthCheck');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', checkSchema(userPostSchema), requestHandler(UsersController.createUser));
  app.get(
    '/users',
    AuthenticationMiddleware,
    checkSchema(userGetSchema),
    requestHandler(UsersController.getUsersList)
  );
  app.post('/users/sessions', checkSchema(userSessionsPostSchema), requestHandler(UsersController.signIn));
  app.post(
    '/admin/users',
    AuthenticationMiddleware,
    checkSchema(adminUsersPostSchema),
    requestHandler(AdminsController.createAdmin)
  );
  app.post('/weets', AuthenticationMiddleware, requestHandler(WeetsController.createWeet));
  app.get(
    '/weets',
    AuthenticationMiddleware,
    checkSchema(weetsGetSchema),
    requestHandler(WeetsController.getWeets)
  );
  app.post(
    '/weets/:id(\\d+)/ratings',
    AuthenticationMiddleware,
    checkSchema(postRateWeet),
    requestHandler(WeetsController.rateWeet)
  );
};
