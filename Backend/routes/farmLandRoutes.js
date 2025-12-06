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


router.post(
  "/create",
  auth,
  isFarmer,
  upload.fields([
    { name: "documents", maxCount: 5 },
    { name: "images", maxCount: 5 }
  ]),
  createFarmland
);

router.get("/my", auth, isFarmer, getMyFarmlands);

router.get("/:id", auth, getFarmlandById);

router.get("/", auth, searchFarmland);

module.exports = router;
