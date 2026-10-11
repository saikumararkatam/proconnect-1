const router = require('express').Router();
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const { protect, allow } = require('../middleware/auth');

router.post('/', protect, allow('freelancer'), async (req, res) => {
  try {
    const { jobId, coverLetter, bid, deliveryDays } = req.body;
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'open') return res.status(400).json({ message: 'This job is not open' });
    const proposal = await Proposal.create({
      job: jobId, freelancer: req.user._id, coverLetter, bid, deliveryDays,
    });
    res.status(201).json(proposal);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: 'You already sent a proposal for this job' });
    res.status(400).json({ message: e.message });
  }
});

router.get('/mine', protect, allow('freelancer'), async (req, res) => {
  res.json(await Proposal.find({ freelancer: req.user._id }).populate('job', 'title budget status').sort('-createdAt'));
});

router.put('/:id/accept', protect, allow('client'), async (req, res) => {
  const proposal = await Proposal.findById(req.params.id).populate('job');
  if (!proposal || String(proposal.job.client) !== String(req.user._id))
    return res.status(404).json({ message: 'Proposal not found' });
  if (proposal.job.status !== 'open')
    return res.status(400).json({ message: 'This job already has a freelancer' });

  proposal.status = 'accepted';
  await proposal.save();
  await Proposal.updateMany({ job: proposal.job._id, _id: { $ne: proposal._id } }, { status: 'rejected' });

  proposal.job.status = 'in_progress';
  proposal.job.hiredFreelancer = proposal.freelancer;
  await proposal.job.save();

  res.json({ message: 'Freelancer hired' });
});

module.exports = router;
