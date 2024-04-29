const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  userId: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true, required: true },
  hideowner: {
    type: Boolean,
    default: false,
  },
  companyexpenses: {
    type: Boolean,
    default: false,
  },
  payments: {
    type: Boolean,
    default: false,
  },
  lunch: {
    type: Boolean,
    default: false,
  },
  projectcreation: {
    type: Boolean,
    default: false,
  },
  projectdelecting: {
    type: Boolean,
    default: false,
  },
  reportexporting: {
    type: Boolean,
    default: false,
  },
  financialreports: {
    type: Boolean,
    default: false,
  },
  otheruserdata: {
    type: Boolean,
    default: false,
  },
  screenshot: {
    type: Boolean,
    default: false,
  },
  privatetime: {
    type: Boolean,
    default: false,
  },
  forceproject: {
    type: Boolean,
    default: false,
  },
  forcetask: {
    type: Boolean,
    default: false,
  },
  hideprojectfixedprice: {
    type: Boolean,
    default: false,
  },
  hidepage: {
    type: Boolean,
    default: false,
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
module.exports = mongoose.model('MemberSetting', schema);
