/* eslint-disable require-atomic-updates */
const bcrypt = require('bcrypt');

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
            msg: 'Name cannot be null'
          },
          notEmpty: {
            args: true,
            msg: 'Name cannot be empty'
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
          msg: 'Email address already in use!'
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [8, 60],
            msg: 'Password length should be between 8 and 60'
          }
        }
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

          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
        }
      }
    }
  );

  return User;
};
