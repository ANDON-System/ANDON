import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Container, Typography, MenuItem } from "@mui/material";

const roles = ["admin", "department", "team_leader", "employee"];

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("User already exists or invalid input.");
    }
  };

  return (
    <Container>
      <Typography variant="h4">Register</Typography>
      <TextField label="Name" name="name" fullWidth onChange={handleChange} />
      <TextField label="Email" name="email" fullWidth onChange={handleChange} />
      <TextField label="Password" name="password" type="password" fullWidth onChange={handleChange} />
      <TextField
        select
        label="Role"
        name="role"
        fullWidth
        onChange={handleChange}
        value={form.role}
      >
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" onClick={handleRegister}>Register</Button>
      <Typography variant="body2">Already registered? <a href="/">Login</a></Typography>
    </Container>
  );
}

export default Register;
