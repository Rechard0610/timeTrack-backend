const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    autopopulate: true,
    ref: 'Admin',
    required: true,
  },
  project: { type: mongoose.Schema.ObjectId, autopopulate: true, ref: 'Project', required: true },
  task: { type: mongoose.Schema.ObjectId, autopopulate: true, ref: 'Task', required: true },
  totalTimeRange: {
    type: Number,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  billabletime: {
    type: String,
  },
  totalBudget: {
    type: Number,
  },
  totalSpent: {
    type: Number,
  },
  totalBillableTime: {
    type: Number,
  },
  averageActivity: {
    type: Number,
  },
  productivity: {
    type: Number,
  },
  status: {
    type: String,
    default: 'pending',
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('WeeklyTime', schema);
