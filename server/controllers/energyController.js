const Energy = require('../models/Energy');

// Rate for electricity cost calculation (e.g., $0.15 per kWh)
const COST_PER_KWH = 0.15;

const addEnergyData = async (req, res, next) => {
  try {
    const { units } = req.body;

    if (units === undefined || units === null) {
      res.status(400);
      throw new Error('Please provide consumed units');
    }

    const cost = units * COST_PER_KWH;

    const energyData = await Energy.create({
      userId: req.user.id,
      units,
      cost
    });

    // Emitting real-time event via socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(req.user.id.toString()).emit('newEnergyData', energyData);
    }

    res.status(201).json(energyData);
  } catch (error) {
    next(error);
  }
};

const getEnergyData = async (req, res, next) => {
  try {
    const { filter } = req.query; // e.g. daily, weekly, monthly
    
    let dateFilter = new Date();
    if (filter === 'daily') {
      dateFilter.setDate(dateFilter.getDate() - 1);
    } else if (filter === 'weekly') {
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (filter === 'monthly') {
      dateFilter.setMonth(dateFilter.getMonth() - 1);
    } else {
      // default to last 30 days
      dateFilter.setDate(dateFilter.getDate() - 30);
    }

    const energyData = await Energy.find({
      userId: req.user.id,
      timestamp: { $gte: dateFilter }
    }).sort({ timestamp: 1 });

    res.json(energyData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEnergyData,
  getEnergyData
};
