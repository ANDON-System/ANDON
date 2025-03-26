const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "department", "team_leader", "employee"], required: true },
  department: String, // Assigned department
  team: String,       // Assigned team (for team leaders & employees)
});

module.exports = mongoose.model("User", UserSchema);
