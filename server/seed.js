const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing users to avoid duplicates during seed
    await User.deleteMany({ email: { $in: ['admin@energy.com', 'user@energy.com'] } });

    // Create Admin
    await User.create({
      name: 'System Admin',
      email: 'admin@energy.com',
      password: 'admin123',
      isAdmin: true
    });

    // Create Regular User
    await User.create({
      name: 'Regular User',
      email: 'user@energy.com',
      password: 'user123',
      isAdmin: false
    });

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
