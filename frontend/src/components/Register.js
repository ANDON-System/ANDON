import { useState } from "react";
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

const roles = ["admin", "department", "team_leader", "employee", "operator"];
const departments = [
  "Production team",
  "Quality team",
  "Manufacturing team",
  "Logistics team",
  "Safety team",
  "Maintenance team",
];

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "", department: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("Form Data:", form); // Log form data for debugging
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
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
          <TextField label="Name" name="name" fullWidth onChange={handleChange} />
          <TextField label="Email" name="email" fullWidth onChange={handleChange} />
          <TextField label="Password" name="password" type="password" fullWidth onChange={handleChange} />

          <TextField
            select
            label="Role"
            name="role"
            fullWidth
            value={form.role}
            onChange={handleChange}
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
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
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