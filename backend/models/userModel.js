const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "department", "team_leader", "employee", "operator"], required: true },
  department: String, // Assigned department
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },       // Assigned team (for team leaders & employees)
  isLoggedIn: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);
