const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlTrackingSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        required: true,
        unique: true
    },
    urlName: {
        type: String,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        default: Date.now,
        required: true
    },
    time_range: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('urltracking', urlTrackingSchema);
