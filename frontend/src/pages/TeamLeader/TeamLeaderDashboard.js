import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, Avatar, Stack, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Select, MenuItem, Button, Snackbar, Alert, Dialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import { blue, green, orange, red } from "@mui/material/colors";
import axios from 'axios';
import TeamLeaderSidebar from '../../components/TeamLeaderSidebar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    const [assignedIssues, setAssignedIssues] = useState([]);
    const [unassignedIssues, setUnassignedIssues] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [exportDialogOpen, setExportDialogOpen] = useState(false);

    const loggedInDepartment = sessionStorage.getItem("department");
    const loggedInUsername = sessionStorage.getItem("name");
    const token = localStorage.getItem("token");

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

            try {
                const url = `http://localhost:5000/api/issues?name=${encodeURIComponent(loggedInUsername)}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const issues = response.data || [];
                const openIssuesCount = issues.filter(issue => issue.status === 'Open').length;
                const resolvedIssuesCount = issues.filter(issue => issue.status === 'Resolved').length;

                // Separate issues into assigned and unassigned
                const assigned = issues.filter(issue => issue.assignee && issue.assignee !== "Unassigned");
                const unassigned = issues.filter(issue => !issue.assignee || issue.assignee === "Unassigned");

                setData(prev => ({
                    ...prev,
                    issues,
                    openIssues: openIssuesCount,
                    resolvedIssues: resolvedIssuesCount
                }));

                setAssignedIssues(assigned);
                setUnassignedIssues(unassigned);
            } catch (error) {
                console.error("❌ Error fetching issues:", error?.response?.data || error.message);
            }
        };
        fetchIssues();
    }, [loggedInUsername, token]);

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

    // Show snackbar messages
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // Export Issues to PDF
    const exportTeamLeaderReport = () => {
        const allIssues = [...assignedIssues, ...unassignedIssues];
        
        if (allIssues.length === 0) {
            showSnackbar('No issue data available to export.', 'info');
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Team Leader Report - ${loggedInUsername}`, 14, 22);
        
        // Add summary information
        doc.setFontSize(12);
        doc.text(`Department: ${loggedInDepartment}`, 14, 35);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);
        doc.text(`Total Issues: ${allIssues.length}`, 14, 55);
        doc.text(`Open Issues: ${data.openIssues}`, 14, 65);
        doc.text(`Resolved Issues: ${data.resolvedIssues}`, 14, 75);
        doc.text(`Assigned Issues: ${assignedIssues.length}`, 14, 85);
        doc.text(`Unassigned Issues: ${unassignedIssues.length}`, 14, 95);

        // Prepare table data for all issues
        const columns = ['ID', 'Description', 'Priority', 'Status', 'Assignee', 'SLA'];
        const rows = allIssues.map((issue) => [
            `#${issue._id?.substring(0, 8) || 'N/A'}`,
            issue.description || 'N/A',
            issue.priority || 'N/A',
            issue.status || 'N/A',
            issue.assignee || 'Unassigned',
            issue.sla || 'N/A',
        ]);

        autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 105,
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
            margin: { top: 105 }
        });

        // Add separate section for assigned issues if they exist
        if (assignedIssues.length > 0) {
            const finalY = doc.lastAutoTable.finalY || 105;
            doc.setFontSize(14);
            doc.text('Assigned Issues', 14, finalY + 20);
            
            const assignedRows = assignedIssues.map((issue) => [
                `#${issue._id?.substring(0, 8) || 'N/A'}`,
                issue.description || 'N/A',
                issue.priority || 'N/A',
                issue.status || 'N/A',
                issue.assignee || 'N/A',
                issue.sla || 'N/A',
            ]);

            autoTable(doc, {
                head: [columns],
                body: assignedRows,
                startY: finalY + 30,
                styles: { 
                    fontSize: 9,
                    cellPadding: 3,
                },
                headStyles: { 
                    fillColor: [76, 175, 80],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [232, 245, 233]
                }
            });
        }

        // Add separate section for unassigned issues if they exist
        if (unassignedIssues.length > 0) {
            const finalY = doc.lastAutoTable.finalY || 105;
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

        doc.save(`TeamLeader_${loggedInUsername}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        showSnackbar('Team Leader report downloaded successfully!', 'success');
    };

    // Handle download from sidebar
    const handleDownloadFromSidebar = () => {
        setExportDialogOpen(true);
    };

    // Assign Issue to Selected User
    const handleAssign = async (issueId) => {
        const assigneeId = selectedAssignees[issueId];
        if (!assigneeId) {
            showSnackbar("Please select a user before assigning.", 'warning');
            return;
        }
        
        const assigneeUser = users.find(user => user._id === assigneeId);
        if (!assigneeUser) {
            showSnackbar("Invalid selection!", 'error');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/issues/${issueId}/assign`, {
                assignee: assigneeUser.name
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

            // Update the main data issues array as well
            const updatedIssues = data.issues.map(issue =>
                issue._id === issueId ? { ...issue, assignee: assigneeUser.name } : issue
            );
            setData(prev => ({ ...prev, issues: updatedIssues }));

        } catch (error) {
            console.error("Error assigning issue:", error);
            showSnackbar("Failed to assign issue.", 'error');
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
            <TeamLeaderSidebar onDownloadClick={handleDownloadFromSidebar} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    
                </Typography>

                <Grid container spacing={3}>
                    {cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper elevation={4} sx={{
                                p: 3, textAlign: "center", borderRadius: 4, bgcolor: "#fff",
                                height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
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

                {/* Recent Issues (Unassigned) Section */}
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
                                        <TableCell>{issue.status}</TableCell>
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

                {/* Assigned Issues Section */}
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
                                        <TableCell>{issue.assignee || 'Unassigned'}</TableCell>
                                        <TableCell>{issue.sla}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Export Confirmation Dialog */}
                <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
                    <DialogTitle>Export Team Leader Report</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Would you like to download the team leader report as a PDF? This will include all assigned and unassigned issues managed by {loggedInUsername} in the {loggedInDepartment} department.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                exportTeamLeaderReport();
                                setExportDialogOpen(false);
                            }}
                            startIcon={<DownloadIcon />}
                        >
                            Download PDF
                        </Button>
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
        </Box>
    );
};

export default TeamLeaderDashboard;