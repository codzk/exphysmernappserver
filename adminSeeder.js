const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        let admin = await Admin.findOne({ email: 'admin@example.com' });
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);

            admin = new Admin({
                email: 'admin@example.com',
                password: hashedPassword,
            });

            await admin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
