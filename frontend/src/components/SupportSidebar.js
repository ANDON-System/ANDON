import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DownloadIcon from "@mui/icons-material/Download"; // Import Download Icon
import { useNavigate } from "react-router-dom";

const SupportNavbar = ({ onDownloadClick }) => { // Accept onDownloadClick as a prop
    const navigate = useNavigate();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        setOpenLogoutDialog(false);
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleLogoutCancel = () => {
        setOpenLogoutDialog(false);
    };

    return (
        <>
            <AppBar position="fixed" sx={{ backgroundColor: "#1976d2" }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={() => navigate("/support-dashboard")}
                        sx={{ display: "flex", flexDirection: "column", mr: 2 }}
                    >
                        <Typography variant="h5" sx={{ mt: 0.5 }}>Support Dashboard</Typography>
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton
                        color="inherit"
                        onClick={onDownloadClick} // Call the download function
                        sx={{ display: "flex", flexDirection: "column" }}
                    >
                        <DownloadIcon />
                        <Typography variant="caption" sx={{ mt: 0.5 }}>Download Report</Typography>
                    </IconButton>

                    <IconButton
                        color="inherit"
                        onClick={handleLogoutClick}
                        sx={{ display: "flex", flexDirection: "column" }}
                    >
                        <ExitToAppIcon />
                        <Typography variant="caption" sx={{ mt: 0.5 }}>Logout</Typography>
                    </IconButton>
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

export default SupportNavbar;
