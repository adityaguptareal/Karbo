const CarbonCreditListing = require("../models/carbonCreditModel"); 
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
      return res.status(403).json({ msg: "Farmer is not verified" });
    }

    const schema = z.object({
      farmlandId: z.string().min(1, "FarmlandId is required"),
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

    const { farmlandId, totalCredits, pricePerCredit, description } =
      parsed.data;

    // Check farmland
    const farmland = await Farmland.findById(farmlandId);
    if (!farmland) {
      return res.status(404).json({ msg: "Farmland not found" });
    }

    // Farmland must belong to this farmer
    if (String(farmland.farmerId) !== req.user.userId) {
      return res.status(403).json({ msg: "You do not own this farmland" });
    }

    // Farmland must be verified
    if (farmland.status !== "verified") {
      return res.status(400).json({
        msg: "Farmland is not verified yet. Listing not allowed.",
      });
    }

    const totalValue = totalCredits * pricePerCredit;

    const listing = await CarbonCreditListing.create({
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
    return res
      .status(500)
      .json({ msg: "Server error", error: error.message });
  }
};

/* ==========================================================
   2. GET /listing/my  (Farmer - all his listings)
========================================================== */
const getMyListings = async (req, res) => {
  try {
    const listings = await CarbonCreditListing.find({
      farmerId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      msg: "Your listings fetched successfully",
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("getMyListings error:", error);
    return res
      .status(500)
      .json({ msg: "Server error", error: error.message });
  }
};

/* ==========================================================
   3. PUT /listing/update/:id  (Farmer - update his listing)
========================================================== */
const updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const schema = z.object({
      totalCredits: z
        .union([z.number(), z.string()])
        .transform((val) => (val === undefined || val === null || val === "" ? undefined : Number(val)))
        .optional(),
      pricePerCredit: z
        .union([z.number(), z.string()])
        .transform((val) => (val === undefined || val === null || val === "" ? undefined : Number(val)))
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

    const listing = await CarbonCreditListing.findById(listingId);
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

    // Recalculate totalValue if credits/price changed
    listing.totalValue = listing.totalCredits * listing.pricePerCredit;

    await listing.save();

    return res.status(200).json({
      msg: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    console.error("updateListing error:", error);
    return res
      .status(500)
      .json({ msg: "Server error", error: error.message });
  }
};

/* ==========================================================
   4. DELETE /listing/delete/:id  (Farmer deletes his listing)
========================================================== */
const deleteListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const listing = await CarbonCreditListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: "Listing not found" });
    }

    if (String(listing.farmerId) !== req.user.userId) {
      return res
        .status(403)
        .json({ msg: "You cannot delete someone else's listing" });
    }

    // Hard delete (for hackathon its fine; else you can soft delete)
    await listing.deleteOne();

    return res.status(200).json({
      msg: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("deleteListing error:", error);
    return res
      .status(500)
      .json({ msg: "Server error", error: error.message });
  }
};

/* ==========================================================
   5. GET /marketplace/listings (Company side)
========================================================== */
const getMarketplaceListings = async (req, res) => {
  try {
    const { minPrice, maxPrice, sort } = req.query;

    const filter = { status: "active" };

    if (minPrice) {
      filter.pricePerCredit = { ...(filter.pricePerCredit || {}), $gte: Number(minPrice) };
    }
    if (maxPrice) {
      filter.pricePerCredit = { ...(filter.pricePerCredit || {}), $lte: Number(maxPrice) };
    }

    let query = CarbonCreditListing.find(filter)
      .populate("farmerId", "name email")
      .populate("farmlandId", "landName location");

    // sort=price_asc / price_desc / newest
    if (sort === "price_asc") {
      query = query.sort({ pricePerCredit: 1 });
    } else if (sort === "price_desc") {
      query = query.sort({ pricePerCredit: -1 });
    } else if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    }

    const listings = await query;

    return res.status(200).json({
      msg: "Marketplace listings fetched successfully",
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("getMarketplaceListings error:", error);
    return res
      .status(500)
      .json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  createListing,
  getMyListings,
  updateListing,
  deleteListing,
  getMarketplaceListings,
};
