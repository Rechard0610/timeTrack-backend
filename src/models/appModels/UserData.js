const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
    autopopulate: true,
  },
  projectId: {
    type: mongoose.Schema.ObjectId,
    autopopulate: true,
    ref: 'Project',
    required: true,
  },
  taskId: {
    type: mongoose.Schema.ObjectId,
    autopopulate: true,
    ref: 'Task',
    required: true,
  },
  spentType: { type: String, default: 'working time' },
  workData: [
    {
      idleTime: { type: Number, default: 0 },
      privateTime: { type: Number, default: 0 },
      mouseIdle: { type: Number, default: 0 },
      mouseClickIdle: { type: Number, default: 0 },
      keyIdle: { type: Number, default: 0 },
      range: { type: Number, default: 0 },
    },
  ],
  timeRange: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('UserData', schema);
