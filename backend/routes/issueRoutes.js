const express = require("express");
const {
  reportIssue,
  getOpenIssues,
  getResolvedIssues,
  getCompletedIssues,
  updateIssueStatus,
  acknowledgeIssue,
  getAcknowledgedIssues,
  markAsRead,
  escalateIssue,
  getEscalatedIssues,
  getInProgressIssues,
  updateIssue,
  createOldIssue,
  getOldIssues,
  getIssueById, // Import the new function
  getUpdatedIssues,
  assignIssue
} = require("../controllers/issueController");
const authMiddleware = require("../config/authMiddleware");


const router = express.Router();

router.post("/", authMiddleware(), reportIssue); // Ensure the middleware is applied here
router.get("/", authMiddleware(), getOpenIssues); // Also apply it to getOpenIssues if needed
router.get("/resolved", getResolvedIssues); // Fetch resolved issues
router.get("/updated", getUpdatedIssues);   //fetch updated issues
router.get("/completed", getCompletedIssues); // Fetch completed issues
router.get("/acknowledged", getAcknowledgedIssues); // Fetch acknowledged issues
router.get("/escalated", getEscalatedIssues); // Fetch escalated issues
router.get('/in-progress', getInProgressIssues); // Fetch in-progress issues
router.put("/:id", updateIssueStatus);
router.put("/acknowledge/:id", acknowledgeIssue);
router.put("/mark-as-read/:id", markAsRead); // This line is for marking as read
router.put("/escalate/:id", escalateIssue); // This line is for escalating
router.put("/:id", updateIssue); // Update issue

router.post("/old", createOldIssue); // Add this line
// Route to fetch old issues
router.get("/old/:id", getOldIssues); // Fetch old issues related to a specific issue ID

// Route to fetch an issue by ID
router.get("/:id", getIssueById); // Ensure this route exists

router.put("/:id/assign", authMiddleware(["department", "team_leader"]), assignIssue);

// Example route for fetching acknowledged issues
router.get('/acknowledged', authMiddleware(), async (req, res) => {
    try {
        const issues = await Issue.find({ status: 'Acknowledged', assignee: req.query.assignee });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/timeline', async (req, res) => {
  try {
    const data = await Issue.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 6)) // Last 7 days
          }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          date: "$_id.date",
          status: "$_id.status",
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error('Aggregation error:', error);
    res.status(500).json({ message: 'Error aggregating issue data.' });
  }
});

module.exports = router;