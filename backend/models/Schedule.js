const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    machine: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    lotNo: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);
