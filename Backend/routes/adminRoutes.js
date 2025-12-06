const {Router} = require("express");
const router = Router();
const {createAdmin, } = require("../controllers/adminController");
const {loginUser} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

router.post("/login",loginUser);
router.use(auth);
router.use(isAdmin);
router.post("/create", createAdmin);
module.exports = router;