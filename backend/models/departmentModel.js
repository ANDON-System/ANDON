const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    manager: { type: String, required: true },
    email_id: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Ensure this field is defined
    role: { type: String, required: true } // Add role field
}, { timestamps: true });

const Department = mongoose.model('Department', DepartmentSchema);
module.exports = Department;