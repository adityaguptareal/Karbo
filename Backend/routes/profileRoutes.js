const { Router } = require("express");
const router = Router();

const auth = require("../middleware/authMiddleware");
const {
    getMyProfile,
    updateUser,
    changePassword
} = require("../controllers/userController");

router.get("/me", auth, getMyProfile);
router.put("/update", auth, updateUser);
router.put("/change-password", auth, changePassword);

module.exports = router;
