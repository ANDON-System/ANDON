import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h2>Welcome, Employee!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default EmployeeDashboard;
