const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Department = require("../models/departmentModel");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if the user already exists
    const existingUser  = await User.findOne({ email });
    if (existingUser ) {
      return res.status(400).json({ message: "User  already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser  = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department: (role === "employee" || role === "team_leader") ? department : (role === "department" ? department : "") // Save department name
    });

    // Save the new user to the database
    const savedUser  = await newUser .save();
    res.status(201).json({ message: "User  registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;
      console.log("Login Attempt:", email, password);

      // Check if the user is a department or a user
      const user = await User.findOne({ email }) || await Department.findOne({ email_id: email });
      
      if (!user) {
          console.log("User  not found");
          return res.status(400).json({ message: "Invalid credentials" });
      }

      console.log("User  found:", user.role);

      // Compare the password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.log("Password does not match");
          return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create a token
      const token = jwt.sign(
        { userId: user._id, role: user.role || "department" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expires in 1 hour
    );
    

      res.json({ token, user });
  } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    console.log("user",user);
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRole = async (req, res) => {
  try {
      // First check in the User collection
      let user = await User.findOne({ email: req.params.email });
      
      // If not found, check in the Department collection
      if (!user) {
          user = await Department.findOne({ email_id: req.params.email });
      }

      if (!user) return res.status(404).json({ message: "User  not found" });
      
      // Return the role based on the collection
      const role = user.role || "department"; // Default to "department" if role is not set
      res.json({ role });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};