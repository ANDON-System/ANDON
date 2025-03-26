import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
