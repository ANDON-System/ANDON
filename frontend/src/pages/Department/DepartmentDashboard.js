import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, Avatar, Stack, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Select, MenuItem, Button, AppBar, Toolbar, IconButton,
    Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { blue, green, orange, red } from "@mui/material/colors";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManageTeamLeader from './ManageTeamLeader'; // Import the ManageTeamLeader component

const DepartmentDashboard = () => {
    const [data, setData] = useState({
        totalDepartments: 5,
        totalTeamLeaders: 3,
        openIssues: 0,
        resolvedIssues: 0,
        issues: []
    });

    const [users, setUsers] = useState([]);
    const [selectedAssignees, setSelectedAssignees] = useState({});
    const [openManageTeamLeader, setOpenManageTeamLeader] = useState(false);

    const navigate = useNavigate();

    const loggedInDepartment = sessionStorage.getItem("department");
    const loggedInUsername = sessionStorage.getItem("username");
    const token = localStorage.getItem("token");
    // Add this state at the top with your other state variables
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    // Fetch Issues
    useEffect(() => {
        const fetchIssues = async () => {
            if (!token) {
                console.error("🔒 No token found in localStorage.");
                return;
            }

            if (!loggedInDepartment) {
                console.error("🏢 No department found in sessionStorage.");
                return;
            }

            try {
                const url = `http://localhost:5000/api/issues?department=${encodeURIComponent(loggedInDepartment)}`;
                console.log("📡 Fetching issues from:", url);

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("✅ Raw response:", response);

                const issues = response.data || [];
                console.log("🧾 Issues received:", issues);

                const openIssuesCount = issues.filter(issue => issue.status === 'Open').length;
                const resolvedIssuesCount = issues.filter(issue => issue.status === 'Resolved').length;

                setData(prev => ({
                    ...prev,
                    issues,
                    openIssues: openIssuesCount,
                    resolvedIssues: resolvedIssuesCount
                }));
            } catch (error) {
                console.error("❌ Error fetching issues:", error?.response?.data || error.message);
            }
        };

        fetchIssues();
    }, [loggedInDepartment, token]);

    // Fetch Users (Team Leaders) from same department
    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) return console.error("No token found");
            try {
                const response = await axios.get(`http://localhost:5000/api/users?role=team_leader`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const filteredUsers = response.data.filter(user =>
                    user.department === loggedInDepartment && user.name !== loggedInUsername
                );
                setUsers(filteredUsers);

                // Update the total team leaders count
                setData(prev => ({
                    ...prev,
                    totalTeamLeaders: filteredUsers.length
                }));
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [loggedInDepartment, loggedInUsername, token]);

    // Assign Issue to Selected User
    const handleAssign = async (issueId) => {
        const assigneeId = selectedAssignees[issueId];
        if (!assigneeId) return alert("Please select a user before assigning.");
        const assigneeUser = users.find(user => user._id === assigneeId);
        if (!assigneeUser) return alert("Invalid selection!");
        try {
            await axios.put(`http://localhost:5000/api/issues/${issueId}/assign`, {
                assignee: assigneeUser.name // Send the selected user's name
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Issue assigned successfully.");
            // Refresh issue list
            const updatedIssues = data.issues.map(issue =>
                issue._id === issueId ? { ...issue, assignee: assigneeUser.name } : issue
            );
            setData(prev => ({ ...prev, issues: updatedIssues }));
            setSelectedAssignees(prev => ({ ...prev, [issueId]: '' }));
        } catch (error) {
            console.error("Error assigning issue:", error);
            alert("Failed to assign issue.");
        }
    };

    // Handle logout


    // Replace your existing handleLogout with these functions
    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        setOpenLogoutDialog(false);
        // Clear all session and local storage items
        localStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("department");
        sessionStorage.removeItem("role");

        // Navigate to login page
        navigate("/");
    };

    const handleLogoutCancel = () => {
        setOpenLogoutDialog(false);
    };




    // Toggle ManageTeamLeader dialog
    const toggleManageTeamLeader = () => {
        setOpenManageTeamLeader(!openManageTeamLeader);
    };

    const cards = [
        { title: "Total Departments", value: data.totalDepartments, icon: <GroupsIcon />, color: blue[500] },
        { title: "Total Team Leaders", value: data.totalTeamLeaders, icon: <AssignmentIcon />, color: green[500] },
        { title: "Open Issues", value: data.openIssues, icon: <BugReportIcon />, color: orange[500] },
        { title: "Resolved Issues", value: data.resolvedIssues, icon: <CheckCircleIcon />, color: red[500] }
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
            {/* AppBar */}
            <AppBar position="static" sx={{ mb: 2 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6">Department Dashboard</Typography>
                    <Box>
                        <IconButton
                            color="inherit"
                            onClick={toggleManageTeamLeader}
                            title="Manage Team Leaders"
                        >
                            <PeopleAltIcon />
                        </IconButton>
                        {/* Change your IconButton for logout to call the new function */}
                        <IconButton
                            color="inherit"
                            onClick={handleLogoutClick}
                            title="Logout"
                        >
                            <LogoutIcon />
                        </IconButton><Dialog open={openLogoutDialog} onClose={handleLogoutCancel}>
                            <DialogTitle>Confirm Logout</DialogTitle>
                            <DialogContent>
                                <DialogContentText>Are you sure you want to log out?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleLogoutCancel} color="primary">Cancel</Button>
                                <Button onClick={handleLogoutConfirm} color="error">Logout</Button>
                            </DialogActions>
                        </Dialog>

                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: "1400px", mx: "auto", width: "100%" }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    Dashboard Overview
                </Typography>

                <Grid container spacing={3}>
                    {cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper elevation={4} sx={{
                                p: 3, textAlign: "center", borderRadius: 4, bgcolor: "#fff",
                                height: "100%", display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <Stack spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: card.color, width: 56, height: 56 }}>{card.icon}</Avatar>
                                    <Typography variant="subtitle1" fontWeight="bold">{card.title}</Typography>
                                    <Typography variant="h4" color="text.primary">{card.value}</Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="h6" sx={{ mt: 4 }}>Recent Issues</Typography>
                <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Assignee</TableCell>
                                <TableCell>SLA</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.issues.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No issues found.</TableCell>
                                </TableRow>
                            ) : (
                                data.issues.map((issue) => (
                                    <TableRow key={issue._id}>
                                        <TableCell>#{issue._id?.substring(0, 8)}</TableCell>
                                        <TableCell>{issue.description}</TableCell>
                                        <TableCell>{issue.priority}</TableCell>
                                        <TableCell>{issue.status}</TableCell>
                                        <TableCell>{issue.name || 'Unassigned'}</TableCell>
                                        <TableCell>{issue.sla}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Select
                                                    value={selectedAssignees[issue._id] || ''}
                                                    onChange={(e) =>
                                                        setSelectedAssignees(prev => ({
                                                            ...prev,
                                                            [issue._id]: e.target.value
                                                        }))
                                                    }
                                                    displayEmpty
                                                    size="small"
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    <MenuItem value="">Select</MenuItem>
                                                    {users.map(user => (
                                                        <MenuItem key={user._id} value={user._id}>
                                                            {user.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleAssign(issue._id)}
                                                >
                                                    Assign
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* ManageTeamLeader Dialog */}
            <Dialog
                open={openManageTeamLeader}
                onClose={toggleManageTeamLeader}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Manage Team Leaders
                    <IconButton
                        aria-label="close"
                        onClick={toggleManageTeamLeader}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500]
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <ManageTeamLeader />
                </DialogContent>
            </Dialog>

        </Box>
    );
};

export default DepartmentDashboard;