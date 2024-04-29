const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  userId: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true, required: true },
  recipient: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true, required: true },
  expenseCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ExpenseCategory',
    autopopulate: true,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
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
paymentSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Payment', paymentSchema);
