const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  clientname: {
    type: mongoose.Schema.ObjectId,
    autopopulate: true,
    ref: 'Client',
    required: true,
  },
  projectnumber: {
    type: String,
    required: true,
  },
  clientproject: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
  },
  isfixed: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  people: {
    assign: { type: [{ type: mongoose.Schema.ObjectId, autopopulate: true, ref: 'Admin' }] },
    team: { type: [{ type: mongoose.Schema.ObjectId, autopopulate: true, ref: 'Team' }] },
  },
  subtask: {
    type: [String],
  },
  status: {
    type: String,
    required: true,
  },
  statusnote: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  // enabled: {
  //   type: Boolean,
  //   default: true,
  // },
  // idCardNumber: {
  //   type: String,
  //   trim: true,
  // },
  // idCardType: {
  //   type: String,
  // },
  // securitySocialNbr: {
  //   type: String,
  // },
  // taxNumber: {
  //   type: String,
  // },
  // birthday: {
  //   type: Date,
  // },
  // birthplace: {
  //   type: String,
  // },
  // gender: {
  //   type: String,
  //   enum: ['male', 'female'],
  // },
  // photo: {
  //   type: String,
  // },
  // bankName: {
  //   type: String,
  //   trim: true,
  // },
  // bankIban: {
  //   type: String,
  //   trim: true,
  // },
  // bankSwift: {
  //   type: String,
  //   trim: true,
  // },
  // bankNumber: {
  //   type: String,
  //   trim: true,
  // },
  // bankRouting: {
  //   type: String,
  //   trim: true,
  // },
  // customField: [
  //   {
  //     fieldName: {
  //       type: String,
  //       trim: true,
  //       lowercase: true,
  //     },
  //     fieldType: {
  //       type: String,
  //       trim: true,
  //       lowercase: true,
  //       default: 'string',
  //     },
  //     fieldValue: {},
  //   },
  // ],
  // location: {
  //   latitude: Number,
  //   longitude: Number,
  // },
  // address: {
  //   type: String,
  // },
  // city: {
  //   type: String,
  // },
  // State: {
  //   type: String,
  // },
  // postalCode: {
  //   type: Number,
  // },
  // country: {
  //   type: String,
  //   trim: true,
  // },
  // phone: {
  //   type: String,
  //   trim: true,
  // },
  // otherPhone: [
  //   {
  //     type: String,
  //     trim: true,
  //   },
  // ],

  // otherEmail: [
  //   {
  //     type: String,
  //     trim: true,
  //     lowercase: true,
  //   },
  // ],
  // socialMedia: {
  //   facebook: String,
  //   instagram: String,
  //   twitter: String,
  //   linkedin: String,
  //   tiktok: String,
  //   youtube: String,
  //   snapchat: String,
  // },
  // images: [
  //   {
  //     id: String,
  //     name: String,
  //     path: String,
  //     description: String,
  //     isPublic: {
  //       type: Boolean,
  //       default: false,
  //     },
  //   },
  // ],
  // files: [
  //   {
  //     id: String,
  //     name: String,
  //     path: String,
  //     description: String,
  //     isPublic: {
  //       type: Boolean,
  //       default: false,
  //     },
  //   },
  // ],
  // approved: {
  //   type: Boolean,
  // },
  // tags: [
  //   {
  //     type: String,
  //     trim: true,
  //     lowercase: true,
  //   },
  // ],
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Project', schema);
