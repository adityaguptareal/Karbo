const { Router } = require("express");
const router = Router();

const auth = require("../middleware/authMiddleware");
const isFarmer = require("../middleware/isFarmer");
const isCompany = require("../middleware/isCompany");
const isAdmin = require("../middleware/isAdmin");

const {
  getFarmerDashboard,
  getCompanyDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");

router.get("/farmer", auth, isFarmer, getFarmerDashboard);
router.get("/company", auth, isCompany, getCompanyDashboard);
router.get("/admin", auth, isAdmin, getAdminDashboard);

module.exports = router;
