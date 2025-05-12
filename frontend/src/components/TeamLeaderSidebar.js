// TeamLeaderSidebar.js

import { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Chip, Divider } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WarningIcon from "@mui/icons-material/Warning";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const TeamLeaderSidebar = ({ selectedView, handleViewSelect, issues, supportTeam }) => {
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

    return (
        <>
            <Drawer variant="temporary" open={true} onClose={() => {}}>
                <List>
                    <ListItem button selected={selectedView === 'dashboard'} onClick={() => handleViewSelect('dashboard')}>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button selected={selectedView === 'issues'} onClick={() => handleViewSelect('issues')}>
                        <ListItemIcon><WarningIcon /></ListItemIcon>
                        <ListItemText primary="Issues" />
                        <Chip 
                            label={issues.filter(i => i.status !== 'resolved').length} 
                            size="small" 
                            color="error" 
                        />
                    </ListItem>
                    <ListItem button selected={selectedView === 'team'} onClick={() => handleViewSelect('team')}>
                        <ListItemIcon><GroupIcon /></ListItemIcon>
                        <ListItemText primary="Support Team" />
                        <Chip 
                            label={supportTeam.length} 
                            size="small" 
                            color="primary" 
                        />
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                    <ListItem button onClick={handleLogoutClick}>
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
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

export default TeamLeaderSidebar;
