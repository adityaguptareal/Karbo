const User = require("../models/userModel.js");
const Farmland = require("../models/farmLandModel.js");
const z = require("zod");


const getPendingFarmlands = async (req, res) => {
  try {
    const farmlands = await Farmland.find({
      status: "pending_verification",
    })
      .populate("farmerId", "name email role status")
      .select("-__v");

    return res.status(200).json({
      msg: "Pending farmlands fetched successfully",
      count: farmlands.length,
      farmlands,
    });

  } catch (error) {
    console.error("getPendingFarmlands error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


const getFarmlandFullDetails = async (req, res) => {
  try {
    const farmland = await Farmland.findById(req.params.id)
      .populate("farmerId", "name email role status createdAt")
      .select("-__v");

    if (!farmland) {
      return res.status(404).json({ msg: "Farmland not found" });
    }

    return res.status(200).json({ msg: "Farmland details fetched", farmland });

  } catch (error) {
    console.error("getFarmlandFullDetails error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


const approveFarmland = async (req, res) => {
  try {
    const farmland = await Farmland.findById(req.params.id);
    if (!farmland) return res.status(404).json({ msg: "Farmland not found" });

    farmland.status = "verified";
    farmland.rejectionReason = "";
    await farmland.save();

    return res.status(200).json({
      msg: "Farmland approved successfully",
      farmland,
    });

  } catch (error) {
    console.error("approveFarmland error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


const rejectFarmland = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ msg: "Request body is required" });
    }
    const { reason } = req.body;


    if (!reason || reason.trim() === "") {
      return res.status(400).json({ msg: "Rejection reason is required" });
    }

    const farmland = await Farmland.findById(req.params.id);
    if (!farmland) return res.status(404).json({ msg: "Farmland not found" });

    farmland.status = "rejected";
    farmland.rejectionReason = reason;
    await farmland.save();

    return res.status(200).json({
      msg: "Farmland rejected successfully",
      farmland,
    });

  } catch (error) {
    console.error("rejectFarmland error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getAllFarmlands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";

    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { landName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { landType: { $regex: search, $options: "i" } }
      ];
    }

    const farmlands = await Farmland.find(query)
      .populate("farmerId", "name email role status")
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Farmland.countDocuments(query);

    return res.status(200).json({
      msg: "Farmlands fetched successfully",
      farmlands,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("getAllFarmlands error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


module.exports = {
  getPendingFarmlands,
  getFarmlandFullDetails,
  approveFarmland,
  rejectFarmland,
  getAllFarmlands,
};
