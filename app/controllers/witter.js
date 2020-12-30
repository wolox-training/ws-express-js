const WitterServices = require('../services/witter');

const WitterController = module.exports;

WitterController.getWitter = async (_, res) => {
  const geekJoke = await WitterServices.getJoke();
  res.status(200).send(geekJoke);
};
