const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

// Get all wallet transactions (payouts) for admin
const getAllPayouts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        // Build query for search
        let query = {};
        if (search) {
            const farmers = await User.find({
                role: "farmer",
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }).select("_id");

            query.farmerId = { $in: farmers.map(f => f._id) };
        }

        // Get wallet transactions
        const wallets = await Wallet.find(query)
            .populate("farmerId", "name email walletBalance")
            .populate({
                path: "transactionId",
                populate: { path: "companyId", select: "name email" }
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Wallet.countDocuments(query);

        // Calculate total stats
        const allWallets = await Wallet.find(query);
        const totalPayouts = allWallets.reduce((sum, w) => sum + w.amount, 0);

        return res.status(200).json({
            msg: "Payouts fetched successfully",
            wallets,
            stats: {
                totalPayouts,
                totalTransactions: total
            },
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("getAllPayouts error:", error);
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
};

// Get payout details by ID
const getPayoutDetails = async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id)
            .populate("farmerId", "name email walletBalance")
            .populate({
                path: "transactionId",
                populate: { path: "companyId", select: "name email" }
            });

        if (!wallet) {
            return res.status(404).json({ msg: "Payout not found" });
        }

        return res.status(200).json({
            msg: "Payout details fetched",
            wallet
        });

    } catch (error) {
        console.error("getPayoutDetails error:", error);
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
};

// Get farmer-wise payout summary
const getFarmerPayoutSummary = async (req, res) => {
    try {
        const wallets = await Wallet.find()
            .populate("farmerId", "name email walletBalance");

        // Group by farmer
        const farmerMap = {};

        wallets.forEach(wallet => {
            if (wallet.farmerId) {
                const farmerId = wallet.farmerId._id.toString();

                if (!farmerMap[farmerId]) {
                    farmerMap[farmerId] = {
                        farmerName: wallet.farmerId.name,
                        farmerEmail: wallet.farmerId.email,
                        walletBalance: wallet.farmerId.walletBalance,
                        totalEarnings: 0,
                        transactionCount: 0,
                        lastPayout: wallet.createdAt
                    };
                }

                farmerMap[farmerId].totalEarnings += wallet.amount;
                farmerMap[farmerId].transactionCount += 1;

                if (new Date(wallet.createdAt) > new Date(farmerMap[farmerId].lastPayout)) {
                    farmerMap[farmerId].lastPayout = wallet.createdAt;
                }
            }
        });

        // Convert to array and sort by earnings
        const summary = Object.values(farmerMap).sort((a, b) => b.totalEarnings - a.totalEarnings);

        return res.status(200).json({
            msg: "Farmer payout summary fetched",
            summary
        });

    } catch (error) {
        console.error("getFarmerPayoutSummary error:", error);
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getAllPayouts,
    getPayoutDetails,
    getFarmerPayoutSummary
};
