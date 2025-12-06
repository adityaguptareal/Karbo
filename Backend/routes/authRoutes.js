const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    registerUser,
    googleAuth,
    loginUser,
    getProfile
} = require("../controllers/authController");


router.post("/register", registerUser);
router.post("/google", googleAuth);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getProfile);

module.exports = router;
