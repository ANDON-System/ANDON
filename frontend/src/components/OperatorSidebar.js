import { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";

const DepartmentSidebar = () => {
    const navigate = useNavigate();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        setOpenLogoutDialog(false);
        // Perform logout actions (e.g., clearing tokens, redirecting)
        localStorage.removeItem("token"); // Example: Clear authentication token
        navigate("/"); // Redirect to login page
    };

    const handleLogoutCancel = () => {
        setOpenLogoutDialog(false);
    };

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/department-dashboard" },
        { text: "Manage Team Leaders", icon: <AssignmentIcon />, path: "/manage-team" },
        { text: "Task Assignment & Tracking", icon: <AssignmentIcon />, path: "/task-track" },
        { text: "Issue Management", icon: <AssignmentIcon />, path: "/issues-dept" },
        { text: "Reports & Analytics", icon: <DashboardIcon />, path: "/reports-dept" },
        { text: "Notifications", icon: <NotificationsIcon />, path: "/notifications-dept" },
        { text: "Settings", icon: <SettingsIcon />, path: "/settings-dept" },
        { text: "Logout", icon: <ExitToAppIcon />, onClick: handleLogoutClick }
    ];

    return (
        <>
            <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem button key={index} onClick={item.onClick || (() => navigate(item.path))}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

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

export default DepartmentSidebar;
