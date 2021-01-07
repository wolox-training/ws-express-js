const { requestHandler } = require('./helpers/requestHandler');

const WitterController = require('./controllers/witter');
const UsersController = require('./controllers/users');
const { healthCheck } = require('./controllers/healthCheck');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/witter', requestHandler(WitterController.getWitter));
  app.post('/users', requestHandler(UsersController.createUser));
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
