const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Create a new department
router.post('/', departmentController.createDepartment);

// Get all departments
router.get('/', departmentController.getDepartments);

// Update a department
router.put('/:id', departmentController.updateDepartment);

// Delete a department
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;