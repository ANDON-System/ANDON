const Issue = require("../models/issueModel");
const OldIssue = require("../models/oldIssueModel"); // Import the old issue model

// Report a new issue
exports.reportIssue = async (req, res) => {
  try {
      const newIssue = new Issue({
          ...req.body,
          reportedBy: req.user.userId, // Associate the issue with the logged-in user
          name: "Unassigned" // Set default name
      });
      await newIssue.save();
      res.status(201).json(newIssue);
  } catch (error) {
      console.error("Error during issue creation:", error);
      res.status(500).json({ error: "Failed to create issue", details: error.message });
  }
};


// Get all open issues
// Get open issues for a department
// Get open issues for a team leader based on their name and department
exports.getOpenIssues = async (req, res) => {
  try {
      const { name, department, assignee } = req.query; // Get name, department, and assignee from query
      // Create a filter object based on the presence of name, department, and assignee
      const filter = {
          status: "Open",
          ...(name && { name }), // Include name filter if provided
          ...(department && { departments: department }), // Include department filter if provided
          ...(assignee && { assignee }) // Include assignee filter if provided
      };
      const openIssues = await Issue.find(filter);
      res.json(openIssues);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch open issues", details: error.message });
  }
};




// Get all resolved issues
exports.getResolvedIssues = async (req, res) => {
  try {
      const { name, department, assignee } = req.query;
      const filter = {
          status: 'Resolved',
          ...(name && { name }),
          ...(department && { departments: department }),
          ...(assignee && { assignee })
      };
      const issues = await Issue.find(filter);
      res.json(issues);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Get all acknowledged issues
exports.getAcknowledgedIssues = async (req, res) => {
  try {
      const { name, department, assignee } = req.query;
      const filter = {
          status: "Acknowledged",
          ...(name && { name }),
          ...(department && { departments: department }),
          ...(assignee && { assignee })
      };
      const acknowledgedIssues = await Issue.find(filter);
      res.json(acknowledgedIssues);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch acknowledged issues", details: error.message });
  }
};

// Update issue status
exports.updateIssueStatus = async (req, res) => {
  
  try {
    console.log("req",req.body);
    const { status, title,description,priority,machine_id,sla,departments, resolution,escalationRecipient, escalationReason,assignee,name } = req.body; // Expecting resolution in the request body

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status, title,description,priority,departments,machine_id,sla, resolution, escalationRecipient, escalationReason,assignee,name }, // Update status and resolution
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
      const { name, department, assignee } = req.query;
      const filter = {
          status: "Escalated",
          ...(name && { name }),
          ...(department && { departments: department }),
          ...(assignee && { assignee })
      };
      const escalatedIssues = await Issue.find(filter);
      res.json(escalatedIssues);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch escalated issues", details: error.message });
  }
};

// Get all in-progress issues
exports.getInProgressIssues = async (req, res) => {
  try {
      const { name, department, assignee } = req.query;
      const filter = {
          status: 'In Progress',
          ...(name && { name }),
          ...(department && { departments: department }),
          ...(assignee && { assignee })
      };
      const issues = await Issue.find(filter);
      res.json(issues);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch in-progress issues", details: error.message });
  }
};

// Get all completed issues
exports.getCompletedIssues = async (req, res) => {
  try {
      const { name, department, assignee } = req.query;
      const filter = {
          status: "Completed",
          ...(name && { name }),
          ...(department && { departments: department }),
          ...(assignee && { assignee })
      };
      const completedIssues = await Issue.find(filter);
      res.json(completedIssues);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch completed issues", details: error.message });
  }
};


// Route to fetch old issues
exports.getOldIssues = async (req, res) => {
  try {
    const oldIssues = await OldIssue.find({ originalIssueId: req.params.id });
    res.json(oldIssues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update issue
exports.updateIssue = async (req, res) => {
  try {
    console.log("req",req.body);
    
    const { title, description, priority, departments, machine_id, sla, status } = req.body;

    // Find the existing issue
    const existingIssue = await Issue.findById(req.params.id);
    if (!existingIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    // Save the old issue details to the OldIssue collection
    const oldIssue = new OldIssue({
      originalIssueId: existingIssue._id,
      title: existingIssue.title,
      description: existingIssue.description,
      priority: existingIssue.priority,
      status: existingIssue.status,
      departments: existingIssue.departments,
      resolution: existingIssue.resolution,
      machine_id: existingIssue.machine_id,
      sla: existingIssue.sla,
      createdAt: existingIssue.createdAt,
      updatedAt: existingIssue.updatedAt
    });
    await oldIssue.save();

    // Update the existing issue
    existingIssue.title = title;
    existingIssue.description = description;
    existingIssue.priority = priority;
    existingIssue.departments = departments;
    existingIssue.machine_id = machine_id;
    existingIssue.sla = sla;
    existingIssue.status = status;
    existingIssue.updatedAt = Date.now(); // Update the timestamp

    await existingIssue.save(); // Save the updated issue

    res.json(existingIssue); // Return the updated issue
  } catch (error) {
    res.status(500).json({ error: "Failed to update issue", details: error.message });
  }
};


// Get issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch issue", details: error.message });
  }
};

// Route to create a new old issue
exports.createOldIssue = async (req, res) => {
  try {
    const newOldIssue = new OldIssue(req.body);
    await newOldIssue.save();
    res.status(201).json(newOldIssue);
  } catch (error) {
    res.status(500).json({ error: "Failed to create old issue", details: error.message });
  }
};

exports.getUpdatedIssues = async (req, res) => {
  try {
      const { name, department, assignee } = req.query;
      const filter = {
          status: 'Updated',
          ...(name && { name }),
          ...(department && { departments: department }),
          ...(assignee && { assignee })
      };
      const issues = await Issue.find(filter);
      res.json(issues);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch updated issues", details: error.message });
  }
};


// Add this function to handle assigning an issue
// issueController.js
exports.assignIssue = async (req, res) => {
    const { assignee, name } = req.body; // Expecting both the assignee's ID and name from the request body
    try {
        const updatedIssue = await Issue.findByIdAndUpdate(
            req.params.id,
            { assignee, name }, // Update both fields
            { new: true }
        );
        if (!updatedIssue) return res.status(404).json({ error: "Issue not found" });
        res.json(updatedIssue);
    } catch (error) {
        console.error("Error assigning issue:", error);
        res.status(500).json({ error: "Failed to assign issue", details: error.message });
    }
};


