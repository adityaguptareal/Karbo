const { Router } = require("express");
const router = Router();

const auth = require("../middleware/authMiddleware");
const isFarmer = require("../middleware/isFarmer");

const {
  createListing,
  getMyListings,
  updateListing,
  deleteListing,
} = require("../controllers/farmerListingController");

router.use(auth);
router.use(isFarmer);

// Farmer Listing Routes for Marketplace
router.post("/create", createListing);
router.get("/my", getMyListings);
router.put("/update/:id", updateListing);
router.delete("/delete/:id", deleteListing);


module.exports = router;
