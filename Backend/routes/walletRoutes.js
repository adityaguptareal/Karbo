const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

// Getting Farmer Payment Details
router.get('/', authMiddleware, walletController.getWalletDetails);

module.exports = router;
