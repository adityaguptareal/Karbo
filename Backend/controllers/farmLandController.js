const Farmland = require("../models/farmLandModel");
const User = require("../models/userModel");
const z = require("zod");


exports.createFarmland = async (req, res) => {
  try {
    const farmlandSchema = z.object({
      landName: z.string().min(1, "Land name is required"),
      location: z.string().min(1, "Location is required"),
      area: z.string().min(1).transform(Number).refine(n => n > 0, "Area must be valid"),
      landType: z.string().optional(),
      cultivationMethod: z.string().optional(),
    });

    const validation = farmlandSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        msg: "Invalid farmland data",
        errors: validation.error.errors,
      });
    }

    if (
      !req.files ||
      !req.files.documents ||
      !req.files.images ||
      req.files.documents.length === 0 ||
      req.files.images.length === 0
    ) {
      return res.status(400).json({
        msg: "Both land documents and land images are required",
      });
    }

    const landDocuments = req.files.documents.map(f => f.path);
    const landImages = req.files.images.map(f => f.path);

    // Carbon Credit Calculation Logic 
    const areaInHectares = validation.data.area;
    const method = (validation.data.cultivationMethod || "").toLowerCase();

    let multiplier = 1.0; // Base multiplier
    if (method.includes("organic")) multiplier = 1.5;
    else if (method.includes("agroforestry")) multiplier = 2.0;
    else if (method.includes("regenerative")) multiplier = 1.8;
    else if (method.includes("sustainable")) multiplier = 1.2;

    const potentialCredits = Math.round(areaInHectares * multiplier);
    const estimatedValue = potentialCredits * 1100; // Avg price 1100 (1000-1200 range)

    const newFarmland = await Farmland.create({
      farmerId: req.user.userId,
      landName: validation.data.landName,
      location: validation.data.location,
      area: validation.data.area,
      landType: validation.data.landType || "",
      cultivationMethod: validation.data.cultivationMethod || "",
      landDocuments,
      landImages,
      status: "pending_verification",
    });

    await User.findByIdAndUpdate(req.user.userId, {
      $push: { farmlandIds: newFarmland._id },
    });

    return res.status(201).json({
      msg: "Farmland submitted for verification",
      farmland: newFarmland,
    });

  } catch (error) {
    console.error("createFarmland error:", error);
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message || "Unknown error",
      details: error
    });
  }
};


exports.getMyFarmlands = async (req, res) => {
  try {
    const farmlands = await Farmland.find({ farmerId: req.user.userId });

    return res.status(200).json({
      msg: "Farmlands fetched successfully",
      farmlands,
    });

  } catch (error) {
    console.error("getMyFarmlands error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};


exports.getFarmlandById = async (req, res) => {
  try {
    console.log("Get the ideas")
    const farmland = await Farmland.findById(req.params.id);

    if (!farmland) {
      return res.status(404).json({ msg: "Farmland not found" });
    }

    if (
      req.user.role === "farmer" &&
      String(farmland.farmerId) !== req.user.userId
    ) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    return res.status(200).json({ farmland });

  } catch (error) {
    console.error("getFarmlandById error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};

exports.searchFarmland = async (req, res) => {
  try {
    const { q } = req.query;

    let filter = {};

    // Farmer should only see their own farmlands
    if (req.user.role === "farmer") {
      filter.farmerId = req.user.userId;
    }

    // If q exists → add name search filter
    if (q && q.trim() !== "") {
      filter.landName = { $regex: q, $options: "i" };
    }

    const results = await Farmland.find(filter);

    return res.status(200).json({
      msg: q ? "Search results fetched" : "All farmlands fetched",
      count: results.length,
      results,
    });

  } catch (error) {
    console.error("searchFarmland error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};
