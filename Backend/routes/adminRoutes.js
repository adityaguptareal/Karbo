const { Router } = require("express");
const router = Router();
const { createAdmin, rejectUser, approveUser, toggleBlockUser, PendingUsers, getUserDetails } = require("../controllers/adminController");
const { loginUser } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const { getPendingFarmlands, getFarmlandFullDetails, approveFarmland, rejectFarmland } = require("../controllers/adminFarmlandController");
const {
  getPendingCompanies,
  approveCompany,
  rejectCompany
} = require("../controllers/adminController");

router.post("/login", loginUser);


router.use(auth);
router.use(isAdmin);
router.post("/create", createAdmin);


// user management routes
router.get("/users/pending", PendingUsers);
router.patch("/users/reject/:id", rejectUser);
router.patch("/users/approve/:id", approveUser);
router.patch("/users/block/:id", toggleBlockUser);
router.get("/users/:id", getUserDetails);


// farmland management routes
router.get('/farmlands/pending', getPendingFarmlands);
router.get('/farmlands/:id', getFarmlandFullDetails);
router.patch('/farmlands/approve/:id', approveFarmland);
router.patch('/farmlands/reject/:id', rejectFarmland);

// company management routes
router.get("/company/pending", getPendingCompanies);
router.patch("/company/approve/:id", approveCompany);
router.patch("/company/reject/:id", rejectCompany);


module.exports = router;