const express = require("express");
const { reportIssue, getAllIssues, updateIssueStatus } = require("../controllers/issueController");

const router = express.Router();

router.post("/report", reportIssue);
router.get("/", getAllIssues);
router.put("/:id", updateIssueStatus);

module.exports = router;
