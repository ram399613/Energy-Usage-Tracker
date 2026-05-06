const mongoose = require('mongoose');

const energySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  units: {
    type: Number,
    required: [true, 'Please add consumed units in kWh']
  },
  cost: {
    type: Number,
    required: true
  },
  voltage: {
    type: Number,
    default: 0
  },
  current: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Energy', energySchema);
