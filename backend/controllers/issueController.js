const Issue = require("../models/issueModel");

// Report a new issue
exports.reportIssue = async (req, res) => {
  try {
    const newIssue = new Issue(req.body);
    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).json({ error: "Failed to create issue", details: error.message });
  }
};

// Get all open issues
exports.getOpenIssues = async (req, res) => {
  try {
    const openIssues = await Issue.find({ status: "Open" });
    res.json(openIssues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch open issues", details: error.message });
  }
};

// Get all resolved issues
exports.getResolvedIssues = async (req, res) => {
  try {
    const resolvedIssues = await Issue.find({ status: "Resolved" });
    console.log("Resolved Issues from DB:", resolvedIssues); // Log the resolved issues
    res.json(resolvedIssues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resolved issues", details: error.message });
  }
};

// Update issue status
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status, resolution } = req.body; // Expecting resolution in the request body
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status, resolution }, // Update status and resolution
      { new: true }
    );
    if (!updatedIssue) return res.status(404).json({ error: "Issue not found" });
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: "Failed to update issue", details: error.message });
  }
};

// Acknowledge an issue
exports.acknowledgeIssue = async (req, res) => {
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, { status: 'Acknowledged' }, { new: true });
    if (!updatedIssue) return res.status(404).json({ error: "Issue not found" });
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: "Failed to acknowledge issue", details: error.message });
  }
};