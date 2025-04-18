import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <Sidebar />
      <h2>Welcome, Employee!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default EmployeeDashboard;
