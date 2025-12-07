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
      farmlandId: z.string().min(1),
      totalCredits: z
        .union([z.number(), z.string()])
        .transform(Number)
        .refine(n => n > 0),
      pricePerCredit: z
        .union([z.number(), z.string()])
        .transform(Number)
        .refine(n => n > 0),
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

    const farmland = await Farmland.findById(farmlandId);
    if (!farmland) return res.status(404).json({ msg: "Farmland not found" });

    if (String(farmland.farmerId) !== req.user.userId) {
      return res.status(403).json({ msg: "You do not own this farmland" });
    }

    if (farmland.status !== "verified") {
      return res.status(400).json({ msg: "Farmland is not verified" });
    }

    const totalValue = totalCredits * pricePerCredit;

    const listing = await CarbonCredit.create({
      farmerId: req.user.userId,
      farmlandId,
      totalCredits,
      pricePerCredit,
      totalValue,
      description: description || "",
      status: "active",
      validFrom: null, // will be set after payment
      validTill: null,
    });

    return res.status(201).json({
      msg: "Listing created successfully",
      listing,
    });

  } catch (error) {
    console.error("createListing error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
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
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


const updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const listing = await CarbonCredit.findById(listingId);
    if (!listing) return res.status(404).json({ msg: "Listing not found" });

    if (String(listing.farmerId) !== req.user.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    //  Once sold, farmer cannot edit listing
    if (listing.status === "sold") {
      return res.status(400).json({ msg: "Cannot update a sold listing" });
    }

    const schema = z.object({
      totalCredits: z.union([z.number(), z.string()]).optional(),
      pricePerCredit: z.union([z.number(), z.string()]).optional(),
      description: z.string().optional(),
      status: z.enum(["active", "expired"]).optional(), // farmer cannot set "sold"
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        msg: "Invalid update data",
        errors: parsed.error.errors,
      });
    }

    const updates = parsed.data;

    if (updates.totalCredits !== undefined) listing.totalCredits = Number(updates.totalCredits);
    if (updates.pricePerCredit !== undefined) listing.pricePerCredit = Number(updates.pricePerCredit);
    if (updates.description !== undefined) listing.description = updates.description;
    if (updates.status !== undefined) listing.status = updates.status;

    listing.totalValue = listing.totalCredits * listing.pricePerCredit;

    await listing.save();

    return res.status(200).json({ msg: "Listing updated successfully", listing });

  } catch (error) {
    console.error("updateListing error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await CarbonCredit.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: "Listing not found" });

    if (String(listing.farmerId) !== req.user.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Farmer cannot delete a sold listing
    if (listing.status === "sold") {
      return res.status(400).json({ msg: "Cannot delete a sold listing" });
    }

    await listing.deleteOne();

    return res.status(200).json({ msg: "Listing deleted successfully" });

  } catch (error) {
    console.error("deleteListing error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  createListing,
  getMyListings,
  updateListing,
  deleteListing,
};
