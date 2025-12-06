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
    { name: "documents", maxCount: 5 },
    { name: "images", maxCount: 5 }
  ]),
  createFarmland
);
router.get("/my",getMyFarmlands);
router.get("/:id",getFarmlandById);
router.get("/",searchFarmland);

module.exports = router;
