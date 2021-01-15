'use strict';
module.exports = (sequelize, DataTypes) => {
  const RatingWeet = sequelize.define(
    'rating',
    {
      ratingUserId: { type: DataTypes.INTEGER, allowNull: false },
      weetId: { type: DataTypes.INTEGER, allowNull: false },
      score: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
    },
    {
      timestamps: true,
      underscored: true
    }
  );

  RatingWeet.associate = models => {
    RatingWeet.belongsTo(models.user, { foreignKey: 'ratingUserId' });
    RatingWeet.belongsToMany(models.user, { through: 'weet', foreignKey: 'userId', as: 'author' });
  };

  return RatingWeet;
};
