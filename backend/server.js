require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const teamLeaderRoutes = require("./routes/teamLeaderRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const issueRoutes = require("./routes/issueRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // Import dashboard route
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/team-leader", teamLeaderRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/dashboard", dashboardRoutes); // Dashboard route added
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));