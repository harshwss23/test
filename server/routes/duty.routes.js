const express = require('express');
const router = express.Router();
const Duty = require('../models/duty.model');

// Add new duty entry
router.post('/add', async (req, res) => {
    try {
        const { vehicleNo, time, route, driverName } = req.body;
        const newDuty = new Duty({ vehicleNo, time, route, driverName });
        await newDuty.save();
        res.status(201).json({ message: 'Duty added successfully', data: newDuty });
    } catch (error) {
        console.error('Error adding duty:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all duty entries
router.get('/all', async (req, res) => {
    try {
        const duties = await Duty.find().sort({ createdAt: -1 });
        res.status(200).json(duties);
    } catch (error) {
        console.error('Error getting duties:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add multiple duty entries (Bulk)
router.post('/add-bulk', async (req, res) => {
    try {
        // Wipe old records to ensure only the latest 22 unique buses remain
        await Duty.deleteMany({});
        
        const newDuties = await Duty.insertMany(req.body);
        res.status(201).json({ message: 'Duties replaced successfully', data: newDuties });

    } catch (error) {
        console.error('Error in bulk add:', error);
        res.status(500).json({ error: error.message });
    }
});

// Clear all duties (useful for daily reset)
router.delete('/clear', async (req, res) => {
    try {
        await Duty.deleteMany({});
        res.status(200).json({ message: 'All duties cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
