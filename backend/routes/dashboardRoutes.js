const express = require("express");
const router = express.Router();
const Department = require("../models/Department");  // Adjust paths based on your structure
const TeamLeader = require("../models/TeamLeader");
const Issue = require("../models/Issue");

router.get("/dashboard", async (req, res) => {
    try {
        const departmentsCount = await Department.countDocuments() || 0;
        const teamLeadersCount = await TeamLeader.countDocuments() || 0;
        const openIssuesCount = await Issue.countDocuments({ status: "open" }) || 0;
        const resolvedIssuesCount = await Issue.countDocuments({ status: "resolved" }) || 0;

        res.json({
            totalDepartments: departmentsCount,
            totalTeamLeaders: teamLeadersCount,
            openIssues: openIssuesCount,
            resolvedIssues: resolvedIssuesCount,
            recentActivities: [
                "Issue #1023 updated",
                "New user Sarah Thompson added",
                "Issue #1045 marked as resolved"
            ],
            pendingAssignments: [
                "Issue #1007 needs assignment",
                "Issue #1024 needs reassignment"
            ]
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
