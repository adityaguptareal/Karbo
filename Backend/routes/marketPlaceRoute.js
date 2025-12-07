const { Router } = require("express");
const router = Router();

const { getMarketplaceListings } = require("../controllers/marketPlaceController");

router.get("/listings", getMarketplaceListings);

module.exports = router;
