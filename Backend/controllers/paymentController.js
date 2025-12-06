const razorpayInstance = require('../utils/razorpay');
const crypto = require('crypto');
require('dotenv').config();
const createOrder = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { amount } = req.body;
        const options = {
            amount: amount * 100,
            currency: "INR",
            // receipt: "receipt_" + req.user.id + "_" + Date.now()
            receipt: "receipt_" + "_" + Date.now()
        }

        const order = await razorpayInstance.orders.create(options);
        console.log("Razorpay Order Created:", order);
        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Unable to create order"
        })

    }
}

const verifyPayment = async (req, res) => {
    try {

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(body).digest('hex');
        if (expectedSignature === razorpay_signature) {
            return res.status(200).json({ msg: "Payment verified successfully", success: true });
        } else {
            return res.status(400).json({ msg: "Invalid signature sent", success: false });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Unable to verify payment"
        })
    }
    // Implementation for payment verification
}
module.exports = {
    createOrder,
    verifyPayment
};