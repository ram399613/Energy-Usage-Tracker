const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Idle'], default: 'Idle' },
  usage: { type: Number, default: 0 },
  efficiency: { type: String, default: '--' },
  icon: { type: String, default: 'fa-bolt' },
  room: { type: String, default: 'General' }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
