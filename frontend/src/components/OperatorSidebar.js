import { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";

const OperatorSidebar = () => {
    const navigate = useNavigate();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        setOpenLogoutDialog(false);
        localStorage.removeItem("token"); // Clear authentication token
        navigate("/"); // Redirect to login page
    };

    const handleLogoutCancel = () => {
        setOpenLogoutDialog(false);
    };

    const menuItems = [
        { text: "Dashboard Overview", icon: <DashboardIcon />, path: "/operator-dashboard" },
        { text: "Active Issues", icon: <AssignmentIcon />, path: "/active-issues" },
        { text: "Resolved Issues", icon: <AssignmentIcon />, path: "/resolved-issues" },
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

export default OperatorSidebar;