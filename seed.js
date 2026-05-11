const mongoose = require('mongoose');
const Device = require('./models/Device');
require('dotenv').config();

const devices = [
  { name: 'Air Conditioner', icon: 'fa-snowflake', watts: 1500, category: 'HVAC', efficiency: '92%', usage: 0, status: 'Idle' },
  { name: 'Ceiling Fan', icon: 'fa-fan', watts: 75, category: 'Appliances', efficiency: '98%', usage: 0, status: 'Idle' },
  { name: 'OLED TV', icon: 'fa-tv', watts: 150, category: 'Electronics', efficiency: '95%', usage: 0, status: 'Idle' },
  { name: 'Refrigerator', icon: 'fa-snowflake', watts: 300, category: 'Appliances', efficiency: '94%', usage: 0, status: 'Idle' },
  { name: 'Washing Machine', icon: 'fa-soap', watts: 500, category: 'Appliances', efficiency: '90%', usage: 0, status: 'Idle' },
  { name: 'Gaming PC', icon: 'fa-laptop', watts: 450, category: 'Electronics', efficiency: '96%', usage: 0, status: 'Idle' },
  { name: 'Water Heater', icon: 'fa-fire', watts: 2000, category: 'HVAC', efficiency: '88%', usage: 0, status: 'Idle' },
  { name: 'Smart Dishwasher', icon: 'fa-sink', watts: 1200, category: 'Appliances', efficiency: '93%', usage: 0, status: 'Idle' },
  { name: 'Microwave Oven', icon: 'fa-microchip', watts: 1000, category: 'Appliances', efficiency: '91%', usage: 0, status: 'Idle' },
  { name: 'Neural Lighting', icon: 'fa-lightbulb', watts: 200, category: 'Lighting', efficiency: '99%', usage: 0, status: 'Idle' },
  { name: 'Coffee Machine', icon: 'fa-mug-hot', watts: 800, category: 'Appliances', efficiency: '95%', usage: 0, status: 'Idle' },
  { name: 'Robot Vacuum', icon: 'fa-robot', watts: 50, category: 'Appliances', efficiency: '97%', usage: 0, status: 'Idle' },
  { name: 'Electric Kettle', icon: 'fa-mug-hot', watts: 1500, category: 'Appliances', efficiency: '92%', usage: 0, status: 'Idle' },
  { name: 'Air Purifier', icon: 'fa-wind', watts: 60, category: 'Appliances', efficiency: '98%', usage: 0, status: 'Idle' },
  { name: 'Smart Speaker', icon: 'fa-volume-high', watts: 15, category: 'Electronics', efficiency: '99%', usage: 0, status: 'Idle' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for final redesign seeding...');

    await Device.deleteMany({});
    await Device.insertMany(devices);
    console.log('Final AI devices seeded successfully!');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
