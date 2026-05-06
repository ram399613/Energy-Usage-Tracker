const Device = require('../models/Device');
const Energy = require('../models/Energy');

// Slab rates for bill calculation
const calculateBill = (units) => {
  let bill = 0;
  if (units <= 100) bill = units * 4.5;
  else if (units <= 300) bill = (100 * 4.5) + (units - 100) * 7.0;
  else bill = (100 * 4.5) + (200 * 7.0) + (units - 300) * 9.5;
  return Math.round(bill);
};

exports.getDashboardData = async (req, res) => {
  try {
    const devices = await Device.find();
    const activeDevices = devices.filter(d => d.status === 'Active' || d.status === 'ON');
    
    // Calculate total instantaneous load in kW
    const totalLoad = activeDevices.reduce((sum, d) => sum + (d.watts / 1000), 0);
    
    // Fetch total energy from logs (simulated for now)
    const energyLogs = await Energy.find().sort({ timestamp: -1 }).limit(100);
    const totalConsumed = energyLogs.reduce((sum, log) => sum + log.units, 0).toFixed(2);
    
    const bill = calculateBill(totalConsumed);

    res.json({
      devices,
      metrics: {
        totalConsumed,
        activeDevices: activeDevices.length,
        bill,
        ecoScore: Math.max(70, 100 - (activeDevices.length * 5))
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleDevice = async (req, res) => {
  try {
    const { deviceId, status } = req.body;
    const dev = await Device.findById(deviceId);
    
    // Status can be 'Active' or 'Idle'
    let usage = 0;
    if (status === 'Active' || status === 'ON') {
      usage = dev.watts / 1000; // instantaneous load in kW
    }
    
    const device = await Device.findByIdAndUpdate(deviceId, { status, usage }, { new: true });
    
    // Log energy change if turned ON
    if (status === 'Active' || status === 'ON') {
        await Energy.create({
            deviceName: device.name,
            units: usage * 0.1, // Simulated 6 min (0.1hr) usage for log
            hoursUsed: 0.1,
            category: device.category
        });
    }

    res.json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addManualEnergy = async (req, res) => {
  try {
    const { deviceName, units, hoursUsed, category } = req.body;
    const newEntry = new Energy({ deviceName, units, hoursUsed, category });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPredictions = async (req, res) => {
  try {
    // Simple prediction based on current load
    const devices = await Device.find();
    const currentLoad = devices.filter(d => d.status === 'Active').reduce((sum, d) => sum + (d.watts / 1000), 0);
    
    const historical = [45, 52, 48, 60, 55, 65, 70];
    const forecast = historical.map(v => Math.round(v + (currentLoad * 10)));

    res.json({
      historical,
      forecast,
      savingsTips: [
          "Optimizing AC temperature could save ₹450/month.",
          "LED light transition complete. Efficiency is at 98%.",
          "Water heater detected in peak hours. Shift to 6 AM."
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
