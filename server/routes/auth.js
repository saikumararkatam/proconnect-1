const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const payload = (u) => ({
  _id: u._id, name: u.name, email: u.email, role: u.role,
  title: u.title, bio: u.bio, skills: u.skills, hourlyRate: u.hourlyRate,
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'All fields are required' });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email is already registered' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: sign(user._id), user: payload(user) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Wrong email or password' });
    res.json({ token: sign(user._id), user: payload(user) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/me', protect, (req, res) => res.json({ user: payload(req.user) }));

router.put('/me', protect, async (req, res) => {
  const { name, title, bio, skills, hourlyRate } = req.body;
  if (name) req.user.name = name;
  if (title !== undefined) req.user.title = title;
  if (bio !== undefined) req.user.bio = bio;
  if (hourlyRate !== undefined) req.user.hourlyRate = hourlyRate;
  if (skills !== undefined)
    req.user.skills = Array.isArray(skills) ? skills : String(skills).split(',').map((s) => s.trim()).filter(Boolean);
  await req.user.save();
  res.json({ user: payload(req.user) });
});

module.exports = router;
