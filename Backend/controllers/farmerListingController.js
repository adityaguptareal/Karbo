const CarbonCredit = require("../models/carbonCreditModel");
const Farmland = require("../models/farmLandModel");
const User = require("../models/userModel");
const z = require("zod");


const createListing = async (req, res) => {
  try {
   
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "farmer") {
      return res.status(403).json({ msg: "Only farmers can create listings" });
    }
    if (user.status !== "verified") {
      return res.status(403).json({ msg: "Farmer is not verified yet" });
    }

    const schema = z.object({
      farmlandId: z.string().min(1, "farmlandId is required"),
      totalCredits: z
        .union([z.number(), z.string()])
        .transform((val) => Number(val))
        .refine((n) => n > 0, "Total credits must be > 0"),
      pricePerCredit: z
        .union([z.number(), z.string()])
        .transform((val) => Number(val))
        .refine((n) => n > 0, "Price per credit must be > 0"),
      description: z.string().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        msg: "Invalid listing data",
        errors: parsed.error.errors,
      });
    }

    const { farmlandId, totalCredits, pricePerCredit, description } = parsed.data;

    // Check farmland exists & belongs to farmer & is verified
    const farmland = await Farmland.findById(farmlandId);
    if (!farmland) {
      return res.status(404).json({ msg: "Farmland not found" });
    }

    if (String(farmland.farmerId) !== req.user.userId) {
      return res.status(403).json({ msg: "You do not own this farmland" });
    }

    if (farmland.status !== "verified") {
      return res
        .status(400)
        .json({ msg: "Farmland is not verified. Listing not allowed." });
    }

    // Calculate totalValue
    const totalValue = totalCredits * pricePerCredit;

    // 5. Create listing
    const listing = await CarbonCredit.create({
      farmerId: req.user.userId,
      farmlandId,
      totalCredits,
      pricePerCredit,
      totalValue,
      description: description || "",
      status: "active",
    });

    return res.status(201).json({
      msg: "Carbon credit listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("createListing error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};


const getMyListings = async (req, res) => {
  try {
    const listings = await CarbonCredit.find({
      farmerId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      msg: "Your listings fetched successfully",
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("getMyListings error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};


const updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const schema = z.object({
      totalCredits: z
        .union([z.number(), z.string()])
        .transform((val) =>
          val === undefined || val === null || val === ""
            ? undefined
            : Number(val)
        )
        .optional(),
      pricePerCredit: z
        .union([z.number(), z.string()])
        .transform((val) =>
          val === undefined || val === null || val === ""
            ? undefined
            : Number(val)
        )
        .optional(),
      description: z.string().optional(),
      status: z.enum(["active", "sold", "expired"]).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        msg: "Invalid update data",
        errors: parsed.error.errors,
      });
    }

    const updates = parsed.data;

    const listing = await CarbonCredit.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: "Listing not found" });
    }

    // Ensure listing belongs to this farmer
    if (String(listing.farmerId) !== req.user.userId) {
      return res
        .status(403)
        .json({ msg: "You cannot update someone else's listing" });
    }

    // Apply updates
    if (updates.totalCredits !== undefined) {
      listing.totalCredits = updates.totalCredits;
    }
    if (updates.pricePerCredit !== undefined) {
      listing.pricePerCredit = updates.pricePerCredit;
    }
    if (updates.description !== undefined) {
      listing.description = updates.description;
    }
    if (updates.status !== undefined) {
      listing.status = updates.status;
    }

    // Recalculate totalValue if credits or price changed
    listing.totalValue = listing.totalCredits * listing.pricePerCredit;

    await listing.save();

    return res.status(200).json({
      msg: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    console.error("updateListing error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};


const deleteListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const listing = await CarbonCredit.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: "Listing not found" });
    }

    if (String(listing.farmerId) !== req.user.userId) {
      return res
        .status(403)
        .json({ msg: "You cannot delete someone else's listing" });
    }

    await listing.deleteOne();

    return res.status(200).json({
      msg: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("deleteListing error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  createListing,
  getMyListings,
  updateListing,
  deleteListing,
  
};
