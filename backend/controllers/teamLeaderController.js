const Team = require("../models/teamModel");

exports.getTeamDetails = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);
        if (!team) return res.status(404).json({ message: "Team not found" });
        res.json(team);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTeamLeader = async (req, res) => {
    const { newLeaderId } = req.body;
    try {
        const team = await Team.findByIdAndUpdate(req.params.leaderId, { leader: newLeaderId }, { new: true });
        if (!team) return res.status(404).json({ message: "Team not found" });
        res.json(team);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
