const axios = require('axios');
const config = require('../../config/index');

const {
  common: {
    external_services: { geek_jokes_url: GEEK_JOKES_URL }
  }
} = config;

const WitterServices = module.exports;

WitterServices.getJoke = () => axios.get(GEEK_JOKES_URL);
