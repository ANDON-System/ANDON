import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, Avatar, Stack, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Select, MenuItem, Button
} from '@mui/material';
import DepartmentSidebar from "../../components/DepartmentSidebar";
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { blue, green, orange, red } from "@mui/material/colors";
import axios from 'axios';

const TeamLeaderDashboard = () => {
    const [data, setData] = useState({
        totalDepartments: 5,
        totalTeamLeaders: 3,
        openIssues: 0,
        resolvedIssues: 0,
        issues: []
    });

    const [users, setUsers] = useState([]);
    const [selectedAssignees, setSelectedAssignees] = useState({});

    const loggedInDepartment = sessionStorage.getItem("department");
    const loggedInUsername = sessionStorage.getItem("name");
    const token = localStorage.getItem("token");

    // Fetch Issues
    // Fetch Issues (Refactored like users list)
    // TeamLeaderDashboard.js
    useEffect(() => {
        const fetchIssues = async () => {
            if (!token) {
                console.error("🔒 No token found in localStorage.");
                return;
            }

            try {
                const url = `http://localhost:5000/api/issues?name=${encodeURIComponent(loggedInUsername)}`; // Fetch issues based on the logged-in user's name
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const issues = response.data || [];
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
    }, [loggedInUsername, token]);

    // The rest of the TeamLeaderDashboard component remains unchanged
    // Fetch Users (Employees) from same department
    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) return console.error("No token found");
            try {
                const response = await axios.get(`http://localhost:5000/api/users?role=employee`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const filteredUsers = response.data.filter(user =>
                    user.department === loggedInDepartment && user.name !== loggedInUsername
                );
                setUsers(filteredUsers);
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


    const cards = [
        { title: "Total Departments", value: data.totalDepartments, icon: <GroupsIcon />, color: blue[500] },
        { title: "Total Team Leaders", value: data.totalTeamLeaders, icon: <AssignmentIcon />, color: green[500] },
        { title: "Open Issues", value: data.openIssues, icon: <BugReportIcon />, color: orange[500] },
        { title: "Resolved Issues", value: data.resolvedIssues, icon: <CheckCircleIcon />, color: red[500] }
    ];

    return (
        <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
            <DepartmentSidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    Dashboard Overview
                </Typography>

                <Grid container spacing={3}>
                    {cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper elevation={4} sx={{
                                p: 3, textAlign: "center", borderRadius: 4, bgcolor: "#fff",
                                transition: "transform 0.3s", "&:hover": { transform: "scale(1.05)" }
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
                <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                                        <TableCell>#{issue._id}</TableCell>
                                        <TableCell>{issue.description}</TableCell>
                                        <TableCell>{issue.priority}</TableCell>
                                        <TableCell>{issue.status}</TableCell>
                                        <TableCell>{issue.name || 'Unassigned'}</TableCell>
                                        <TableCell>{issue.sla}</TableCell>
                                        <TableCell>
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
                                                sx={{ mr: 1, minWidth: 120 }}
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
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default TeamLeaderDashboard;
