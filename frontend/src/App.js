import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import TeamLeaderDashboard from "./pages/Department/TeamLeaderDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
//import ManageTeamLeaders from "./pages/Department/TeamLeaderDashboard";
import OperatorDashboard from "./pages/Operator/OperatorDashboard";

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
        {/* <Route path="/manage-team" element={<ManageTeamLeaders/>} /> */}
        <Route path="/operator-dashboard" element={<OperatorDashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
