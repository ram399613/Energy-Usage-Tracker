const mongoose = require('mongoose');

const EnergyLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalKwh: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  tariff: { type: Number, default: 0.12 },
  peakHours: { type: String, default: '17:00-21:00' },
  temperature: {
    indoor: Number,
    outdoor: Number,
    unit: { type: String, default: 'C' }
  },
  solar: {
    generated: { type: Number, default: 0 },
    exported: { type: Number, default: 0 },
    selfConsumed: { type: Number, default: 0 }
  },
  appliances: [{
    name: String,
    kwh: Number,
    hoursOn: Number,
    isEssential: { type: Boolean, default: false },
    isSchedulable: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('EnergyLog', EnergyLogSchema);
