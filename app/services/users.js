const { user: UserModel } = require('../models/index');
const { notFoundError, unauthorizedError } = require('../errors');
const HashUtils = require('../helpers/hashUtils');

const UsersServices = module.exports;

UsersServices.createUser = userData => UserModel.create(userData);

UsersServices.signIn = async (email, password) => {
  const user = await UserModel.findOne({ where: { email } });

  if (!user) throw notFoundError('User not found');

  const { password: hashedPassword } = user;

  const isValidPassword = await HashUtils.comparePassword(password, hashedPassword);

  if (!isValidPassword) throw unauthorizedError('Incorrect password');

  const token = user.generateToken();

  return { ...user.getPublicData(), token };
};
