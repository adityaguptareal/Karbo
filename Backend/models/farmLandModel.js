const mongoose = require("mongoose");

const FarmlandSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    landName: { type: String, required: true },
    location: { type: String, required: true },
    area: { type: Number, required: true }, // acres or hectares

    landDocuments: [
      {
        type: String,
        required: true,
      }
    ],

    landImages: [
      {
        type: String,
        required: true,
      }
    ],

    landType: { type: String },
    cultivationMethod: { type: String },

    status: {
      type: String,
      enum: ["pending_verification", "verified", "rejected"],
      default: "pending_verification",
    },

    rejectionReason: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("Farmland", FarmlandSchema);
module.exports = mongoose.models.Farmland || mongoose.model("Farmland", FarmlandSchema);
