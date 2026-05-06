const mongoose = require('mongoose');
const Energy = require('./models/Energy');
require('dotenv').config();

const seedEnergy = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB to seed initial energy logs...');

    const initialLogs = [
      { deviceName: 'Air Conditioner', units: 45.5, cost: 204.75, hoursUsed: 30, category: 'HVAC' },
      { deviceName: 'Refrigerator', units: 22.0, cost: 99.00, hoursUsed: 168, category: 'Appliances' },
      { deviceName: 'OLED TV', units: 12.4, cost: 55.80, hoursUsed: 40, category: 'Electronics' },
      { deviceName: 'Water Heater', units: 35.0, cost: 157.50, hoursUsed: 15, category: 'HVAC' }
    ];

    await Energy.deleteMany({});
    await Energy.insertMany(initialLogs);
    console.log('Initial energy logs seeded successfully!');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedEnergy();
