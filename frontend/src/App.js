import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DepartmentDashboard from "./pages/Department/DepartmentDashboard";
import TeamLeaderDashboard from "./pages/TeamLeader/TeamLeaderDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManageTeamLeader from "./pages/Department/ManageTeamLeader";
import OperatorDashboard from "./pages/Operator/OperatorDashboard";
import SupportDashboard from "./pages/SupportTeam/SupportDashboard";
import ActiveIssues from "./pages/Operator/ActiveIssues";
import ResolvedIssues from "./pages/Operator/ResolvedIssues";
import Issues from "./pages/SupportTeam/Issues";
import MyAssignments from "./pages/SupportTeam/MyAssignment";
import UserRoleManagement from "./pages/Admin/UserRoleManagement";
import IssueCategory from "./pages/Admin/IssueCategory";
import DepartmentManagement from "./pages/Admin/DepartmentManagement";
import TeamIssues from "./pages/TeamLeader/TeamIssues";



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
        <Route path="/issues" element={<Issues/>}/>
        <Route path="/my-assignments" element={<MyAssignments/>}/>
        <Route path="/user-management" element={<UserRoleManagement/>}/>
        <Route path="/issues-category" element={<IssueCategory/>}/>
        <Route path="/department-manage" element={<DepartmentManagement/>}/>
        <Route path="/team-issues" element={<TeamIssues/>}/>


      </Routes>
    </Router>
  );
}

export default App;