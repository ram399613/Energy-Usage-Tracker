const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Device = require('../models/Device');

dotenv.config();

const devices = [
  { name: 'AC', status: 'Idle', usage: 0, efficiency: '92%', icon: 'fa-snowflake', room: 'Living Room', category: 'HVAC' },
  { name: 'Fan', status: 'Idle', usage: 0, efficiency: '98%', icon: 'fa-fan', room: 'Bed Room', category: 'General' },
  { name: 'TV', status: 'Idle', usage: 0, efficiency: '95%', icon: 'fa-tv', room: 'Living Room', category: 'Entertainment' },
  { name: 'Refrigerator', status: 'Active', usage: 0.2, efficiency: '96%', icon: 'fa-refrigerator', room: 'Kitchen', category: 'Appliances' },
  { name: 'Washing Machine', status: 'Idle', usage: 0, efficiency: '90%', icon: 'fa-washer', room: 'Laundry', category: 'Appliances' },
  { name: 'Lights', status: 'Active', usage: 0.1, efficiency: '99%', icon: 'fa-lightbulb', room: 'All', category: 'Lighting' },
  { name: 'Laptop', status: 'Idle', usage: 0, efficiency: '94%', icon: 'fa-laptop', room: 'Office', category: 'Electronics' },
  { name: 'Water Heater', status: 'Idle', usage: 0, efficiency: '88%', icon: 'fa-hot-tub', room: 'Bathroom', category: 'Appliances' },
  { name: 'Solar Panel', status: 'Active', usage: -1.5, efficiency: '92%', icon: 'fa-solar-panel', room: 'Roof', category: 'Generation' },
  { name: 'Smart Meter', status: 'Active', usage: 0.01, efficiency: '100%', icon: 'fa-tachometer-alt', room: 'Entrance', category: 'Monitoring' }
];

const seed = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/energy-tracker');
    console.log(`Connected to DB for seeding...`);
    
    await Device.deleteMany({});
    await Device.create(devices);

    console.log('✅ Devices seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
