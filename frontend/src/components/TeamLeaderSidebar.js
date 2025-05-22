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

const TeamLeaderSidebar = ({ onDownloadClick }) => {
    const navigate = useNavigate();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        setOpenLogoutDialog(false);
        localStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("department");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("name");
        navigate("/");
    };

    const handleLogoutCancel = () => {
        setOpenLogoutDialog(false);
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
                            <Typography variant="subtitle1" sx={{ ml: 1 }}>Dashboard</Typography>
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
                        <Button color="inherit" startIcon={<ExitToAppIcon />} onClick={handleLogoutClick}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Logout Confirmation Dialog */}
            <Dialog open={openLogoutDialog} onClose={handleLogoutCancel}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to log out?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutCancel} color="primary">Cancel</Button>
                    <Button onClick={handleLogoutConfirm} color="error">Logout</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TeamLeaderSidebar;