const handleAsyncError = test => async done => {
  try {
    await test();
    done();
  } catch (error) {
    done.fail(error);
  }
};

module.exports = handleAsyncError;
