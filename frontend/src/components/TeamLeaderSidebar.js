import { useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TeamLeaderSidebar = ({ onDownloadClick }) => {
    const navigate = useNavigate();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = async () => {
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
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("department");
            sessionStorage.removeItem("name");
            
            setOpenLogoutDialog(false);
            setLoggingOut(false);
            
            // Redirect to login page
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
            
            // Clear local storage even if API call fails
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("department");
            sessionStorage.removeItem("name");
            
            setOpenLogoutDialog(false);
            setLoggingOut(false);
            
            navigate("/");
        }
    };

    const handleLogoutCancel = () => {
        if (!loggingOut) {
            setOpenLogoutDialog(false);
        }
    };

    const handleDownloadClick = () => {
        if (onDownloadClick) {
            onDownloadClick();
        }
    };

    return (
        <>
            <AppBar position="fixed" sx={{ backgroundColor: "#1976d2" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton color="inherit" onClick={() => navigate("/team-leader-dashboard")}>
                            <DashboardIcon />
                            <Typography variant="subtitle1" sx={{ ml: 1 }}>Team Leader Dashboard</Typography>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton
                            color="inherit"
                            onClick={handleDownloadClick}
                            title="Download Team Leader Report"
                        >
                            <DownloadIcon />
                        </IconButton>
                        <Button 
                            color="inherit" 
                            startIcon={<ExitToAppIcon />} 
                            onClick={handleLogoutClick}
                            disabled={loggingOut}
                        >
                            {loggingOut ? "Logging out..." : "Logout"}
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Logout Confirmation Dialog */}
            <Dialog 
                open={openLogoutDialog} 
                onClose={handleLogoutCancel}
                disableEscapeKeyDown={loggingOut}
            >
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to log out? This will allow other team leaders to log in.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleLogoutCancel} 
                        color="primary"
                        disabled={loggingOut}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleLogoutConfirm} 
                        color="error"
                        disabled={loggingOut}
                    >
                        {loggingOut ? "Logging out..." : "Logout"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TeamLeaderSidebar;