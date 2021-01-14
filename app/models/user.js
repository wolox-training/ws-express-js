/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable require-atomic-updates */

const { models: errorMessages } = require('../constants/errorMessages');
const getToken = require('../helpers/generateToken');
const HashUtils = require('../helpers/hashUtils');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: errorMessages.NotValidName
          },
          notEmpty: {
            args: true,
            msg: errorMessages.CannotBeEmpty
          }
        }
      },
      lastName: { type: DataTypes.STRING },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        },
        unique: {
          args: true,
          msg: errorMessages.EmailAlreadyInUseMessage
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [8, 60],
            msg: errorMessages.PasswordMinMaxLengthMessage
          }
        }
      },
      isAdmin: {
        type: DataTypes.BOOLEAN
      },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
    },
    {
      timestamps: true,
      underscored: true,
      hooks: {
        beforeCreate: async user => {
          const { password } = user;

          const hashedPassword = await HashUtils.generateHashedPassword(password);
          user.password = hashedPassword;
        }
      }
    }
  );

  User.associate = models => {
    User.hasMany(models.weet, { foreignKey: 'userId', as: 'weets' });
  };

  User.prototype.generateToken = function() {
    const { id, name, email } = this;
    return getToken({ id, name, email });
  };

  User.prototype.getPublicData = function() {
    const userData = this.toJSON();
    const { password: _, ...cleanedUser } = userData;
    return cleanedUser;
  };

  return User;
};
