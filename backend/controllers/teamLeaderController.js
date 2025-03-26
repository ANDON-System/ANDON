const User = require("../models/userModel");
const Team = require("../models/teamModel");

// Get all team leaders
exports.getAllTeamLeaders = async (req, res) => {
    try {
        const leaders = await User.find({ role: "team_leader" }).populate("team");
        res.json(leaders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Assign a team leader
exports.assignTeamLeader = async (req, res) => {
    const { userId, teamId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ message: "Team not found" });

        user.role = "team_leader";
        user.team = teamId;
        await user.save();

        team.leader = userId;
        await team.save();

        res.json({ message: "Team leader assigned successfully", user, team });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Remove team leader role
exports.removeTeamLeader = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = "employee";
        user.team = null;
        await user.save();

        await Team.updateOne({ leader: userId }, { leader: null });

        res.json({ message: "Team leader removed successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
