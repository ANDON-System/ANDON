const User = require("../models/userModel");

exports.assignTeamLeader = async (req, res) => {
    const { userId, team } = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(userId, { role: "team_leader", team }, { new: true });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
