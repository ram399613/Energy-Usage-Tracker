const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Device = require('./models/Device');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing data
    await User.deleteMany({ email: { $in: ['admin@energy.com', 'user@energy.com'] } });
    await Device.deleteMany({});

    // Create Admin
    await User.create({
      name: 'System Admin',
      email: 'admin@energy.com',
      password: 'admin123',
      isAdmin: true
    });

    await User.create({
      name: 'Regular User',
      email: 'user@energy.com',
      password: 'user123',
      isAdmin: false
    });

    // Create Initial Devices
    await Device.create([
      { name: 'Living Room AC', status: 'Active', usage: 1.2, efficiency: '92%', icon: 'fa-snowflake', room: 'Living Room' },
      { name: 'Smart Lighting', status: 'Active', usage: 0.2, efficiency: '98%', icon: 'fa-lightbulb', room: 'Multiple' },
      { name: 'Home Theater', status: 'Idle', usage: 0, efficiency: '--', icon: 'fa-tv', room: 'Entertainment' }
    ]);

    console.log('\n✅ Seed successful! Access the app with these details:\n');
    console.log('--------------------------------------------------');
    console.log('Role    | Email             | Password');
    console.log('--------------------------------------------------');
    console.log('Admin   | admin@energy.com  | admin123');
    console.log('User    | user@energy.com   | user123');
    console.log('--------------------------------------------------\n');
    
    process.exit();
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
