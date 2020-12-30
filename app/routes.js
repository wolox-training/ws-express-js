const { requestHandler } = require('./helpers/requestHandler');

const WitterController = require('./controllers/witter');
const { healthCheck } = require('./controllers/healthCheck');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/witter', requestHandler(WitterController.getWitter));
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
