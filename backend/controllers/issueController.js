const Issue = require("../models/issueModel");

// Report a new issue
exports.reportIssue = async (req, res) => {
  console.log("Received issue data:", req.body); // Log the incoming data
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

// Get all acknowledged issues
exports.getAcknowledgedIssues = async (req, res) => {
  try {
    const acknowledgedIssues = await Issue.find({ status: "Acknowledged" });
    res.json(acknowledgedIssues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch acknowledged issues", details: error.message });
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

// Escalate an issue and change its status to "Escalated"
exports.escalateIssue = async (req, res) => {
  try {
    const { escalationRecipient, escalationReason } = req.body;
    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, {
      status: 'Escalated',
      escalationRecipient,
      escalationReason
    }, { new: true });
    
    if (!updatedIssue) return res.status(404).json({ error: "Issue not found" });
    
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: "Failed to escalate issue", details: error.message });
  }
};

// Mark an issue as read and change its status to "In Progress"
exports.markAsRead = async (req, res) => {
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, { status: 'In Progress' }, { new: true });
    if (!updatedIssue) return res.status(404).json({ error: "Issue not found" });
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark issue as read", details: error.message });
  }
};

// Get all escalated issues
exports.getEscalatedIssues = async (req, res) => {
  try {
    const escalatedIssues = await Issue.find({ status: "Escalated" });
    res.json(escalatedIssues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch escalated issues", details: error.message });
  }
};

// In issueController.js
exports.getInProgressIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ status: 'In Progress' });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch in-progress issues", details: error.message });
  }
};

// Get all completed issues
exports.getCompletedIssues = async (req, res) => {
  try {
    const completedIssues = await Issue.find({ status: "Completed" });
    res.json(completedIssues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch completed issues", details: error.message });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const { title, description, priority, departments, machine_id, sla } = req.body;
    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, {
      title,
      description,
      priority,
      departments,
      machine_id,
      sla
    }, { new: true });
    if (!updatedIssue) return res.status(404).json({ error: "Issue not found" });
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: "Failed to update issue", details: error.message });
  }
};