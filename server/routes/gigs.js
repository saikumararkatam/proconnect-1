const router = require('express').Router();
const Gig = require('../models/Gig');
const { protect, allow } = require('../middleware/auth');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res) => {
  const { q, category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ title: rx }, { tags: rx }];
  }
  res.json(await Gig.find(filter).populate('freelancer', 'name title').sort('-createdAt'));
});

router.get('/mine', protect, allow('freelancer'), async (req, res) => {
  res.json(await Gig.find({ freelancer: req.user._id }).sort('-createdAt'));
});

router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('freelancer', 'name title bio skills');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch {
    res.status(404).json({ message: 'Gig not found' });
  }
});

router.post('/', protect, allow('freelancer'), async (req, res) => {
  try {
    const { tags, ...rest } = req.body;
    const gig = await Gig.create({
      ...rest,
      tags: String(tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      freelancer: req.user._id,
    });
    res.status(201).json(gig);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', protect, allow('freelancer'), async (req, res) => {
  const gig = await Gig.findOneAndDelete({ _id: req.params.id, freelancer: req.user._id });
  if (!gig) return res.status(404).json({ message: 'Gig not found' });
  res.json({ message: 'Gig deleted' });
});

module.exports = router;
