/* eslint-disable new-cap */
module.exports = (sequelize, DataTypes) => {
  const Blacklist = sequelize.define(
    'blacklist',
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      token: { type: DataTypes.STRING(1000), allowNull: false },
      isDisable: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
    },
    {
      timestamps: true,
      underscored: true
    }
  );

  Blacklist.associate = models => {
    Blacklist.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return Blacklist;
};
