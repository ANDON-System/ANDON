const Department = require('../models/departmentModel');
const bcrypt = require('bcrypt');

// Create a new department
exports.createDepartment = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newDepartment = new Department({ 
            name: req.body.name,
            manager: req.body.manager,
            email_id: req.body.email_id,
            password: hashedPassword, // Ensure the hashed password is set
            role: req.body.role // Add role here
        });
        console.log('New Department Object:', newDepartment); // Log the new department object
        await newDepartment.save();
        res.status(201).json(newDepartment);
    } catch (error) {
        console.error('Error creating department:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update a department
exports.updateDepartment = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, { ...req.body, password: hashedPassword }, { new: true });
        res.json(updatedDepartment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch all departments
exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a department
exports.deleteDepartment = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};