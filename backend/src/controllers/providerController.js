const Provider = require('../models/Provider');
const User = require('../models/User');
const { AppError } = require('../utils/error');

exports.getProviders = async (req, res, next) => {
  try {
    const { q, profession, minExp = 0 } = req.query;
    const usersMatch = q ? await User.find({ role: 'PROVIDER', name: new RegExp(q, 'i') }) : [];
    const filter = {
      ...(profession ? { profession } : {}),
      experience: { $gte: Number(minExp) },
      ...(q ? { user: { $in: usersMatch.map(u => u._id) } } : {})
    };
    const providers = await Provider.find(filter).populate('user', 'name email phone');
    res.json(providers);
  } catch (err) { next(err); }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) throw new AppError('Provider not found', 404);
    provider.availability = req.body.availability || [];
    await provider.save();
    res.json(provider);
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id }).populate('user', 'name email phone');
    if (!provider) throw new AppError('Provider not found', 404);
    res.json(provider);
  } catch (err) { next(err); }
};