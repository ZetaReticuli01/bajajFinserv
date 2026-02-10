const express = require("express");
const router = express.Router();
const { handlePost, healthCheck } = require("../controllers/bfhlController");

router.post("/bfhl", handlePost);
router.get("/health", healthCheck);

module.exports = router;
