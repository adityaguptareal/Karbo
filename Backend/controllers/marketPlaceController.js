const CarbonCredit = require("../models/carbonCreditModel");
const User = require("../models/userModel");
const Farmland = require("../models/farmLandModel");

const getMarketplaceListings = async (req, res) => {
  try {
    let { 
      search, 
      minPrice, 
      maxPrice, 
      sort, 
      page = 1, 
      limit = 20 
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    let filter = { status: "active" };

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (minPrice) filter.pricePerCredit = { $gte: Number(minPrice) };
    if (maxPrice) {
      filter.pricePerCredit = {
        ...filter.pricePerCredit,
        $lte: Number(maxPrice)
      };
    }

    let sortOption = {};
    if (sort === "price_low") sortOption.pricePerCredit = 1;
    if (sort === "price_high") sortOption.pricePerCredit = -1;
    if (sort === "newest") sortOption.createdAt = -1;
    if (sort === "oldest") sortOption.createdAt = 1;

    const listings = await CarbonCredit.find(filter)
      .populate("farmerId", "name email")
      .populate("farmlandId", "landName location area")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await CarbonCredit.countDocuments(filter);

    return res.status(200).json({
      msg: "Marketplace listings fetched successfully",
      total,
      page,
      pages: Math.ceil(total / limit),
      listings,
    });

  } catch (error) {
    console.error("getMarketplaceListings error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};

module.exports={
    getMarketplaceListings
}