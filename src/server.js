require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const chatRoutes = require('./routes/chat.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// Render (and most cloud hosts) sit behind a reverse proxy — this tells
// Express to trust the X-Forwarded-For header so express-rate-limit can
// correctly identify each client. (Harmless locally too.)
app.set('trust proxy', 1);

app.use(cors()); // In production, restrict this to your app's known origins.
app.use(express.json({ limit: '30mb' })); // STAGE 6: images need more room than 1mb
app.use(morgan('dev')); // request logging — never logs API keys or full message bodies.

// Basic abuse protection (spec §18/§22). Tune these numbers for production.
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: 'Too many requests. Please slow down.' } }
});
app.use('/api/', limiter);

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'SARAA backend is running' });
});

app.use('/api/chat', chatRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Not found' } });
});

// --- Central error handler (never leaks stack traces to the client) ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, error: { message: 'Something went wrong. Please try again.' } });
});

app.listen(PORT, () => {
  console.log(`SARAA backend listening on http://localhost:${PORT}`);
});
