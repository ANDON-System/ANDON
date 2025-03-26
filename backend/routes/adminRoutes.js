const express = require("express");
const { assignDepartment } = require("../controllers/adminController");
const authMiddleware = require("../config/authMiddleware");

const router = express.Router();
router.post("/assign-department", authMiddleware("admin"), assignDepartment);

module.exports = router;