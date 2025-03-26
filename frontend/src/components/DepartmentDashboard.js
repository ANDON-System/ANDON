import { useNavigate } from "react-router-dom";

function DepartmentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h2>Welcome, Department Head!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DepartmentDashboard;
