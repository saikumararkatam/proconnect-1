const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema(
  {
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    deliveryDays: { type: Number, required: true, min: 1 },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gig', gigSchema);
