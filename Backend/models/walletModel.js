const mongoose=require("mongoose")
const WalletSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },

  amount: { type: Number, required: true },

  type: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },

  description: String,

  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Wallet", WalletSchema);