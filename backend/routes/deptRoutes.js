const express = require("express");
const { assignTeamLeader } = require("../controllers/deptController");

const router = express.Router();

router.post("/assign-team-leader", assignTeamLeader);

module.exports = router;
