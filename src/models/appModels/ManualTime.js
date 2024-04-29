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
  reason: {
    type: String,
  },
  starttime: {
    type: Date,
    required: true,
  },
  endtime: {
    type: String,
    required: true,
  },
  productive: {
    type: String,
    default: 'Productive',
  },
  status: {
    type: String,
    default: 'pending',
  },
  activity: {
    type: Number,
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
module.exports = mongoose.model('ManualTime', schema);
