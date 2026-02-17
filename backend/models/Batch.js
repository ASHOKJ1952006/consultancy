const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: true,
        unique: true
    },
    date: {
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
    status: {
        type: String,
        enum: ['completed', 'rejected', 'in-progress'],
        default: 'in-progress'
    },
    efficiency: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    deltaE: {
        type: Number,
        min: 0
    },
    operator: {
        type: String,
        required: true
    },
    recipe: {
        dyes: [{
            name: String,
            qty: String
        }],
        chemicals: [{
            name: String,
            qty: String
        }]
    },
    stages: [{
        name: String,
        duration: String,
        temp: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Batch', batchSchema);
