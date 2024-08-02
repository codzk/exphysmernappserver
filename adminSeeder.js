const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(1);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create new admin
        const admin = new Admin({
            email: 'admin@example.com',
            password: hashedPassword,
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user', error.message);
        process.exit(1);
    }
};

seedAdmin();
