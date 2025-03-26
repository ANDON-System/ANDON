import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password, role });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      switch (data.role) {
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
        default:
          break;
      }
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message || "Server error");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <select onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="department">Department</option>
          <option value="team_leader">Team Leader</option>
          <option value="employee">Employee</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
