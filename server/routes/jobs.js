const router = require('express').Router();
const Job = require('../models/Job');
const Proposal = require('../models/Proposal');
const { protect, allow } = require('../middleware/auth');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res) => {
  const { q, category } = req.query;
  const filter = { status: 'open' };
  if (category) filter.category = category;
  if (q) filter.title = new RegExp(escapeRegex(q), 'i');
  res.json(await Job.find(filter).populate('client', 'name').sort('-createdAt'));
});

router.get('/mine', protect, allow('client'), async (req, res) => {
  res.json(await Job.find({ client: req.user._id }).populate('hiredFreelancer', 'name').sort('-createdAt'));
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('client', 'name').populate('hiredFreelancer', 'name');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch {
    res.status(404).json({ message: 'Job not found' });
  }
});

router.post('/', protect, allow('client'), async (req, res) => {
  try {
    const { skills, ...rest } = req.body;
    const job = await Job.create({
      ...rest,
      skills: String(skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      client: req.user._id,
    });
    res.status(201).json(job);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id/complete', protect, allow('client'), async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, client: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  job.status = 'completed';
  await job.save();
  res.json(job);
});

router.get('/:id/proposals', protect, allow('client'), async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, client: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(
    await Proposal.find({ job: job._id })
      .populate('freelancer', 'name title skills hourlyRate')
      .sort('-createdAt')
  );
});

module.exports = router;
