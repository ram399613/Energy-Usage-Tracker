const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

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

// GET /api/energy - Get current energy status
app.get('/api/energy', (req, res) => {
  res.json({
    total: 152.4,
    current: 2.84,
    bill: 2450,
    efficiency: 94,
    carbon: 12.4
  });
});

// POST /api/usage - Log new energy usage
app.post('/api/usage', (req, res) => {
  const { usage, device } = req.body;
  // Logic to save to MongoDB would go here
  res.status(201).json({ message: 'Usage data indexed', data: { usage, device } });
});

// GET /api/predictions - Get AI forecast
app.get('/api/predictions', (req, res) => {
  res.json({
    historical: [45, 52, 48, 60, 55, 65],
    forecast: [70, 75, 72, 80, 85, 90]
  });
});

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
