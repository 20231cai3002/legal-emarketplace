require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    await mongoose.connect(uri); // no extra options needed in Mongoose v7+
    console.log('✅ MongoDB Atlas connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;