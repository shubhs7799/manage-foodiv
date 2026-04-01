import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existing = await User.findOne({ email: 'admin@foodiv.com' });
    if (existing) {
      console.log('Admin user already exists');
    } else {
      await User.create({
        name: 'Admin',
        email: 'admin@foodiv.com',
        password: 'admin@123',
        role: 'admin'
      });
      console.log('Admin user created - email: admin@foodiv.com, password: admin@123');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
