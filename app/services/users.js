const { user: UserModel, blacklist: BlacklistModel } = require('../models/index');
const { notFoundError, unauthorizedError } = require('../errors');
const HashUtils = require('../helpers/hashUtils');
const MailUtils = require('../helpers/mailUtils');
const { users: errorMessages } = require('../constants/errorMessages');

const UsersServices = module.exports;

UsersServices.createUser = async userData => {
  const { password } = userData;

  const createdUser = await UserModel.create(userData);

  MailUtils.sendMail(createdUser, password);

  return createdUser;
};

UsersServices.signIn = async (email, password) => {
  const user = await UserModel.findOne({ where: { email } });

  if (!user) throw notFoundError(errorMessages.UserNotFoundMessage);

  const { password: hashedPassword } = user;

  const isValidPassword = await HashUtils.comparePassword(password, hashedPassword);

  if (!isValidPassword) throw unauthorizedError(errorMessages.IncorrectPasswordMessage);

  const token = user.generateToken();

  const { id: userId } = user;

  await BlacklistModel.create({ userId, token });

  return { ...user.getPublicData(), token };
};

UsersServices.getUsersList = async (page, size) => {
  const offset = (page - 1) * size;

  const paginatedUsers = await UserModel.findAll({ limit: size, offset }).map(user => user.getPublicData());

  return { users: paginatedUsers };
};

UsersServices.invalidateAllSessions = userId =>
  BlacklistModel.update({ isDisable: true }, { where: { userId } });
