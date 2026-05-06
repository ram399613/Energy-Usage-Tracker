const mongoose = require('mongoose');

const BillRecordSchema = new mongoose.Schema({
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  units: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BillRecord', BillRecordSchema);
