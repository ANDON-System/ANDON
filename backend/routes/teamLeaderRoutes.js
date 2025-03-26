const express = require("express");
const { getTeamDetails, updateTeamLeader } = require("../controllers/teamLeaderController");

const router = express.Router();

router.get("/team-details/:teamId", getTeamDetails);
router.put("/update-leader/:leaderId", updateTeamLeader);

module.exports = router;
