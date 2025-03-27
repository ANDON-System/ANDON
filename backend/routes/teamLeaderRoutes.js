const express = require("express");
const { getAllTeamLeaders, assignTeamLeader, removeTeamLeader } = require("../controllers/teamLeaderController");
const authMiddleware = require("../config/authMiddleware");

const router = express.Router();

router.get("/all", authMiddleware("admin"), getAllTeamLeaders);
router.post("/assign", authMiddleware("admin"), assignTeamLeader);
router.delete("/remove/:userId", authMiddleware("admin"), removeTeamLeader);

module.exports = router;
