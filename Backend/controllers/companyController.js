const User = require("../models/userModel");
const upload = require("../utils/upload"); 


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
