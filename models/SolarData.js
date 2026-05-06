const mongoose = require('mongoose');

const SolarDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  generated: { type: Number, required: true },
  exported: { type: Number, default: 0 },
  consumed: { type: Number, default: 0 }
});

module.exports = mongoose.model('SolarData', SolarDataSchema);
