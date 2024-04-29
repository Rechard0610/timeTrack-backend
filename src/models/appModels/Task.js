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
  project: { type: mongoose.Schema.ObjectId, autopopulate: true, ref: 'Project', required: true },
  client: {
    type: mongoose.Schema.ObjectId,
    autopopulate: true,
    ref: 'Client',
    required: true,
  },
  people: {
    assign: { type: [{ type: mongoose.Schema.ObjectId, autopopulate: true, ref: 'Admin' }] },
    team: { type: [{ type: mongoose.Schema.ObjectId, autopopulate: true, ref: 'Team' }] },
  },
  budget: {
    type: String,
  },
  status: {
    type: String,
    required: true,
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
module.exports = mongoose.model('Task', schema);
