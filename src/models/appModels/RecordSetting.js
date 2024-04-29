const mongoose = require('mongoose');

const RecordSettingSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  userId: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  idletimeLimit: {
    type: Number,
  },
  mouseClickTime: {
    type: Number,
  },
  mouseClickIndex: {
    type: Number,
  },
  keyClickTime: {
    type: Number,
  },
  keyClickIndex: {
    type: Number,
  },
  mouseMoveTime: {
    type: Number,
  },
  mouseMoveIndex: {
    type: Number,
  },
  appTime: {
    type: Number,
  },
  productiveIndex: {
    type: Number,
  },
  unprojectiveIndex: {
    type: Number,
  },
  neutralIndex: {
    type: Number,
  },
  screenCaptureInterval: {
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

RecordSettingSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('RecordSetting', RecordSettingSchema);
