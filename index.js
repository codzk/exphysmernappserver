const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());


const corsOptions = {
    origin: ['http://localhost:3000', 'https://exphysmernapp.netlify.app'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Routes
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
