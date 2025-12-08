const { Router } = require("express");
const router = Router();

const auth = require("../middleware/authMiddleware");
const isFarmer = require("../middleware/isFarmer");   // Only farmer can create farmland

const {
  createFarmland,
  getMyFarmlands,
  getFarmlandById,
  searchFarmland
} = require("../controllers/farmLandController");

const upload = require("../utils/upload");


router.use(auth);
router.use(isFarmer);
// Farmer Land management routes



router.post(
  "/create",
  upload.fields([
    { name: "documents", maxCount: 10 },
    { name: "images", maxCount: 10 }
  ]),
  createFarmland
);
router.get("/my", getMyFarmlands);
router.get("/farm/:id", getFarmlandById);
router.get("/search", searchFarmland);

module.exports = router;
