const mongoose = require('mongoose');

const UsageLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  totalUsage: { type: Number, required: true }, // in kWh
  activeDevicesCount: { type: Number, required: true },
  projectedBill: { type: Number },
  topConsumingDevice: { type: String }
});

module.exports = mongoose.model('UsageLog', UsageLogSchema);
