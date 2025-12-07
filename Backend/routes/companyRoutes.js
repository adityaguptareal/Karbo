const { Router } = require("express");
const router = Router();

const auth = require("../middleware/authMiddleware");
const isCompany = require("../middleware/isCompany");

const upload = require("../utils/upload");

const { uploadCompanyDocuments, getCompanyTransactions } = require("../controllers/companyController");

router.use(auth);
router.use(isCompany);

router.post(
  "/documents/upload",
  upload.fields([{ name: "documents", maxCount: 5 }]),
  uploadCompanyDocuments
);

router.get("/transactions", getCompanyTransactions);

module.exports = router;
