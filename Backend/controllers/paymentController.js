const razorpayInstance = require('../utils/razorpay');
const crypto = require('crypto');
require('dotenv').config();

const Transaction = require("../models/transactionModel");
const CarbonCredit = require("../models/carbonCreditModel");
const Wallet = require("../models/walletModel");
const User = require("../models/userModel");


const createOrder = async (req, res) => {
    try {
        const { amount, listingId } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required"
            });
        }

        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt: "rcpt_" + (listingId.slice(-8) || "generic") + "_" + Date.now()
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(201).json({
            success: true,
            order,
            listingId: listingId || null
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Unable to create order"
        });
    }
};


const verifyPayment = async (req, res) => {
    console.log("Request");
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            listingId
        } = req.body;

        console.log(razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            listingId);

        // Validate input
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid signature"
            });
        }


        if (!listingId) {
            return res.status(400).json({
                success: false,
                message: "listingId is required for DB update"
            });
        }

        const listing = await CarbonCredit.findById(listingId);

        if (!listing) {
            return res.status(404).json({ msg: "Listing not found" });
        }

        if (listing.status !== "active") {
            return res.status(400).json({ msg: "Listing is not available" });
        }

        // Get farmer
        const farmer = await User.findById(listing.farmerId);
        if (!farmer) {
            return res.status(404).json({ msg: "Farmer not found" });
        }

        // Company details from JWT
        const companyId = req.user.userId;

        // Calculate validity (1 year)
        const validFrom = new Date();
        const validTill = new Date();
        validTill.setFullYear(validFrom.getFullYear() + 1);

        // Mark listing as SOLD
        listing.status = "sold";
        listing.validFrom = validFrom;
        listing.validTill = validTill;
        await listing.save();

        // Create Transaction Entry
        const transaction = await Transaction.create({
            companyId,
            farmerId: listing.farmerId,
            carbonCreditListingId: listing._id,
            creditsPurchased: listing.totalCredits,
            amountPaid: listing.totalValue,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            invoiceUrl: ""  // optional for later
        });

        // Create Wallet Entry for farmer
        await Wallet.create({
            farmerId: listing.farmerId,
            transactionId: transaction._id,
            amount: listing.totalValue,
            type: "credit",
            description: `Credits purchased by company ${companyId}`
        });

        // Update Farmer WalletBalance
        farmer.walletBalance += listing.totalValue;
        await farmer.save();

        return res.status(200).json({
            success: true,
            msg: "Payment verified & recorded successfully",
            listingId,
            transactionId: transaction._id
        });

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Unable to verify payment"
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment
};
