const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: 'fa-plug' },
  status: { type: String, enum: ['Active', 'Idle', 'ON', 'OFF'], default: 'Idle' },
  usage: { type: Number, default: 0 }, // Current usage in kW or units
  watts: { type: Number, default: 100 }, // Specific wattage for this device
  category: { type: String, default: 'General' },
  efficiency: { type: String, default: '95%' },
  health: { type: Number, default: 98 },
  runtime: { type: Number, default: 0 }, // Cumulative runtime in hours
  lastReset: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', DeviceSchema);
