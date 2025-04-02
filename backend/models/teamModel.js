const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Team name (e.g., "Production Team")
});

module.exports = mongoose.model("Team", TeamSchema);
