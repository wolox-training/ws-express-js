const { user: UserModel } = require('../models/index');

const AdminsServices = module.exports;

AdminsServices.createAdmin = async adminData => {
  const { name, lastName, email, password } = adminData;

  const userData = await UserModel.findOrCreate({
    where: { email },
    defaults: { name, lastName, email, password, isAdmin: true }
  });

  const [user, isCreated] = userData;
  const { isAdmin } = user;

  if (!isCreated && !isAdmin) {
    user.isAdmin = true;
    await user.save();
  }

  return { admin: user.getPublicData(), isCreated };
};
