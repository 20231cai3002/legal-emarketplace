const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const { AppError } = require('../utils/error');
const { rewardCompletion } = require('../services/incentiveService');

exports.createBooking = async (req, res, next) => {
  try {
    const { providerId, date, time, notes } = req.body;
    if (!providerId || !date || !time) throw new AppError('Missing fields');
    const provider = await Provider.findById(providerId);
    if (!provider) throw new AppError('Provider not found', 404);

    // conflict: booking exists with same provider/date/time not rejected
    const conflict = await Booking.findOne({ provider: providerId, date, time, status: { $in: ['PENDING','ACCEPTED','COMPLETED'] } });
    if (conflict) throw new AppError('Slot not available', 409);

    const booking = await Booking.create({ citizen: req.user.id, provider: providerId, date, time, notes });
    res.status(201).json(booking);
  } catch (err) { next(err); }
};

exports.myBookings = async (req, res, next) => {
  try {
    const filter = req.user.role === 'CITIZEN' ? { citizen: req.user.id } : { provider: (await Provider.findOne({ user: req.user.id }))._id };
    const bookings = await Booking.find(filter).populate('provider').populate('citizen', 'name email phone');
    res.json(bookings);
  } catch (err) { next(err); }
};

exports.respondBooking = async (req, res, next) => {
  try {
    const { bookingId, action } = req.body; // ACCEPT or REJECT
    const booking = await Booking.findById(bookingId);
    const provider = await Provider.findOne({ user: req.user.id });
    if (!booking || !provider || String(booking.provider) !== String(provider._id)) throw new AppError('Not found or unauthorized', 404);
    booking.status = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    await booking.save();
    res.json(booking);
  } catch (err) { next(err); }
};

exports.completeBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    const provider = await Provider.findOne({ user: req.user.id });
    if (!booking || !provider || String(booking.provider) !== String(provider._id)) throw new AppError('Not found or unauthorized', 404);
    booking.status = 'COMPLETED';
    await booking.save();
    await rewardCompletion(provider._id);
    res.json(booking);
  } catch (err) { next(err); }
};