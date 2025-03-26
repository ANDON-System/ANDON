import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import DepartmentDashboard from "./components/DepartmentDashboard";
import TeamLeaderDashboard from "./components/TeamLeaderDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/department-dashboard" element={<ProtectedRoute role="department"><DepartmentDashboard /></ProtectedRoute>} />
        <Route path="/team-leader-dashboard" element={<ProtectedRoute role="team_leader"><TeamLeaderDashboard /></ProtectedRoute>} />
        <Route path="/employee-dashboard" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
