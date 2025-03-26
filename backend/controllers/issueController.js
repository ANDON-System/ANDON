const Issue = require("../models/issueModel");

exports.reportIssue = async (req, res) => {
    try {
        const newIssue = new Issue(req.body);
        await newIssue.save();
        res.status(201).json(newIssue);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find();
        res.json(issues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateIssueStatus = async (req, res) => {
    try {
        const issue = await Issue.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!issue) return res.status(404).json({ message: "Issue not found" });
        res.json(issue);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
