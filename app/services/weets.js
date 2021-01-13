const axios = require('axios');

const { weet: WeetModel } = require('../models/index');
const config = require('../../config/index');

const MAX_LENGTH_WEET = 140;

const WeetsServices = module.exports;

const {
  common: {
    externalServices: { geekJokesUrl: GEEK_JOKES_URL }
  }
} = config;

WeetsServices.createWeet = async userId => {
  const { joke: weet } = await axios.get(GEEK_JOKES_URL);

  const content = weet.length > MAX_LENGTH_WEET ? weet.substring(0, MAX_LENGTH_WEET) : weet;

  return WeetModel.create({ userId, content });
};
