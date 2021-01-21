'use strict';
module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define(
    'weet',
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
    },
    {
      timestamps: true,
      underscored: true
    }
  );

  Weet.associate = models => {
    Weet.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return Weet;
};
