require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dutyRoutes = require('./routes/duty.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date() }));
app.use('/api/duties', dutyRoutes);

// MongoDB Connection (Cloud Atlas)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://harshwss23:harshwardhan706@cluster0.v2t78f7.mongodb.net/vehicleDuty?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Export for serverless environments (Vercel)
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
}

