const User = require("../models/userModel");

exports.assignDepartment = async (req, res) => {
  const { userId, department } = req.body;
  
  try {
    const user = await User.findByIdAndUpdate(userId, { department }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
