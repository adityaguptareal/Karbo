const User = require("../models/userModel");
const upload = require("../utils/upload"); 
const Transaction = require("../models/transactionModel");

exports.uploadCompanyDocuments = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ msg: "Only companies can upload documents" });
    }

    if (!req.files || !req.files.documents || req.files.documents.length === 0) {
      return res.status(400).json({ msg: "At least one document is required" });
    }

    const documentUrls = req.files.documents.map((file) => file.path);

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          companyDocuments: documentUrls,
          status: "pending_verification",
          rejectionReason: "", 
        },
      },
      { new: true }
    ).select("-passwordHash");

    return res.status(200).json({
      msg: "Documents uploaded successfully. wait for admin verification.",
      user,
    });

  } catch (err) {
    console.error("uploadCompanyDocuments error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get all transactions for logged-in company
exports.getCompanyTransactions = async (req, res) => {
  try {
    const companyId = req.user.userId;
    const { page = 1, limit = 10, sortBy = 'newest' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let sortOption = {};
    if (sortBy === 'newest') sortOption.createdAt = -1;
    if (sortBy === 'oldest') sortOption.createdAt = 1;

    const transactions = await Transaction.find({ companyId })
      .populate('farmerId', 'name email')
      .populate({
        path: 'carbonCreditListingId',
        populate: {
          path: 'farmlandId',
          select: 'landName location area'
        }
      })
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments({ companyId });

    return res.status(200).json({
      msg: "Transactions fetched successfully",
      transactions,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("getCompanyTransactions error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};