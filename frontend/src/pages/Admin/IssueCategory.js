import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Box,
    Grid,
    Alert,
    Card,
    CardContent,
    CardActions,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminSidebar from '../../components/AdminSidebar';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


function IssueCategory() {
    const [openIssues, setOpenIssues] = useState([]);
    const [inProgressIssues, setInProgressIssues] = useState([]);
    const [acknowledgedIssues, setAcknowledgedIssues] = useState([]);
    const [escalatedIssues, setEscalatedIssues] = useState([]);
    const [resolvedIssues, setResolvedIssues] = useState([]);
    const [completedIssues, setCompletedIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchAllIssues = async () => {
            if (!token) {
                console.error("🔒 No token found in localStorage.");
                setError("Authentication token not found. Please log in again.");
                setLoading(false);
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            try {
                const [
                    openRes,
                    inProgressRes,
                    acknowledgedRes,
                    escalatedRes,
                    resolvedRes,
                    completedRes
                ] = await Promise.all([
                    axios.get('http://localhost:5000/api/issues', { headers }),
                    axios.get('http://localhost:5000/api/issues/in-progress', { headers }),
                    axios.get('http://localhost:5000/api/issues/acknowledged', { headers }),
                    axios.get('http://localhost:5000/api/issues/escalated', { headers }),
                    axios.get('http://localhost:5000/api/issues/resolved', { headers }),
                    axios.get('http://localhost:5000/api/issues/completed', { headers })
                ]);

                setOpenIssues(openRes.data || []);
                setInProgressIssues(inProgressRes.data || []);
                setAcknowledgedIssues(acknowledgedRes.data || []);
                setEscalatedIssues(escalatedRes.data || []);
                setResolvedIssues(resolvedRes.data || []);
                setCompletedIssues(completedRes.data || []);
                setLoading(false);

            } catch (error) {
                console.error("❌ Error fetching issues:", error?.response?.data || error.message);
                setError(`Error fetching issues: ${error?.response?.data?.error || error.message}`);
                setLoading(false);
            }
        };

        fetchAllIssues();
    }, [token]);

    const exportData = (issues, filename) => {
    const doc = new jsPDF();
    const title = filename.replace('.json', '').replace(/_/g, ' ').toUpperCase();

    doc.setFontSize(16);
    doc.text(title, 14, 20);

    if (issues.length === 0) {
        doc.setFontSize(12);
        doc.text("No issues available in this category.", 14, 30);
    } else {
        const tableColumn = [
            "ID",
            "Title",
            "Description",
            "Priority",
            "Assignee",
            "SLA",
            "Status",
            "Escalation Recipient",
            "Escalation Reason",
            "Created At"
        ];

        const tableRows = issues.map(issue => [
            issue._id?.substring(0, 8),
            issue.title,
            issue.description,
            issue.priority,
            issue.assignee || 'Unassigned',
            issue.sla,
            issue.status,
            issue.escalationRecipient || 'N/A',
            issue.escalationReason || 'N/A',
            new Date(issue.createdAt).toLocaleString()
        ]);

        autoTable(doc, {  // <-- note the usage here
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            styles: { fontSize: 8, cellWidth: 'wrap' },
            headStyles: { fillColor: [22, 160, 133] },
        });
    }

    doc.save(filename.replace('.json', '.pdf'));
};


    const renderIssueTable = (issues) => (
        <TableContainer sx={{ maxHeight: 500, overflow: 'auto' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Assignee</TableCell>
                        <TableCell>SLA</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Escalation Recipient</TableCell>
                        <TableCell>Escalation Reason</TableCell>
                        <TableCell>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {issues.map((issue) => (
                        <TableRow key={issue._id} hover>
                            <TableCell>#{issue._id?.substring(0, 8)}</TableCell>
                            <TableCell>{issue.title}</TableCell>
                            <TableCell>{issue.description}</TableCell>
                            <TableCell>{issue.priority}</TableCell>
                            <TableCell>{issue.assignee || 'Unassigned'}</TableCell>
                            <TableCell>{issue.sla}</TableCell>
                            <TableCell>{issue.status}</TableCell>
                            <TableCell>{issue.escalationRecipient || 'N/A'}</TableCell>
                            <TableCell>{issue.escalationReason || 'N/A'}</TableCell>
                            <TableCell>{new Date(issue.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const issueCategories = [
        { name: 'Open Issues', color: '#f44336', issues: openIssues, fileName: 'open_issues.json' },
        { name: 'In Progress Issues', color: '#ff9800', issues: inProgressIssues, fileName: 'in_progress_issues.json' },
        { name: 'Acknowledged Issues', color: '#2196f3', issues: acknowledgedIssues, fileName: 'acknowledged_issues.json' },
        { name: 'Escalated Issues', color: '#9c27b0', issues: escalatedIssues, fileName: 'escalated_issues.json' },
        { name: 'Resolved Issues', color: '#4caf50', issues: resolvedIssues, fileName: 'resolved_issues.json' },
        { name: 'Completed Issues', color: '#009688', issues: completedIssues, fileName: 'completed_issues.json' }
    ];

    const handleViewClick = (category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* <AdminSidebar /> */}
            <Box sx={{ width: '100%', p: 3 }}>
                <Paper sx={{ p: 3, width: '100%', minHeight: 'calc(100vh - 112px)' }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Issue Categories & Escalation Dashboard
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                            <Typography>Loading issues...</Typography>
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {issueCategories.map((category) => (
                                    <Grid item xs={12} sm={6} md={4} key={category.name}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                borderTop: `4px solid ${category.color}`,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {category.name}
                                                    </Typography>
                                                    <Chip
                                                        label={category.issues.length}
                                                        sx={{
                                                            backgroundColor: category.color,
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {category.issues.length > 0
                                                        ? `Last updated: ${new Date(category.issues[0]?.createdAt || Date.now()).toLocaleString()}`
                                                        : 'No issues in this category'}
                                                </Typography>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography variant="body2">
                                                    {category.issues.length > 0
                                                        ? `${category.issues.filter(i => i.priority === 'High').length} high priority issues`
                                                        : 'No issues to display'}
                                                </Typography>
                                            </CardContent>
                                            <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<VisibilityIcon />}
                                                    disabled={category.issues.length === 0}
                                                    onClick={() => handleViewClick(category.name)}
                                                >
                                                    
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    variant="contained"
                                                    startIcon={<DownloadIcon />}
                                                    disabled={category.issues.length === 0}
                                                    onClick={() => exportData(category.issues, category.fileName)}
                                                >
                                                    
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Dialog Popup for Viewing Issues */}
                            <Dialog
                                open={openDialog}
                                onClose={handleDialogClose}
                                fullWidth
                                maxWidth="xl"
                            >
                                <DialogTitle>{selectedCategory} Details</DialogTitle>
                                <DialogContent dividers>
                                    {renderIssueTable(
                                        issueCategories.find(cat => cat.name === selectedCategory)?.issues || []
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDialogClose} variant="outlined">
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}

export default IssueCategory;
