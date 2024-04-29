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
  workStart: {
    type: String,
    default: '08:30',
  },
  workEnd: {
    type: String,
    default: '17:30',
  },
  minimumHours: {
    type: String,
    default: '8h 0m',
  },
  timezone: {
    type: String,
  },
  timeformat: {
    type: String,
    default: '24',
  },
  companycurrency: {
    type: String,
    default: 'USD',
  },
  flexiblehour: {
    type: Boolean,
    default: true,
  },
  workingDays: {
    type: Object,
    default: {
      MO: true,
      TU: true,
      WE: true,
      TH: true,
      FR: true,
      SA: false,
      SU: false,
    },
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
module.exports = mongoose.model('WorkSetting', schema);
