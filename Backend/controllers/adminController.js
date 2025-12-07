const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const z = require("zod");
const jwt = require("jsonwebtoken");
const createAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can create another admin" });
    }

    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6)
    });

    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        msg: "Invalid admin data",
        errors: validation.error.errors,
      });
    }

    const { name, email, password } = validation.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: "admin",
      status: "verified"
    });

    return res.status(201).json({
      msg: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });

  } catch (error) {
    console.error("createAdmin error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message
    });
  }
};

const PendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      status: "pending_verification",
      role: { $in: ["farmer", "company"] }
    }).select("-passwordHash -googleId -__v").sort({ createdAt: 1 });

    return res.status(200).json({
      msg: "Pending users fetched successfully",
      count: pendingUsers.length,
      users: pendingUsers
    });

  } catch (error) {
    console.error("getPendingUsers error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message
    });
  }
};

const approveUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.status === "verified") {
      return res.status(400).json({ msg: "User is already verified" });
    }

    // Approve user
    user.status = "verified";
    user.rejectionReason = "";
    await user.save();

    return res.status(200).json({
      msg: "User verified successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        status: user.status,
      }
    });

  } catch (error) {
    console.error("approveUser error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message
    });
  }
};
const rejectUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ msg: "Rejection reason is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.status = "rejected";
    user.rejectionReason = reason;
    await user.save();

    return res.status(200).json({
      msg: "User rejected successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        status: user.status,
        rejectionReason: user.rejectionReason,
      },
    });

  } catch (error) {
    console.error("rejectUser error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({
      msg: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("toggleBlock error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


const getPendingCompanies = async (req, res) => {
  try {
    const companies = await User.find({
      role: "company",
      status: "pending_verification"
    }).select("-passwordHash -googleId -__v").sort({ createdAt: 1 });

    return res.status(200).json({
      msg: "Pending companies fetched successfully",
      count: companies.length,
      companies,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const approveCompany = async (req, res) => {
  try {
    const company = await User.findById(req.params.id);

    if (!company) return res.status(404).json({ msg: "Company not found" });

    company.status = "verified";
    company.rejectionReason = "";
    await company.save();

    return res.status(200).json({
      msg: "Company verified successfully",
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        status: company.status,
      },
    });

  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const rejectCompany = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ msg: "Rejection reason is required" });
    }

    const company = await User.findById(req.params.id);
    if (!company) return res.status(404).json({ msg: "Company not found" });

    company.status = "rejected";
    company.rejectionReason = reason;
    await company.save();

    return res.status(200).json({
      msg: "Company rejected successfully",
      company: {
        id: company._id,
        name: company.name,
        status: company.status,
        rejectionReason: reason,
      },
    });

  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash -googleId -__v");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json({ msg: "User details fetched", user });
  } catch (error) {
    console.error("getUserDetails error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";

    const query = {
      role: { $in: ["farmer", "company"] }
    };

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query)
      .select("-passwordHash -googleId -__v")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    return res.status(200).json({
      msg: "Users fetched successfully",
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  rejectCompany,
  approveCompany,
  getPendingCompanies,
  createAdmin,
  PendingUsers,
  approveUser,
  rejectUser,
  toggleBlockUser,
  getUserDetails,
  getAllUsers
};

