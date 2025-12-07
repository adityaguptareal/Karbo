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

  totalCredits: { 
    type: Number, 
    required: true 
  },

  pricePerCredit: { 
    type: Number, 
    required: true 
  },

  totalValue: { 
    type: Number, 
    required: true 
  }, // totalCredits * pricePerCredit

  description: { 
    type: String 
  },

  status: {
    type: String,
    enum: ["active", "sold", "expired"],
    default: "active",
  },

  validFrom: { type: Date, default: null },
  validTill: { type: Date, default: null },

   soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    default: null,
  },

  createdAt: { 
    type: Date, 
    default: Date.now()
  },
});

module.exports = mongoose.model("CarbonCredit", CarbonCreditListingSchema);
