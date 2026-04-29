const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const mongoose    = require('mongoose');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://consistency-project-9x6k.vercel.app' // deployed frontend
  ],
  credentials: true,
}));
app.use(express.json());

// ── Serverless-safe DB connection ──
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ── Routes ──
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/focus',     require('./routes/focus'));
app.use('/api/habits',    require('./routes/habits'));
app.use('/api/wins',      require('./routes/wins'));
app.use('/api/failures',  require('./routes/failures'));
app.use('/api/streaks',   require('./routes/streaks'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/badges',    require('./routes/badges'));

app.get('/', (req, res) => res.json({ status: 'RiseLog API running ✅' }));

app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Only listen locally — Vercel handles this in production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;