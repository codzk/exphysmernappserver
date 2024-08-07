const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

const seedAdmin = async () => {
  const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
  if (existingAdmin) {
    console.log('Admin user already exists');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash('adminpassword', 10);
  const admin = new Admin({
    email: 'admin@example.com',
    password: hashedPassword,
  });

  await admin.save();
  console.log('Admin user created successfully');
  process.exit();
};

seedAdmin().catch((err) => {
  console.error('Seeder error:', err);
  process.exit(1);
});
