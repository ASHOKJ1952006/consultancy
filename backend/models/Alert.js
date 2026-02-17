const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['critical', 'warning', 'info'],
        required: true
    },
    category: {
        type: String,
        enum: ['inventory', 'machine', 'quality', 'production', 'maintenance'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    actionable: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);
