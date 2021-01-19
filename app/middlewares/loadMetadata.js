module.exports = (req, res, next) => {
  const accessToken = req.user;

  const user = accessToken['https://user_metadata'];

  req.user = { ...accessToken, ...user };

  next();
};
