const { Router } = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const router = Router();
const auth = require('../middleware/authMiddleware');
const iscompany = require('../middleware/isCompany');
// router.use(auth);
// router.use(iscompany);

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);


module.exports = router;