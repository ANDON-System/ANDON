const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
  status: { type: String, enum: ["Open", "Acknowledged", "Resolved"], default: "Open" },
  resolution: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User " },
  departments: { type: [String], required: true },
  team: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Issue", IssueSchema);