import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <Sidebar />
      <h2>Welcome, Admin!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AdminDashboard;
