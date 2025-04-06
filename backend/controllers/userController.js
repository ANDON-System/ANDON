// controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fetch all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new user
const createUser  = async (req, res) => {
  const { name, email, password, department, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser  = new User({ name, email, password: hashedPassword, department, role });
    await newUser .save();
    res.status(201).json(newUser );
  } catch (error) {
    res.status(400).json({ message: 'Error creating user' });
  }
};

// Update a user
const updateUser  = async (req, res) => {
  const { id } = req.params;
  const { name, email, department, role } = req.body;
  try {
    const updatedUser  = await User.findByIdAndUpdate(id, { name, email, department, role }, { new: true });
    res.json(updatedUser );
  } catch (error) {
    res.status(400).json({ message: 'Error updating user' });
  }
};

// Delete a user
const deleteUser  = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: 'User  deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user' });
  }
};

// Export the controller functions
module.exports = {
  getUsers,
  createUser ,
  updateUser ,
  deleteUser ,
};