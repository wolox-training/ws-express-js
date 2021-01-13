/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable require-atomic-updates */

const { models: errorMessages } = require('../constants/errorMessages');
const getToken = require('../helpers/generateToken');
const HashUtils = require('../helpers/hashUtils');

const getPositionByScore = score => {
  let position = 'Developer';
  if (score > 5 && score <= 9) position = 'Lead';
  else if (score > 10 && score <= 19) position = 'TL';
  else if (score > 20 && score <= 29) position = 'EM';
  else if (score > 30 && score <= 49) position = 'HEAD';
  else if (score > 50) position = 'CEO';

  return position;
};

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
    User.belongsToMany(models.rating, { through: 'weet', foreignKey: 'userId', as: 'ratings' });
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

  User.prototype.getPosition = async function() {
    const ratings = await this.getRatings();
    const totalScore = ratings.reduce((accumulator, { score }) => accumulator + score, 0);
    return getPositionByScore(totalScore);
  };

  return User;
};
