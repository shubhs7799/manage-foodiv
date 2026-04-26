import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Category from './models/Category.js';
import Recipe from './models/Recipe.js';

dotenv.config();

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@foodiv.com';
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('Set ADMIN_PASSWORD env var before seeding');
      process.exit(1);
    }

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin user already exists');
    } else {
      await User.create({
        name: 'Admin Foodiv',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Seed Categories & Recipes
    await Category.deleteMany({});
    await Recipe.deleteMany({});

    const categories = await Category.insertMany([
      { name: 'Breakfast', imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400' },
      { name: 'Lunch', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
      { name: 'Dinner', imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400' },
      { name: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400' },
      { name: 'Desserts', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400' },
      { name: 'Drinks', imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
      { name: 'Indian', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
      { name: 'Fast Food', imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400' },
    ]);

    console.log('Categories seeded:', categories.map(c => c.name));

    const cat = {};
    categories.forEach(c => cat[c.name] = c._id);

    await Recipe.insertMany([
      { name: 'Masala Omelette', categoryId: cat['Breakfast'], ingredients: ['Eggs', 'Onion', 'Tomato', 'Green chilli', 'Coriander'], price: 80, imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400' },
      { name: 'Poha', categoryId: cat['Breakfast'], ingredients: ['Flattened rice', 'Onion', 'Mustard seeds', 'Curry leaves', 'Lemon'], price: 60, imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
      { name: 'Upma', categoryId: cat['Breakfast'], ingredients: ['Semolina', 'Onion', 'Green chilli', 'Mustard seeds', 'Ghee'], price: 55, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
      { name: 'Dal Rice', categoryId: cat['Lunch'], ingredients: ['Toor dal', 'Rice', 'Ghee', 'Turmeric', 'Jeera'], price: 120, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
      { name: 'Rajma Chawal', categoryId: cat['Lunch'], ingredients: ['Kidney beans', 'Rice', 'Tomato', 'Onion', 'Spices'], price: 140, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
      { name: 'Chole Bhature', categoryId: cat['Lunch'], ingredients: ['Chickpeas', 'Maida', 'Yogurt', 'Spices', 'Oil'], price: 160, imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
      { name: 'Butter Chicken', categoryId: cat['Dinner'], ingredients: ['Chicken', 'Butter', 'Cream', 'Tomato', 'Spices'], price: 280, imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
      { name: 'Paneer Tikka Masala', categoryId: cat['Dinner'], ingredients: ['Paneer', 'Tomato', 'Cream', 'Spices', 'Capsicum'], price: 240, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      { name: 'Dal Makhani', categoryId: cat['Dinner'], ingredients: ['Black lentils', 'Butter', 'Cream', 'Tomato', 'Spices'], price: 200, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
      { name: 'Jeera Rice', categoryId: cat['Dinner'], ingredients: ['Basmati rice', 'Jeera', 'Ghee', 'Bay leaf', 'Salt'], price: 120, imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400' },
      { name: 'Samosa', categoryId: cat['Snacks'], ingredients: ['Maida', 'Potato', 'Peas', 'Spices', 'Oil'], price: 30, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
      { name: 'Pav Bhaji', categoryId: cat['Snacks'], ingredients: ['Mixed veggies', 'Pav', 'Butter', 'Spices', 'Onion'], price: 120, imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
      { name: 'Vada Pav', categoryId: cat['Snacks'], ingredients: ['Potato', 'Pav', 'Gram flour', 'Chutney', 'Oil'], price: 40, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { name: 'Gulab Jamun', categoryId: cat['Desserts'], ingredients: ['Milk powder', 'Maida', 'Sugar', 'Rose water', 'Cardamom'], price: 80, imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400' },
      { name: 'Rasgulla', categoryId: cat['Desserts'], ingredients: ['Chenna', 'Sugar', 'Rose water', 'Cardamom'], price: 70, imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400' },
      { name: 'Kheer', categoryId: cat['Desserts'], ingredients: ['Milk', 'Rice', 'Sugar', 'Cardamom', 'Dry fruits'], price: 90, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
      { name: 'Masala Chai', categoryId: cat['Drinks'], ingredients: ['Tea leaves', 'Milk', 'Ginger', 'Cardamom', 'Sugar'], price: 30, imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
      { name: 'Mango Lassi', categoryId: cat['Drinks'], ingredients: ['Mango', 'Yogurt', 'Sugar', 'Cardamom', 'Milk'], price: 80, imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400' },
      { name: 'Cold Coffee', categoryId: cat['Drinks'], ingredients: ['Coffee', 'Milk', 'Sugar', 'Ice cream', 'Ice'], price: 100, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
      { name: 'Veg Burger', categoryId: cat['Fast Food'], ingredients: ['Bun', 'Potato patty', 'Lettuce', 'Cheese', 'Sauce'], price: 120, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
      { name: 'Margherita Pizza', categoryId: cat['Fast Food'], ingredients: ['Pizza base', 'Tomato sauce', 'Mozzarella', 'Basil', 'Olive oil'], price: 220, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
      { name: 'French Fries', categoryId: cat['Fast Food'], ingredients: ['Potato', 'Oil', 'Salt', 'Pepper', 'Seasoning'], price: 80, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' },
      { name: 'Biryani', categoryId: cat['Indian'], ingredients: ['Basmati rice', 'Chicken', 'Yogurt', 'Saffron', 'Spices'], price: 300, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
      { name: 'Palak Paneer', categoryId: cat['Indian'], ingredients: ['Spinach', 'Paneer', 'Cream', 'Garlic', 'Spices'], price: 220, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    ]);

    console.log('✅ All data seeded successfully!');
    await mongoose.disconnect();

  } catch (err) {
    console.error('Seed error:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAll();