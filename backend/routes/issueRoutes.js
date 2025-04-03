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
  getInProgressIssues
} = require("../controllers/issueController");

const router = express.Router();

router.post("/", reportIssue);
router.get("/", getOpenIssues); // Fetch open issues
router.get("/resolved", getResolvedIssues); // Fetch resolved issues
router.get("/completed", getCompletedIssues); // Fetch completed issues
router.get("/acknowledged", getAcknowledgedIssues); // Fetch acknowledged issues
router.get("/escalated", getEscalatedIssues); // Fetch escalated issues
router.get('/in-progress', getInProgressIssues); // Fetch in-progress issues
router.put("/:id", updateIssueStatus);
router.put("/acknowledge/:id", acknowledgeIssue);
router.put("/mark-as-read/:id", markAsRead); // This line is for marking as read
router.put("/escalate/:id", escalateIssue); // This line is for escalating

module.exports = router;