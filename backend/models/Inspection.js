const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    client: {
        type: String,
        required: true
    },
    lotNo: {
        type: String,
        required: true
    },
    deltaE: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'pending'
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Inspection', inspectionSchema);
