const mongoose = require('mongoose');

const Idlestatechema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        required: true,
        unique: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    total_work_time: {
        type: Number,
        required: true,
        default: 0
    },
    mouse_work_time: {
        type: Number,
        required: true,
        default: 0
    },
    key_work_time: {
        type: Number,
        required: true,
        default: 0
    },
    s3shot_count: {
        type: Number,
        required: true,
        default: 0
    },
    s3shot_screen_array: {
        type: Array
    }
});

module.exports = mongoose.model('Idlestate', Idlestatechema);
