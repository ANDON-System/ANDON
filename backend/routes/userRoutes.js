const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Import User model

// Get all employees
router.get("/", async (req, res) => {
    try {
        const employees = await User.find({ role: "employee" }).select("_id name");
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;


