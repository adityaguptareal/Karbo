const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  carbonCreditListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CarbonCredit",
    required: true,
  },

  creditsPurchased: { type: Number, required: true },
  amountPaid: { type: Number, required: true },

  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  invoiceUrl: String, // PDF URL

  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Transaction', TransactionSchema);