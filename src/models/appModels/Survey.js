const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true },
  app: { type: String },
  url: { type: String },
  typeId: { type: String },
  project: { type: mongoose.Schema.ObjectId },
  task: { type: mongoose.Schema.ObjectId },
  range: { type: Number },
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
module.exports = mongoose.model('Survey', schema);
