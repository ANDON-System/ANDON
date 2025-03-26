import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Container, Typography, MenuItem } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <TextField label="Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" onClick={handleLogin}>Login</Button>
      <Typography variant="body2">Don't have an account? <a href="/register">Register</a></Typography>
    </Container>
  );
}

export default Login;
