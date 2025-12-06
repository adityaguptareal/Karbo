const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    googleId: { type: String },

    role: {
      type: String,
      enum: ["farmer", "company", "admin"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending_verification", "verified", "rejected"],
      default: "pending_verification",
    },

    rejectionReason: { type: String, default: "" },
    // 🚨 NEW FIELD
    isBlocked: {
      type: Boolean,
      default: false,
    },

    farmlandIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Farmland" }
    ],

    walletBalance: {
      type: Number,
      default: 0,
    },

    companyDocuments: [{ type: String }],

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
