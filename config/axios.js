const axios = require('axios');
const logger = require('../app/logger');
const { getErrorMessage } = require('../app/errors');

const axiosConfig = module.exports;

axiosConfig.initAxios = () => {
  const getResponse = response => {
    const { data: responseData } = response;
    return responseData;
  };

  const rejectResponse = error => {
    const { message, response: { status } = { status: 500 } } = error;
    const messageError = { status, message: getErrorMessage[status](message) };

    logger.error(error);
    return Promise.reject(messageError);
  };

  axios.interceptors.response.use(getResponse, rejectResponse);
};
