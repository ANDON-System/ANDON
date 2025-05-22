import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Paper,
  Box,
} from "@mui/material";

const roles = ["department", "team_leader", "employee", "operator"];

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "", department: "" });
  const [departments, setDepartments] = useState([]); // State to hold fetched departments
  const navigate = useNavigate();

  // Fetch departments from the backend
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users?role=department"); // Adjust the endpoint as necessary
      setDepartments(response.data); // Set the fetched departments to state
    } catch (error) {
      console.error("Error fetching departments:", error);
      alert("Failed to fetch departments.");
    }
  };

  useEffect(() => {
    fetchDepartments(); // Fetch departments when the component mounts
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("Form Data:", form); // Log form data for debugging

    // Create a new form data object to send to the backend
    const formData = {
      ...form,
      department: form.role === "department" ? form.department : (form.role === "employee" || form.role === "team_leader" ? form.department : ""), // Store the department name if role is department, employee, or team_leader
    };

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error in registration.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField 
            label="Name" 
            name="name" 
            fullWidth 
            onChange={handleChange} 
            required // Make this field required
          />
          <TextField 
            label="Email" 
            name="email" 
            fullWidth 
            onChange={handleChange} 
            required // Make this field required
          />
          <TextField 
            label="Password" 
            name="password" 
            type="password" 
            fullWidth 
            onChange={handleChange} 
            required // Make this field required
          />

          <TextField
            select
            label="Role"
            name="role"
            fullWidth
            value={form.role}
            onChange={handleChange}
            required // Make this field required
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          {form.role === "employee" && (
            <TextField
              select
              label="Department"
              name="department"
              fullWidth
              value={form.department}
              onChange={handleChange}
              required // Make this field required
            >
              {departments.map((dept) => (
                <MenuItem key={dept._id} value={dept.name}> {/* Use dept.name instead of dept._id */}
                  {dept.name} {/* Display the department name */}
                </MenuItem>
              ))}
            </TextField>
          )}

          {form.role === "team_leader" && (
            <TextField
              select
              label="Department"
              name="department"
              fullWidth
              value={form.department}
              onChange={handleChange} required // Make this field required
            >
              {departments.map((dept) => (
                <MenuItem key={dept._id} value={dept.name}> {/* Use dept.name instead of dept._id */}
                  {dept.name} {/* Display the department name */}
                </MenuItem>
              ))}
            </TextField>
          )}

          {form.role === "department" && (
            <TextField
              label="Department Name"
              name="department"
              fullWidth
              onChange={handleChange}
              required // Make this field required
            />
          )}

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            Register
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account? {" "}
            <Button color="primary" onClick={() => navigate("/")}>
              Login here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
