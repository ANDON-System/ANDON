const mongoose = require('mongoose');

const oldIssueSchema = new mongoose.Schema({
  originalIssueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { type: String },
  departments: { type: [String], default: [] },
  resolution: { type: String },
  machine_id: { type: String },
  sla: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: { type: String, default: "Unassigned" }, // Field for display name
  assignee: { type: String } // Field for the assigned user
});

module.exports = mongoose.model('OldIssue', oldIssueSchema);