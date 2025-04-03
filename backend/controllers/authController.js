const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  console.log("Request Body:", req.body); // Log the request body for debugging
  try {
    const { name, email, password, role, department } = req.body; // Include department

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
      department: department || "Default Department" // Use the department from the request or a default value
    });

    // Save the new user to the database
    const savedUser  = await newUser .save();
    console.log("Saved User:", savedUser ); // Log the saved user for debugging
    res.status(201).json({ message: "User  registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err); // Log any errors
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Attempt:", email, password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
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
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRole = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
