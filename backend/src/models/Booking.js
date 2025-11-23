const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    status: { type: String, enum: ['PENDING','ACCEPTED','REJECTED','COMPLETED'], default: 'PENDING' },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);