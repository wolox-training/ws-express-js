const axios = require('axios');

const { weet: WeetModel, rating: RatingModel, sequelize } = require('../models/index');
const config = require('../../config/index');
const { badRequestError, notFoundError } = require('../errors');
const { weets: errorMessages } = require('../constants/errorMessages');

const MAX_LENGTH_WEET = 140;

const WeetsServices = module.exports;

const {
  common: {
    externalServices: { geekJokesUrl: GEEK_JOKES_URL }
  }
} = config;

WeetsServices.createWeet = async userId => {
  const { joke: weet } = await axios.get(GEEK_JOKES_URL);

  const content = weet.length > MAX_LENGTH_WEET ? weet.substring(0, MAX_LENGTH_WEET) : weet;

  return WeetModel.create({ userId, content });
};

WeetsServices.getWeets = async queryPagingData => {
  const { page, size } = queryPagingData;
  const offset = (page - 1) * size;

  const listTweets = await WeetModel.findAll({ limit: size, offset });

  return { weets: [...listTweets] };
};

WeetsServices.getUserWeets = (user, queryPagingData) => {
  const { page, size } = queryPagingData;
  const offset = (page - 1) * size;

  return user.getWeets({
    limit: page,
    offset
  });
};

WeetsServices.rateWeet = async (ratingUserId, weetId, rate) => {
  const transaction = await sequelize.transaction();
  const ratingData = {
    ratingUserId,
    weetId,
    score: rate
  };

  try {
    const isAlreadyRated = await RatingModel.findOne({ where: ratingData });

    if (isAlreadyRated) throw badRequestError(errorMessages.weetAlreadyRatedMessage);

    const isExistingWeet = await WeetModel.findOne({ where: { id: weetId } });

    if (!isExistingWeet) throw notFoundError(errorMessages.weetDoNotExistsMessage);

    const createdRating = await RatingModel.create(
      {
        ratingUserId,
        weetId,
        score: rate
      },
      { transaction }
    );

    await transaction.commit();

    return createdRating;
  } catch (err) {
    if (transaction.rollback) await transaction.rollback();
    throw err;
  }
};
