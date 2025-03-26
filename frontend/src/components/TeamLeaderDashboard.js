import { useNavigate } from "react-router-dom";

function TeamLeaderDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h2>Welcome, Team Leader!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default TeamLeaderDashboard;
