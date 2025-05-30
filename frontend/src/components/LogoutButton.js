import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogoutButton = ({ 
  variant = "outlined", 
  color = "secondary", 
  sx = {}, 
  showConfirmDialog = false,
  startIcon = null,
  children = "Logout"
}) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    if (showConfirmDialog) {
      setOpenDialog(true);
    } else {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post("http://localhost:5000/api/auth/logout", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Clear all stored data
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      sessionStorage.removeItem("department");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("username");
      
      setOpenDialog(false);
      setLoggingOut(false);
      
      // Redirect to login page
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      
      // Clear local storage even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      sessionStorage.removeItem("department");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("username");
      
      setOpenDialog(false);
      setLoggingOut(false);
      
      navigate("/");
    }
  };

  const handleCancel = () => {
    if (!loggingOut) {
      setOpenDialog(false);
    }
  };

  return (
    <>
      <Button 
        variant={variant} 
        color={color} 
        onClick={handleLogoutClick}
        sx={sx}
        startIcon={startIcon}
        disabled={loggingOut}
      >
        {loggingOut ? "Logging out..." : children}
      </Button>

      {showConfirmDialog && (
        <Dialog 
          open={openDialog} 
          onClose={handleCancel}
          disableEscapeKeyDown={loggingOut}
        >
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to log out? This will allow other users with your role to log in.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCancel} 
              color="primary"
              disabled={loggingOut}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogout} 
              color="error"
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default LogoutButton;