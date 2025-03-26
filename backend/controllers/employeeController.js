const User = require("../models/userModel");

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: "employee" });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addEmployee = async (req, res) => {
    try {
        const newEmployee = new User(req.body);
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await User.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        res.json({ message: "Employee deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
