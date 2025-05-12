// // controllers/userController.js
// const User = require('../models/userModel');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Fetch all users
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Create a new user
// const createUser  = async (req, res) => {
//   const { name, email, password, department, role } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser  = new User({ name, email, password: hashedPassword, department, role });
//     await newUser .save();
//     res.status(201).json(newUser );
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating user' });
//   }
// };

// // Update a user
// const updateUser  = async (req, res) => {
//   const { id } = req.params;
//   const { name, email, department, role } = req.body;
//   try {
//     const updatedUser  = await User.findByIdAndUpdate(id, { name, email, department, role }, { new: true });
//     res.json(updatedUser );
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating user' });
//   }
// };

// // Delete a user
// const deleteUser  = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await User.findByIdAndDelete(id);
//     res.json({ message: 'User  deleted' });
//   } catch (error) {
//     res.status(400).json({ message: 'Error deleting user' });
//   }
// };

// // Export the controller functions
// module.exports = {
//   getUsers,
//   createUser ,
//   updateUser ,
//   deleteUser ,
// };


// controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Create a new user
const createUser  = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ name, email, password: hashedPassword, role });
        await newUser .save();
        res.status(201).json(newUser );
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({ message: 'Error creating user' });
    }
};



// Get all users
// Get all users filtered by role
const getUsers = async (req, res) => {
  try {
    const { role } = req.query; // Get the role from query parameters

    // Filter users by role if role is passed
    const query = role ? { role } : {}; // If role is specified, filter by role
    const users = await User.find(query); // Fetch users based on the role

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};


// Update a user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, password: hashedPassword, role }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User  not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user' });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'User  not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// Export the controller functions
module.exports = { getUsers, createUser, updateUser, deleteUser };
