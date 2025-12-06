const mongoose = require("mongoose");

const CarbonCreditListingSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  farmlandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmland",
    required: true,
  },

  totalCredits: { type: Number, required: true },
  pricePerCredit: { type: Number, required: true },
  
  totalValue: { type: Number, required: true }, // totalCredits * pricePerCredit

  description: String,

  status: {
    type: String,
    enum: ["active", "sold", "expired"],
    default: "active",
  },

  createdAt: { type: Date, default: Date.now },
});

modeule.exports = mongoose.model("CarbonCredit", CarbonCreditListingSchema);