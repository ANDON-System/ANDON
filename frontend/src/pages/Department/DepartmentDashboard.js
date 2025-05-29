import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, Avatar, Stack, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Select, MenuItem, Button, AppBar, Toolbar, IconButton,
    Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions,
    Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DownloadIcon from '@mui/icons-material/Download';
import { blue, green, orange, red } from "@mui/material/colors";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
    const [assignedIssues, setAssignedIssues] = useState([]);
    const [unassignedIssues, setUnassignedIssues] = useState([]); // New state for unassigned issues
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [selectedAssignedIssue, setSelectedAssignedIssue] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);


    const navigate = useNavigate();
    const loggedInDepartment = sessionStorage.getItem("department");
    const loggedInUsername = sessionStorage.getItem("username");
    const token = localStorage.getItem("token");
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    // Priority color mapping
    const priorityColors = {
        "Low": "#e8f5e9",    // Light green
        "Medium": "#fff3e0",  // Light yellow
        "High": "#ffebee"     // Light red
    };

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
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const issues = response.data || [];
                const openIssuesCount = issues.filter(issue => issue.status === 'Open').length;
                const resolvedIssuesCount = issues.filter(issue => issue.status === 'Resolved').length;

                // Separate issues into assigned and unassigned
                const assigned = issues.filter(issue => issue.name !== "Unassigned");
                const unassigned = issues.filter(issue => issue.name === "Unassigned");

                setData(prev => ({
                    ...prev,
                    issues,
                    openIssues: openIssuesCount,
                    resolvedIssues: resolvedIssuesCount
                }));

                setAssignedIssues(assigned); // Set assigned issues
                setUnassignedIssues(unassigned); // Set unassigned issues
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
                name: assigneeUser.name // Send the selected user's name
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            showSnackbar("Issue assigned successfully.", 'success');

            // Move the issue from unassigned issues to assigned issues
            const updatedUnassignedIssues = unassignedIssues.filter(issue => issue._id !== issueId);
            const assignedIssue = unassignedIssues.find(issue => issue._id === issueId);

            setUnassignedIssues(updatedUnassignedIssues);
            setAssignedIssues(prev => [...prev, { ...assignedIssue, assignee: assigneeUser.name }]);
            setSelectedAssignees(prev => ({ ...prev, [issueId]: '' }));
        } catch (error) {
            console.error("Error assigning issue:", error);
            showSnackbar("Failed to assign issue.", 'error');
        }
    };

    // Export Issues to PDF
    const exportIssuesData = () => {
        const allIssues = [...assignedIssues, ...unassignedIssues];

        if (allIssues.length === 0) {
            showSnackbar('No issue data available to export.', 'info');
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Issues Report - ${loggedInDepartment} Department`, 14, 22);

        // Add summary information
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);
        doc.text(`Total Issues: ${allIssues.length}`, 14, 45);
        doc.text(`Open Issues: ${data.openIssues}`, 14, 55);
        doc.text(`Resolved Issues: ${data.resolvedIssues}`, 14, 65);

        // Prepare table data
        const columns = ['ID', 'Description', 'Priority', 'Status', 'Assignee', 'SLA'];
        const rows = allIssues.map((issue) => [
            `#${issue._id?.substring(0, 8) || 'N/A'}`,
            issue.description || 'N/A',
            issue.priority || 'N/A',
            issue.status || 'N/A',
            issue.name || issue.assignee || 'Unassigned',
            issue.sla || 'N/A',
        ]);

        autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 75,
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [25, 118, 210],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            margin: { top: 75 }
        });

        // Add separate sections for assigned and unassigned issues
        if (unassignedIssues.length > 0) {
            const finalY = doc.lastAutoTable.finalY || 75;
            doc.setFontSize(14);
            doc.text('Unassigned Issues', 14, finalY + 20);

            const unassignedRows = unassignedIssues.map((issue) => [
                `#${issue._id?.substring(0, 8) || 'N/A'}`,
                issue.description || 'N/A',
                issue.priority || 'N/A',
                issue.status || 'N/A',
                'Unassigned',
                issue.sla || 'N/A',
            ]);

            autoTable(doc, {
                head: [columns],
                body: unassignedRows,
                startY: finalY + 30,
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [255, 152, 0],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [255, 243, 224]
                }
            });
        }

        doc.save(`${loggedInDepartment}_Issues_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        showSnackbar('Issues report downloaded successfully!', 'success');
    };

    // Show snackbar messages
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // Handle logout
    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        setOpenLogoutDialog(false);
        localStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("department");
        sessionStorage.removeItem("role");
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

    const handleViewAssignedIssueDetails = async (issue) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("🔒 No token found in localStorage.");
                return;
            }

            const response = await axios.get(`http://localhost:5000/api/issues/${issue._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSelectedAssignedIssue(response.data);
            setDetailsDialogOpen(true);
        } catch (error) {
            console.error("Error fetching issue details:", error);
            alert("Failed to fetch issue details.");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
            {/* AppBar */}
            <AppBar position="static" sx={{ mb: 2 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6">Department Dashboard</Typography>
                    <Box>
                        <IconButton
                            color="inherit"
                            onClick={() => setExportDialogOpen(true)}
                            title="Download Issues Report"
                        >
                            <DownloadIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            onClick={toggleManageTeamLeader}
                            title="Manage Team Leaders"
                        >
                            <PeopleAltIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            onClick={handleLogoutClick}
                            title="Logout"
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: "1400px", mx: "auto", width: "100%" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffebee', textAlign: 'center' }}>
                            <Typography variant="h6">Total Departments</Typography>
                            <Typography variant="h4">{data.totalDepartments}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 2, bgcolor: '#e8f5e9', textAlign: 'center' }}>
                            <Typography variant="h6">Total Team Leaders</Typography>
                            <Typography variant="h4">{data.totalTeamLeaders}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 2, bgcolor: '#fff3e0', textAlign: 'center' }}>
                            <Typography variant="h6">Open Issues</Typography>
                            <Typography variant="h4">{data.openIssues}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffe0b2', textAlign: 'center' }}>
                            <Typography variant="h6">Resolved Issues</Typography>
                            <Typography variant="h4">{data.resolvedIssues}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 8 }}>Recent Issues</Typography>
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
                            {unassignedIssues.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No unassigned issues found.</TableCell>
                                </TableRow>
                            ) : (
                                unassignedIssues.map((issue) => (
                                    <TableRow
                                        key={issue._id}
                                        sx={{ bgcolor: priorityColors[issue.priority] || "inherit" }}
                                    >
                                        <TableCell>#{issue._id?.substring(0, 8)}</TableCell>
                                        <TableCell>{issue.description}</TableCell>
                                        <TableCell>{issue.priority}</TableCell>
                                        <TableCell>{issue.status === 'Open' ? 'New' : issue.status}</TableCell> {/* Change here */}
                                        <TableCell>{issue.assignee || 'Unassigned'}</TableCell>
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

                <Typography variant="h6" sx={{ mt: 4 }}>Assigned Issues</Typography>
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assignedIssues.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No assigned issues found.</TableCell>
                                </TableRow>
                            ) : (
                                assignedIssues.map((issue) => (
                                    <TableRow
                                        key={issue._id}
                                        sx={{ bgcolor: priorityColors[issue.priority] || "inherit" }}
                                    >
                                        <TableCell>#{issue._id?.substring(0, 8)}</TableCell>
                                        <TableCell>{issue.description}</TableCell>
                                        <TableCell>{issue.priority}</TableCell>
                                        <TableCell>{issue.status}</TableCell>
                                        <TableCell>{issue.name || 'Unassigned'}</TableCell>
                                        <TableCell>{issue.sla}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleViewAssignedIssueDetails(issue)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Export Confirmation Dialog */}
            <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
                <DialogTitle>Export Issues Report</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Would you like to download the issues report as a PDF? This will include all assigned and unassigned issues for the {loggedInDepartment} department.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            exportIssuesData();
                            setExportDialogOpen(false);
                        }}
                        startIcon={<DownloadIcon />}
                    >
                        Download PDF
                    </Button>
                </DialogActions>
            </Dialog>

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
            <Dialog
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Issue Details</DialogTitle>
                <DialogContent>
                    {selectedAssignedIssue ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><strong>Issue ID</strong></TableCell>
                                        <TableCell><strong>Description</strong></TableCell>
                                        <TableCell><strong>Priority</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                        <TableCell><strong>Assignee</strong></TableCell>
                                        <TableCell><strong>SLA</strong></TableCell>
                                        <TableCell><strong>Created At</strong></TableCell>
                                        <TableCell><strong>Updated At</strong></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>#{selectedAssignedIssue._id}</TableCell>
                                        <TableCell>{selectedAssignedIssue.description}</TableCell>
                                        <TableCell>{selectedAssignedIssue.priority}</TableCell>
                                        <TableCell>{selectedAssignedIssue.status}</TableCell>
                                        <TableCell>{selectedAssignedIssue.name || 'Unassigned'}</TableCell>
                                        <TableCell>{selectedAssignedIssue.sla}</TableCell>
                                        <TableCell>{new Date(selectedAssignedIssue.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(selectedAssignedIssue.updatedAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography>Loading issue details...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default DepartmentDashboard;