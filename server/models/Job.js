const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true, min: 1 },
    skills: [String],
    status: { type: String, enum: ['open', 'in_progress', 'completed'], default: 'open' },
    hiredFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
