const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  description: String,
  status: { type: String, enum: ["pending", "resolved"], default: "pending" },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: String,
  team: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Issue", IssueSchema);
