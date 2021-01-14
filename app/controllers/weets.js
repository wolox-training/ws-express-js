const WeetsServices = require('../services/weets');

const WeetsController = module.exports;

WeetsController.createWeet = async (req, res) => {
  const {
    user: { id }
  } = req;

  const createdWeet = await WeetsServices.createWeet(id);
  res.status(201).send(createdWeet);
};
