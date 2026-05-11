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
  
  socket.on('disconnect', () => {
    console.log('AI System: Client disconnected');
  });
});

// --- REAL-TIME ENERGY SIMULATION ENGINE ---
// This background worker simulates power consumption by active devices every 10 seconds
const Device = require('./models/Device');
const Energy = require('./models/Energy');

setInterval(async () => {
    try {
        const activeDevices = await Device.find({ status: { $in: ['Active', 'ON'] } });
        if (activeDevices.length > 0) {
            for (const device of activeDevices) {
                // Consume 1/360th of the hourly usage (since 10s = 1/360 of an hour)
                const unitsConsumed = (device.watts / 1000) / 360;
                
                await Energy.create({
                    deviceName: device.name,
                    units: unitsConsumed,
                    cost: unitsConsumed * 7.5, // Avg slab rate
                    hoursUsed: 1/360,
                    category: device.category
                });
            }
            
            // Broadcast live update via socket
            const totalLoad = activeDevices.reduce((sum, d) => sum + (d.watts / 1000), 0).toFixed(2);
            io.emit('live-update', {
                timestamp: new Date(),
                usage: totalLoad
            });
        }
    } catch (err) {
        console.error("Simulation Engine Error:", err);
    }
}, 10000); // Update every 10 seconds

app.set('io', io);

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 AI Energy Backend running on port ${PORT}`);
});
