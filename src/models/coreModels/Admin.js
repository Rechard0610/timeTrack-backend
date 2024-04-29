const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  initials: { type: String },
  photo: {
    type: String,
    trim: true,
  },
  invitedById: { type: mongoose.Schema.ObjectId },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['owner', 'admin', 'projectmanager', 'user', 'guest'],
  },
  idleTimeLimit: {
    type: Number,
    default: 60,
  },
  screenShotInterval: {
    type: Number,
    default: 3,
  },
  images: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model('Admin', adminSchema);
