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

    // Farmer / User Details
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },

    // Payment Details
    bankDetails: {
      accountNumber: { type: String },
      ifscCode: { type: String },
      accountHolderName: { type: String },
      bankName: { type: String },
    },
    upiId: { type: String },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
