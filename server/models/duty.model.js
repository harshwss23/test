const mongoose = require('mongoose');

const DutySchema = new mongoose.Schema({
    vehicleNo: { type: String, required: true },
    time: { type: String, required: true },
    route: { type: String, required: true },
    driverName: { type: String, default: '' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Duty', DutySchema);
