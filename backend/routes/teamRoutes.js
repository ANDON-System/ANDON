const express = require("express");
const Team = require("../models/teamModel");

const router = express.Router();

// Get all teams
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

module.exports = router;
