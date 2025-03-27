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

const roles = ["admin", "department", "team_leader", "employee", "operator"];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [fetchedRole, setFetchedRole] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (email.length > 3) {
      if (typingTimeout) clearTimeout(typingTimeout);

      const timeout = setTimeout(() => {
        fetchUserRole(email);
      }, 500);

      setTypingTimeout(timeout);
    } else {
      setFetchedRole("");
    }

    return () => clearTimeout(typingTimeout);
  }, [email]);

  const fetchUserRole = async (email) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/auth/getRole/${email}`);
      setFetchedRole(data.role);
    } catch (err) {
      setFetchedRole("");
    }
  };

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      if (role !== fetchedRole) {
        alert("Role mismatch! Please select the correct role.");
        return;
      }

      localStorage.setItem("token", data.token);

      // Redirect based on role
      switch (role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "department":
          navigate("/department-dashboard");
          break;
        case "team_leader":
          navigate("/team-leader-dashboard");
          break;
        case "employee":
          navigate("/employee-dashboard");
          break;
        case "operator":
          navigate("/operator-dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            select
            label="Role"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((roleOption) => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
            Login
          </Button>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Don't have an account? {" "}
            <Button color="primary" onClick={() => navigate("/register")}>
              Register here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
