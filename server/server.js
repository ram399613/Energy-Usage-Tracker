const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const Device = require('./models/Device');
const Energy = require('./models/Energy');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Set up static folder for client
app.use(express.static(path.join(__dirname, '../frontend')));

// --- New API Routes for AI Project ---

// GET /api/energy/live - Live status
app.get('/api/energy/live', (req, res) => {
  res.json({ usage: (Math.random() * 5).toFixed(2), timestamp: new Date() });
});

// GET /api/devices - Device list from DB
app.get('/api/devices', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/device/toggle - Toggle device status in DB
app.post('/api/device/toggle', async (req, res) => {
  try {
    const { deviceId, status } = req.body;
    const usage = status === 'Active' ? (Math.random() * 1.5 + 0.1).toFixed(2) : 0;
    const device = await Device.findByIdAndUpdate(deviceId, { status, usage }, { new: true });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/device/update - For legacy compatibility
app.post('/api/device/update', async (req, res) => {
  const { device, status } = req.body;
  await Device.findOneAndUpdate({ name: device }, { status });
  res.json({ message: `${device} is now ${status}` });
});

// GET /api/predictions - Get AI forecast
app.get('/api/predictions', (req, res) => {
  res.json({
    historical: [45, 52, 48, 60, 55, 65],
    forecast: [70, 75, 72, 80, 85, 90]
  });
});
app.get('/api/prediction', (req, res) => res.redirect('/api/predictions'));

// GET /api/alerts - Get abnormal spikes
app.get('/api/alerts', (req, res) => {
  res.json([
    { id: 1, type: 'spike', device: 'AC', timestamp: new Date(), magnitude: '20%' }
  ]);
});

// Existing Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  socket.on('join', (userId) => {
    socket.join(userId);
  });
});

app.set('io', io);

// Error Handling Middleware
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
