const express = require("express");
const { register, login, getUser, getRole } = require("../controllers/authController"); // ✅ Include getRole
const authMiddleware = require("../config/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, getUser);
router.get("/getRole/:email", getRole); // Now it will work

module.exports = router;
