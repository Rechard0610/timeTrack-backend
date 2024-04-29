const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  hourlyrate: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  contactnr: {
    type: String,
  },
  contactphone: {
    type: String,
  },
  contactgmail: {
    type: String,
  },
  companyaddress: {
    type: String,
  },
  vatid: {
    type: String,
  },
  regnr: {
    type: String,
  },
  defaulttask: {
    type: [String],
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

module.exports = mongoose.model('Client', schema);
