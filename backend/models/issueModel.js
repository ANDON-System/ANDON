const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
  status: { type: String, enum: ["Open", "Acknowledged", "Resolved", "Escalated", "In Progress", "Completed"], default: "Open" },
  resolution: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User ", required: true },
  departments: { type: [String], required: true },
  machine_id: { type: String, required: true },
  sla: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  escalationRecipient: { type: String },
  escalationReason: { type: String },
  name: { type: String, default: "Unassigned" } // New field added
});

module.exports = mongoose.model("Issue", IssueSchema);
