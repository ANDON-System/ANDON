const express = require("express");
const { login } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);

module.exports = router;  // ✅ Make sure to export router
