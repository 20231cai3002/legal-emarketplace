const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    experience: { type: Number, required: true, min: 0 },
    profession: { type: String, enum: ['Advocate','Mediator','Arbitrator','Notary','DocumentWriter'], required: true },
    licenseNumber: { type: String, required: true, unique: true },
    documentUrl: { type: String }, // simple URL for uploaded doc
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    availability: [
      {
        date: { type: String }, // ISO date string (YYYY-MM-DD)
        slots: [{ type: String }] // e.g., "10:00","10:30"
      }
    ],
    incentivePoints: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Provider', providerSchema);