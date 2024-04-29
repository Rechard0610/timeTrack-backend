const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  userId: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true, required: true },
  recipient: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true },
  mon: {
    type: Number,
    default: 0,
  },
  tue: {
    type: Number,
    default: 0,
  },
  wed: {
    type: Number,
    default: 0,
  },
  thu: {
    type: Number,
    default: 0,
  },
  fri: {
    type: Number,
    default: 0,
  },
  sat: {
    type: Number,
    default: 0,
  },
  sun: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'pending',
  },
  total: {
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
module.exports = mongoose.model('Lunch', schema);
