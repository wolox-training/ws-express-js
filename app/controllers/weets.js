const { validationResult } = require('express-validator');

const errors = require('../errors');
const WeetsServices = require('../services/weets');

const WeetsController = module.exports;

WeetsController.createWeet = async (req, res) => {
  const {
    user: { id }
  } = req;

  const createdWeet = await WeetsServices.createWeet(id);
  res.status(201).send(createdWeet);
};

WeetsController.getWeets = async (req, res) => {
  const isValidRequest = validationResult(req).array();

  if (isValidRequest.length) {
    throw errors.badRequestError(isValidRequest[0].msg);
  }

  const { query: queryPagingData } = req;

  const weets = await WeetsServices.getWeets(queryPagingData);

  res.status(200).send(weets);
};

WeetsController.getUserWeets = async (req, res) => {
  const { user, query: queryPagingData } = req;

  const weets = await WeetsServices.getUserWeets(user, queryPagingData);

  res.status(200).send(weets);
};

WeetsController.rateWeet = async (req, res) => {
  const isValidRequest = validationResult(req).array();

  if (isValidRequest.length) {
    throw errors.badRequestError(isValidRequest[0].msg);
  }

  const {
    params: { id: weetId },
    user: { id: userId },
    body: { rate }
  } = req;

  const createdRating = await WeetsServices.rateWeet(userId, weetId, rate);

  res.status(201).send(createdRating);
};
