import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import TeamLeaderDashboard from "./pages/TeamLeader/TeamLeaderDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManageTeamLeader from "./pages/Department/ManageTeamLeader";
import OperatorDashboard from "./pages/Operator/OperatorDashboard";
import SupportDashboard from "./pages/SupportTeam/SupportDashboard";
import ActiveIssues from "./pages/Operator/ActiveIssues";
import ResolvedIssues from "./pages/Operator/ResolvedIssues";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/department-dashboard" element={<DepartmentDashboard />} />
        <Route path="/team-leader-dashboard" element={<TeamLeaderDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/manage-team" element={<ManageTeamLeader/>} />
        <Route path="/operator-dashboard" element={<OperatorDashboard/>}/>
        <Route path="/support-dashboard" element={<SupportDashboard/>}/>
        <Route path="/active-issues" element={<ActiveIssues/>}/>
        <Route path="/resolved-issues" element={<ResolvedIssues/>}/>
      </Routes>
    </Router>
  );
}

export default App;
