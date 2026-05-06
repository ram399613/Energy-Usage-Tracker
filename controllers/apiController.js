const Device = require('../models/Device');
const Energy = require('../models/Energy');

exports.getDashboardData = async (req, res) => {
  try {
    const devices = await Device.find();
    const activeUsage = devices.reduce((sum, d) => sum + (d.status === 'Active' || d.status === 'ON' ? Math.abs(d.usage) : 0), 0);
    
    const logs = await Energy.find();
    const totalConsumed = logs.reduce((sum, log) => sum + log.units, 0) + 152.4;
    
    res.json({
      devices,
      metrics: {
        currentUsage: activeUsage.toFixed(2),
        totalConsumed: totalConsumed.toFixed(1),
        bill: (totalConsumed * 8.0).toFixed(0),
        carbon: (totalConsumed * 0.82).toFixed(1),
        ecoScore: 94,
        activeDevices: devices.filter(d => d.status === 'Active' || d.status === 'ON').length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleDevice = async (req, res) => {
  try {
    const { deviceId, status } = req.body;
    let usage = 0;
    if (status === 'Active' || status === 'ON') {
      const dev = await Device.findById(deviceId);
      if (dev.name.includes('AC')) usage = 1.5;
      else if (dev.name.includes('Fan')) usage = 0.05;
      else if (dev.name.includes('TV')) usage = 0.15;
      else if (dev.name.includes('Refrigerator')) usage = 0.2;
      else if (dev.name.includes('Washing')) usage = 0.5;
      else if (dev.name.includes('Lights')) usage = 0.02;
      else if (dev.name.includes('Laptop')) usage = 0.06;
      else if (dev.name.includes('Heater')) usage = 2.0;
      else usage = (Math.random() * 0.5 + 0.1).toFixed(2);
    }
    const device = await Device.findByIdAndUpdate(deviceId, { status, usage }, { new: true });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addManualEnergy = async (req, res) => {
  try {
    const { deviceName, units, hoursUsed, category } = req.body;
    const cost = units * 8.0;
    const newEntry = new Energy({
      deviceName,
      units: parseFloat(units),
      hoursUsed: parseFloat(hoursUsed),
      category,
      cost
    });
    await newEntry.save();
    res.json({ success: true, entry: newEntry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPredictions = (req, res) => {
  res.json({
    historical: [45, 52, 48, 60, 55, 65, 70],
    forecast: [72, 75, 78, 80, 85, 90, 88],
    billEstimate: 2850,
    savingsTips: [
      "AC is consuming 30% more than average.",
      "Turn OFF TV to save 1.2 kWh.",
      "Energy spike detected in Kitchen.",
      "Best saving time: 2 PM – 5 PM."
    ]
  });
};
