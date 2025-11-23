const mongoose = require('mongoose');

const incentiveSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    points: { type: Number, required: true },
    reason: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incentive', incentiveSchema);