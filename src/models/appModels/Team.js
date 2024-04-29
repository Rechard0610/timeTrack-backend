const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  teamname: {
    type: String,
    required: true,
  },
  people: [
    {
      type: mongoose.Schema.ObjectId,
      autopopulate: true,
      ref: 'Admin',
      required: true,
    },
  ],
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
module.exports = mongoose.model('Team', schema);
