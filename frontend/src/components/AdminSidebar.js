import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import UserManagementContent from "../pages/Admin/UserRoleManagement";
import DepartmentManageContent from "../pages/Admin/DepartmentManagement";
import IssueCategoryContent from "../pages/Admin/IssueCategory";

const AdminNavbar = () => {
    const navigate = useNavigate();

    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openDeptDialog, setOpenDeptDialog] = useState(false);
    const [openIssueDialog, setOpenIssueDialog] = useState(false);

    const handleLogoutClick = () => setOpenLogoutDialog(true);
    const handleLogoutConfirm = () => {
        setOpenLogoutDialog(false);
        localStorage.removeItem("token");
        navigate("/");
    };
    const handleLogoutCancel = () => setOpenLogoutDialog(false);

    const handleUserDialogOpen = () => setOpenUserDialog(true);
    const handleUserDialogClose = () => setOpenUserDialog(false);

    const handleDeptDialogOpen = () => setOpenDeptDialog(true);
    const handleDeptDialogClose = () => setOpenDeptDialog(false);

    const handleIssueDialogOpen = () => setOpenIssueDialog(true);
    const handleIssueDialogClose = () => setOpenIssueDialog(false);

    const menuItems = [
        { text: "User & Role Management", icon: <AssignmentIcon fontSize="small" />, onClick: handleUserDialogOpen },
        { text: "Issue Categories", icon: <AssignmentIcon fontSize="small" />, onClick: handleIssueDialogOpen },
        { text: "Department", icon: <NotificationsIcon fontSize="small" />, onClick: handleDeptDialogOpen },
        { text: "Logout", icon: <ExitToAppIcon fontSize="small" />, onClick: handleLogoutClick }
    ];

    const centeredDialogStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    };

    return (
        <>
            <AppBar position="fixed" color="default" elevation={1}>
                <Toolbar>
                    {/* Dashboard Button on the left */}
                    <Button
                        startIcon={<DashboardIcon fontSize="small" />}
                        onClick={() => navigate("/admin-dashboard")}
                        color="primary"
                        variant="text"
                    >
                        Dashboard
                    </Button>

                    {/* Title */}
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                        
                    </Typography>

                    {/* Right-side buttons */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {menuItems.map((item, index) => (
                            <Button
                                key={index}
                                startIcon={item.icon}
                                onClick={item.onClick || (() => navigate(item.path))}
                                color={item.text === "Logout" ? "error" : "primary"}
                                variant="text"
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Logout Dialog */}
            <Dialog
                open={openLogoutDialog}
                onClose={handleLogoutCancel}
                PaperProps={{ sx: centeredDialogStyle }}
            >
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    Are you sure you want to log out?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutCancel} color="primary">Cancel</Button>
                    <Button onClick={handleLogoutConfirm} color="error">Logout</Button>
                </DialogActions>
            </Dialog>

            {/* User & Role Dialog */}
            <Dialog
                open={openUserDialog}
                onClose={handleUserDialogClose}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: centeredDialogStyle }}
            >
                <DialogContent>
                    <UserManagementContent />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUserDialogClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Department Dialog */}
            <Dialog
                open={openDeptDialog}
                onClose={handleDeptDialogClose}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: centeredDialogStyle }}
            >
                <DialogContent>
                    <DepartmentManageContent />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeptDialogClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Issue Category Dialog */}
            <Dialog
                open={openIssueDialog}
                onClose={handleIssueDialogClose}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: centeredDialogStyle }}
            >
                <DialogContent>
                    <IssueCategoryContent />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleIssueDialogClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminNavbar;
