const Wallet = require('../models/walletModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

exports.getWalletDetails = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const walletTransactions = await Wallet.find({ farmerId: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'transactionId',
                populate: [
                    { path: 'companyId', select: 'name email' },
                    { path: 'carbonCreditListingId', select: 'pricePerCredit totalCredits' }
                ]
            });

        res.json({
            balance: user.walletBalance,
            transactions: walletTransactions
        });
    } catch (error) {
        console.error('Error fetching wallet details:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};
