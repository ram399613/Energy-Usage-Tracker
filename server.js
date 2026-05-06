const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./utils/db');
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

// Set up static folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', require('./routes/api'));
app.use('/api/ai', require('./masterPrompt'));

// Socket.io
io.on('connection', (socket) => {
  console.log('AI System: Client connected to neural grid');
  
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

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 AI Energy Backend running on port ${PORT}`);
});
