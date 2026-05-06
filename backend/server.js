const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
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
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Set up static folder - serving from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));
// Also serve assets if any
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// API Routes
app.use('/api', require('../routes/api'));

// Socket.io
io.on('connection', (socket) => {
  console.log('AI System: Client connected to neural grid');
  
  // Simulation of live updates
  const interval = setInterval(async () => {
    socket.emit('live-update', {
      timestamp: new Date(),
      usage: (Math.random() * 5).toFixed(2)
    });
  }, 5000);

  socket.on('disconnect', () => {
    clearInterval(interval);
  });
});

app.set('io', io);

// Fallback for SPA - redirect to dashboard.html since index.html might be removed or changed
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'dashboard.html'));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 AI Energy Backend running on port ${PORT}`);
});
