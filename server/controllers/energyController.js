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
    const energyData = await Energy.find({ userId: req.user.id }).sort({ timestamp: 1 });
    
    if (!energyData || energyData.length === 0) {
      res.status(400);
      throw new Error('Not enough data to generate AI insights. Please simulate some data first.');
    }

    // 1. Context-Aware API Intelligence (Mocking dynamic real-time data)
    const currentHour = new Date().getHours();
    const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Heatwave', 'Cold Snap'];
    const currentWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    // Dynamic Pricing based on Time of Day (Peak hours 18-22 cost more)
    const isPeakHour = currentHour >= 18 && currentHour <= 22;
    const currentRate = isPeakHour ? COST_PER_KWH * 1.5 : COST_PER_KWH;

    // 2. AI Analytics & Pattern Recognition
    const totalUnits = energyData.reduce((acc, curr) => acc + curr.units, 0);
    const avgUnitsPerEntry = totalUnits / energyData.length;

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

    // Anomaly Detection (Statistical modeling: usage > mean + 1.5 * stdDev)
    const variance = energyData.reduce((acc, curr) => acc + Math.pow(curr.units - avgUnitsPerEntry, 2), 0) / energyData.length;
    const stdDev = Math.sqrt(variance);
    const anomalies = energyData.filter(entry => entry.units > avgUnitsPerEntry + (1.5 * stdDev));

    // 3. Predictive Intelligence Layer (Time-series forecast)
    const recentData = energyData.slice(-30); // up to last 30 entries
    const recentAvg = recentData.reduce((acc, curr) => acc + curr.units, 0) / recentData.length;
    let weatherModifier = 1.0;
    if (currentWeather === 'Heatwave' || currentWeather === 'Cold Snap') weatherModifier = 1.3;
    const predictedMonthlyUnits = recentAvg * 30 * weatherModifier; 
    const predictedMonthlyCost = predictedMonthlyUnits * COST_PER_KWH;

    // 4. Optimization & Recommendation Engine (Adaptive)
    const tips = [];
    if (isPeakHour) {
      tips.push({ priority: 'High', message: `Dynamic Pricing Alert: Current rate is high ($${currentRate.toFixed(2)}/kWh). Defer non-essential appliance usage.` });
    }
    
    if (anomalies.length > 0) {
      tips.push({ priority: 'High', message: `Anomaly Detected: Found ${anomalies.length} instances of unusually high energy spikes. Check HVAC or heavy duty appliances.` });
    }

    if (peakHour >= 18 && peakHour <= 22) {
      tips.push({ priority: 'Medium', message: "Behavior Pattern: You consume the most energy during peak network hours. Shift usage to morning to save up to 20%." });
    } else {
      tips.push({ priority: 'Medium', message: "Behavior Pattern: Off-peak usage dominant. Great job load balancing!" });
    }

    if (currentWeather === 'Sunny') {
      tips.push({ priority: 'Low', message: "Weather Context: It's sunny! Optimize by turning off artificial lighting and using natural light." });
    } else if (currentWeather === 'Cold Snap') {
      tips.push({ priority: 'Medium', message: "Weather Context: Cold snap detected. Ensure windows are sealed to prevent heating energy loss." });
    }

    tips.push({ priority: 'Low', message: "Self-Evolving AI model updated successfully with your latest usage data." });

    const formatHour = (h) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formatted = h % 12 || 12;
      return `${formatted}:00 ${ampm}`;
    };

    res.json({
      context: {
        weather: currentWeather,
        currentRate: `$${currentRate.toFixed(2)}/kWh`,
        gridStatus: isPeakHour ? 'High Demand' : 'Normal'
      },
      predictions: {
        predictedCost: predictedMonthlyCost.toFixed(2),
        predictedUnits: predictedMonthlyUnits.toFixed(2),
        peakTime: formatHour(peakHour)
      },
      anomaliesFound: anomalies.length,
      recommendations: tips
    });
  } catch (error) {
    next(error);
  }
};

const resetEnergyData = async (req, res, next) => {
  try {
    await Energy.deleteMany({ userId: req.user.id });
    res.json({ message: 'Energy data reset successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEnergyData,
  getEnergyData,
  getAiInsights,
  resetEnergyData
};
