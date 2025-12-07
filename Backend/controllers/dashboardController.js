const CarbonCredit = require("../models/carbonCreditModel");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const Farmland = require("../models/farmLandModel");

// -------------------------------------------
// FARMER DASHBOARD
// -------------------------------------------
exports.getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user.userId;

    // Listings
    const totalListings = await CarbonCredit.countDocuments({ farmerId });
    const activeListings = await CarbonCredit.countDocuments({
      farmerId,
      status: "active",
    });
    const soldListings = await CarbonCredit.countDocuments({
      farmerId,
      status: "sold",
    });

    // Wallet income
    const walletEntries = await Wallet.find({ farmerId, type: "credit" });
    const totalEarnings = walletEntries.reduce((sum, w) => sum + w.amount, 0);

    return res.status(200).json({
      msg: "Farmer dashboard data fetched",
      data: {
        totalListings,
        activeListings,
        soldListings,
        totalEarnings,
      },
    });

  } catch (error) {
    console.error("Farmer Dashboard Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


// COMPANY DASHBOARD

exports.getCompanyDashboard = async (req, res) => {
  try {
    const companyId = req.user.userId;

    const transactions = await Transaction.find({ companyId });

    const totalPurchases = transactions.length;

    const totalSpent = transactions.reduce((s, t) => s + t.amountPaid, 0);
    const purchasedCredits = transactions.reduce(
      (s, t) => s + t.creditsPurchased,
      0
    );

    return res.status(200).json({
      msg: "Company dashboard data fetched",
      data: {
        totalPurchases,
        purchasedCredits,
        totalSpent,
      },
    });

  } catch (error) {
    console.error("Company Dashboard Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


exports.getAdminDashboard = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: "farmer" });
    const totalCompanies = await User.countDocuments({ role: "company" });
    const totalUsers = totalFarmers + totalCompanies;

    const pendingUsers = await User.countDocuments({
      status: "pending_verification",
      role: { $in: ["farmer", "company"] },
    });

    const pendingFarmlands = await Farmland.countDocuments({
      status: "pending_verification",
    });

    const pendingVerifications = pendingUsers + pendingFarmlands;

    const transactions = await Transaction.find();
    const totalSales = transactions.length;
    const totalRevenue = transactions.reduce((s, t) => s + t.amountPaid, 0);

    return res.status(200).json({
      msg: "Admin dashboard data fetched",
      success: true,
      data: {
        totalUsers,
        totalFarmers,
        totalCompanies,
        pendingVerifications,
        pendingUsers,
        pendingFarmlands,
        totalSales,
        revenue: totalRevenue,
        systemHealth: "99.9%", // Mocked for now
        activeNodes: 8 // Mocked for now
      },
    });

  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({ error: error.message, success: false });
  }
};
