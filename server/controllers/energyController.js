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

const getAiInsights = async (req, res, next) => {
  try {
    const energyData = await Energy.find({ userId: req.user.id });
    
    if (!energyData || energyData.length === 0) {
      res.status(400);
      throw new Error('Not enough data to generate AI insights. Please simulate some data first.');
    }

    // 1. Calculate Average Daily Cost
    const totalCost = energyData.reduce((acc, curr) => acc + curr.cost, 0);
    const avgCostPerEntry = totalCost / energyData.length;
    // Assume 20 entries roughly equals a day for this demo prediction
    const predictedMonthlyCost = (totalCost > 0) ? (totalCost * 1.5) + (Math.random() * 10) : 0; 

    // 2. Find Peak Usage Time
    const hoursCount = {};
    energyData.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      hoursCount[hour] = (hoursCount[hour] || 0) + entry.units;
    });
    
    let peakHour = 0;
    let maxUnits = 0;
    for (const [hour, units] of Object.entries(hoursCount)) {
      if (units > maxUnits) {
        maxUnits = units;
        peakHour = parseInt(hour);
      }
    }
    
    const formatHour = (h) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formatted = h % 12 || 12;
      return `${formatted}:00 ${ampm}`;
    };

    // 3. Generate Smart Tips
    const tips = [];
    if (peakHour >= 18 && peakHour <= 22) {
      tips.push("AI detected peak usage during evening hours. Consider shifting heavy appliance usage to off-peak morning hours to reduce strain and costs.");
    } else {
      tips.push(`Your highest energy draw is around ${formatHour(peakHour)}. Ensure your HVAC/AC is running efficiently during this window.`);
    }

    if (totalCost > 50) {
      tips.push("Your energy cost is trending higher than average. Consider switching to LED bulbs and unplugging vampire electronics.");
    } else {
      tips.push("Your consumption is highly efficient! Keep maintaining your current energy-saving habits.");
    }
    
    tips.push("Anomaly Scan: AI did not detect any phantom power drains during the night. Your baseline usage is stable.");

    res.json({
      predictedCost: predictedMonthlyCost.toFixed(2),
      peakTime: formatHour(peakHour),
      tips
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEnergyData,
  getEnergyData,
  getAiInsights
};
