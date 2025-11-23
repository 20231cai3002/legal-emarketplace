const Provider = require('../models/Provider');
const Incentive = require('../models/Incentive');

const addPoints = async (providerId, points, reason) => {
  await Incentive.create({ provider: providerId, points, reason });
  await Provider.findByIdAndUpdate(providerId, { $inc: { incentivePoints: points } });
};

const rewardCompletion = async (providerId) => addPoints(providerId, 10, 'Completed service');
const rewardPositiveRating = async (providerId) => addPoints(providerId, 5, 'Positive rating');
// called monthly (cron) to check 10+ bookings
const rewardMonthlyBonus = async (providerId) => addPoints(providerId, 20, 'Monthly 10+ bookings bonus');

module.exports = { addPoints, rewardCompletion, rewardPositiveRating, rewardMonthlyBonus };