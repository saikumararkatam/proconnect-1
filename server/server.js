require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Missing MONGO_URI or JWT_SECRET environment variable');
  process.exit(1);
}

connectDB();
const app = express();
app.set('trust proxy', 1); // required behind Render/Railway/Nginx proxies

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

app.get('/api/health', (_req, res) => res.json({ app: 'ProConnect', status: 'ok' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gigs', require('./routes/gigs'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/proposals', require('./routes/proposals'));

// Serve the React build from the same server (one deployment = one live URL)
const dist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`ProConnect running on port ${PORT}`));
