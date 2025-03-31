const express = require("express");
const {
  reportIssue,
  getOpenIssues,
  getResolvedIssues,
  updateIssueStatus,
  acknowledgeIssue
} = require("../controllers/issueController");

const router = express.Router();

router.post("/", reportIssue);
router.get("/", getOpenIssues); // Fetch open issues
router.get("/resolved", getResolvedIssues); // Fetch resolved issues
router.put("/:id", updateIssueStatus);
router.put("/acknowledge/:id", acknowledgeIssue);

module.exports = router;