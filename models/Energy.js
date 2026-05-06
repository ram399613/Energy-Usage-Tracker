const mongoose = require('mongoose');

const energySchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true
  },
  units: {
    type: Number,
    required: [true, 'Please add consumed units in kWh']
  },
  cost: {
    type: Number,
    required: true
  },
  hoursUsed: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    default: 'General'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Energy', energySchema);
