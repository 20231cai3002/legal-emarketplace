require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

(async () => {
  await connectDB(process.env.MONGO_URI);
  await User.deleteMany({});
  const admin = await User.create({
    name: 'Admin',
    email: 'monisha@example.com',
    phone: '9999999999',
    password: 'Monisha@123',
    role: 'ADMIN',
    // isVerified: true
  });
  console.log('Seeded admin:', admin.email);
  process.exit(0);
})();