const axios = require('axios');

const axiosConfig = module.exports;

axiosConfig.initAxios = () => {
  const getResponse = response => {
    const { data: responseData } = response;
    return responseData;
  };

  const rejectResponse = error => {
    const { message, response: { status } = { status: 500 } } = error;
    const messageError = { status, message };

    return Promise.reject(messageError);
  };

  axios.interceptors.response.use(getResponse, rejectResponse);
};
