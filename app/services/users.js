const { user: UserModel } = require('../models/index');

const UsersServices = module.exports;

UsersServices.createUser = userData => UserModel.create(userData);
