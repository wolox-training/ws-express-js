const axios = require('axios');

const GEEK_JOKES_URL = 'https://geek-jokes.sameerkumar.website/api?format=json';

const WitterServices = module.exports;

WitterServices.getJoke = () => axios.get(GEEK_JOKES_URL);
