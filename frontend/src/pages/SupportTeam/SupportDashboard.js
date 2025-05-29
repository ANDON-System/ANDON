import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Badge,
    Paper,
    Grid,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Menu,
    MenuItem,
    Divider,
    FormControl,
    InputLabel,
    Select,
    Tabs,
    Tab
} from '@mui/material';

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SearchIcon from '@mui/icons-material/Search';
import SupportSidebar from "../../components/SupportSidebar";
import axios from 'axios'; // Import axios for making HTTP requests
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SupportDashboard = () => {
    // State
    const [open, setOpen] = useState(true);
    const [issues, setIssues] = useState([]); // State to hold all issues
    const [filteredIssues, setFilteredIssues] = useState([]); // State to hold filtered issues
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false); // State for details dialog
    const [escalateDialogOpen, setEscalateDialogOpen] = useState(false); // State for escalate dialog
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [loading, setLoading] = useState(false); // State for loading
    const [resolutionDescription, setResolutionDescription] = useState(''); // State for resolution input
    const [escalationRecipient, setEscalationRecipient] = useState(''); // State for escalation recipient
    const [escalationReason, setEscalationReason] = useState(''); // State for escalation reason

    // State for counts
    const [newIssuesCount, setNewIssuesCount] = useState(0);
    const [inProgressCount, setInProgressCount] = useState(0);
    const [resolvedCount, setResolvedCount] = useState(0);
    const [slaAtRiskCount, setSlaAtRiskCount] = useState(0);
    const [acknowledgedCount, setAcknowledgedCount] = useState(0);
    const [escalatedCount, setEscalatedCount] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Current active tab for filtering
    const [activeTab, setActiveTab] = useState('all');

    // Fetch issues from the backend
    const fetchIssues = async () => {
        setLoading(true); // Set loading to true

        const token = localStorage.getItem("token");
        const loggedInUsername = sessionStorage.getItem("name");

        if (!token) {
            console.error("🔒 No token found in localStorage.");
            setLoading(false);
            return;
        }

        try {
            const url = `http://localhost:5000/api/issues?assignee=${encodeURIComponent(loggedInUsername || '')}`;
            const openResponse = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Use Promise.all to fetch issues for all statuses for the logged-in user
            const [acknowledgedResponse, escalatedResponse, inProgressResponse, resolvedResponse, updatedResponse] = await Promise.all([
                // axios.get(`http://localhost:5000/api/issues?assignee=${encodeURIComponent(loggedInUsername)}`),
                axios.get(`http://localhost:5000/api/issues/acknowledged?assignee=${encodeURIComponent(loggedInUsername)}`), // Fetch acknowledged issues
                axios.get(`http://localhost:5000/api/issues/escalated?assignee=${encodeURIComponent(loggedInUsername)}`), // Fetch escalated issues
                axios.get(`http://localhost:5000/api/issues/in-progress?assignee=${encodeURIComponent(loggedInUsername)}`), // Fetch in-progress issues
                axios.get(`http://localhost:5000/api/issues/resolved?assignee=${encodeURIComponent(loggedInUsername)}`), // Fetch resolved issues
                axios.get(`http://localhost:5000/api/issues/updated?assignee=${encodeURIComponent(loggedInUsername)}`) // Fetch updated issues
            ]);

            // Combine all issues into a single array
            const allIssues = [
                ...openResponse.data,
                ...acknowledgedResponse.data,
                ...escalatedResponse.data,
                ...inProgressResponse.data,
                ...resolvedResponse.data,
                ...updatedResponse.data
            ];

            setIssues(allIssues);

            // Apply filtering based on active tab
            applyStatusFilter(allIssues, activeTab);

            // Calculate counts
            calculateIssueCounts(allIssues);

        } catch (error) {
            console.error("❌ Error fetching issues:", error?.response?.data || error.message);
        } finally {
            setLoading(false); // Set loading to false
        }
    };


    // Calculate issue counts by status
    const calculateIssueCounts = (issues) => {
        const openIssues = issues.filter(issue => issue.status === 'Open');
        const acknowledgedIssues = issues.filter(issue => issue.status === 'Acknowledged' || issue.status === 'Updated');
        const inProgressIssues = issues.filter(issue => issue.status === 'In Progress');
        const resolvedIssues = issues.filter(issue => issue.status === 'Resolved' || issue.status === 'Completed');
        const escalatedIssues = issues.filter(issue => issue.status === 'Escalated');

        setNewIssuesCount(openIssues.length);
        setAcknowledgedCount(acknowledgedIssues.length);
        setInProgressCount(inProgressIssues.length);
        setResolvedCount(resolvedIssues.length);
        setEscalatedCount(escalatedIssues.length);
        setSlaAtRiskCount(issues.filter(issue => new Date(issue.sla) < new Date()).length);
    };

    // Filter issues based on status
    const applyStatusFilter = (allIssues, status) => {
        let filtered = [...allIssues];

        // Apply search filter if there's a search term
        if (searchTerm) {
            filtered = filtered.filter(issue => issue.description.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Apply status filter
        switch (status) {
            case 'open':
                filtered = filtered.filter(issue => issue.status === 'Open');
                break;
            case 'acknowledged':
                filtered = filtered.filter(issue => issue.status === 'Acknowledged' || issue.status === 'Updated');
                break;
            case 'inProgress':
                filtered = filtered.filter(issue => issue.status === 'In Progress');
                break;
            case 'resolved':
                filtered = filtered.filter(issue => issue.status === 'Resolved' || issue.status === 'Completed');
                break;
            case 'escalated':
                filtered = filtered.filter(issue => issue.status === 'Escalated');
                break;
            case 'slaAtRisk':
                filtered = filtered.filter(issue => new Date(issue.sla) < new Date());
                break;
            default:
                // 'all' - no filtering needed
                break;
        }

        setFilteredIssues(filtered);
    };

    useEffect(() => {
        fetchIssues(); // Fetch issues when the component mounts
    }, []);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        applyStatusFilter(issues, newValue);
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        applyStatusFilter(issues, activeTab);
    };

    // Mock notifications data
    const notifications = [
        { id: 1, message: 'New high priority issue: Server outage in production', time: '10 min ago', read: false },
        { id: 2, message: 'Issue #3 approaching SLA deadline', time: '30 min ago', read: false },
        { id: 3, message: 'John assigned issue #4 to you', time: '1 hour ago', read: true },
        { id: 4, message: 'Issue #2 was updated by Jane', time: '2 hours ago', read: true },
    ];

    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.read).length;

    // Toggle drawer
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Handle notification menu
    const handleNotificationMenu = (event) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    // Get status icon based on status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open':
                return <Chip label="New" color="error" size="small" />;
            case 'Acknowledged':
            case 'Updated':
                return <Chip label="Acknowledged" color="warning" size="small" />;
            case 'In Progress':
                return <HourglassEmptyIcon color="primary" />;
            case 'Resolved':
            case 'Completed':
                return <CheckCircleIcon color="success" />;
            case 'Escalated':
                return <ErrorIcon color="error" />;
            default:
                return <ErrorIcon color="error" />;
        }
    };

    // Get displayed status text
    const getDisplayedStatus = (status) => {
        switch (status) {
            case 'Open':
                return 'New';
            case 'Acknowledged':
            case 'Updated':
                return 'Acknowledged';
            default:
                return status;
        }
    };

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'error';
            case 'Medium':
                return 'warning';
            case 'Low':
                return 'success';
            default:
                return 'default';
        }
    };

    // Handle Resolve button click
    const handleResolveIssue = async () => {
        if (selectedIssue && resolutionDescription) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("🔒 No token found in localStorage.");
                    return;
                }

                const response = await axios.put(`http://localhost:5000/api/issues/${selectedIssue._id}`, {
                    status: 'Resolved',
                    resolution: resolutionDescription // Ensure this field is included
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("Updated Issue:", response.data); // Log the updated issue
                await fetchIssues(); // Refresh the issues
                alert(`Issue #${selectedIssue._id} has been resolved.`);
                setDialogOpen(false);
                setResolutionDescription(''); // Reset resolution description
            } catch (error) {
                console.error("Error resolving issue:", error);
                alert("Failed to resolve issue.");
            }
        }
    };


    // Handle Mark as Read button click
    const handleMarkAsRead = async (issue) => {
        const issueToUpdate = issue || selectedIssue;
        if (issueToUpdate) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("🔒 No token found in localStorage.");
                    return;
                }

                await axios.put(`http://localhost:5000/api/issues/${issueToUpdate._id}`, {
                    status: 'In Progress'
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Update local state and refresh
                await fetchIssues();
                alert(`Issue #${issueToUpdate._id} has been marked as In Progress.`);
                setDialogOpen(false);
            } catch (error) {
                console.error("Error marking issue as read:", error);
                alert("Failed to update issue status.");
            }
        }
    };

    // Handle Escalate button click
    // Handle Escalate button click
    const handleEscalateIssue = async () => {
        if (selectedIssue && escalationRecipient && escalationReason) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("🔒 No token found in localStorage.");
                    return;
                }
                await axios.put(`http://localhost:5000/api/issues/${selectedIssue._id}`, {
                    status: 'Open',  // Change status to 'Open'
                    escalationRecipient: escalationRecipient,
                    escalationReason: escalationReason,
                    assignee: 'Unassigned', // Change assignee to "Unassigned"
                    name: 'Unassigned' // Change name to "Unassigned"
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                await fetchIssues(); // Refresh the issues
                alert(`Issue #${selectedIssue._id} has been escalated to Open status.`);
                setEscalateDialogOpen(false);
                setEscalationRecipient('');
                setEscalationReason('');
            } catch (error) {
                console.error("Error escalating issue:", error);
                alert("Failed to escalate issue.");
            }
        }
    };


    // Handle View Details button click
    const handleViewDetails = async (issue) => {
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

            const oldResponse = await axios.get(`http://localhost:5000/api/issues/old/${issue._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const oldIssuesData = oldResponse.data.length > 0 ? oldResponse.data : [];
            setSelectedIssue({ ...response.data, oldIssues: oldIssuesData });
            setDetailsDialogOpen(true);
        } catch (error) {
            console.error("Error fetching issue details:", error);
            alert("Failed to fetch issue details.");
        }
    };

    const exportSupportReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Support Issues Report`, 14, 22);

        // Prepare table data for all issues
        const columns = ['ID', 'Description', 'Priority', 'Status', 'Assignee', 'SLA'];
        const rows = issues.map((issue) => [
            `#${issue._id}`,
            issue.description || 'N/A',
            issue.priority || 'N/A',
            issue.status || 'N/A',
            issue.assignee || 'Unassigned',
            issue.sla || 'N/A',
        ]);

        autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 30,
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
            margin: { top: 30 }
        });

        doc.save(`Support_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        showSnackbar('Support report downloaded successfully!', 'success');
    };

     // Show snackbar messages
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleDownloadFromSidebar = () => {
        exportSupportReport();
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <SupportSidebar onDownloadClick={handleDownloadFromSidebar} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" component="div" sx={{ mb: 3 }}>
                    Support Team Dashboard
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={2}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: '#ffebee',
                                cursor: 'pointer',
                                border: activeTab === 'open' ? '2px solid #f44336' : 'none'
                            }}
                            onClick={() => handleTabChange(null, 'open')}
                        >
                            <Typography variant="h6" component="div">New</Typography>
                            <Typography variant="h3" component="div">{newIssuesCount}</Typography>
                            <Typography variant="body2" color="text.secondary">Not yet acknowledged</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: '#fff3e0',
                                cursor: 'pointer',
                                border: activeTab === 'acknowledged' ? '2px solid #ff9800' : 'none'
                            }}
                            onClick={() => handleTabChange(null, 'acknowledged')}
                        >
                            <Typography variant="h6" component="div">Acknowledged</Typography>
                            <Typography variant="h3" component="div">{acknowledgedCount}</Typography>
                            <Typography variant="body2" color="text.secondary">Seen but not started</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: '#fff8e1',
                                cursor: 'pointer',
                                border: activeTab === 'inProgress' ? '2px solid #ffc107' : 'none'
                            }}
                            onClick={() => handleTabChange(null, 'inProgress')}
                        >
                            <Typography variant="h6" component="div">In Progress</Typography>
                            <Typography variant="h3" component="div">{inProgressCount}</Typography>
                            <Typography variant="body2" color="text.secondary">Being worked on</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: '#e8f5e9',
                                cursor: 'pointer',
                                border: activeTab === 'resolved' ? '2px solid #4caf50' : 'none'
                            }}
                            onClick={() => handleTabChange(null, 'resolved')}
                        >
                            <Typography variant="h6" component="div">Resolved</Typography>
                            <Typography variant="h3" component="div">{resolvedCount}</Typography>
                            <Typography variant="body2" color="text.secondary">Completed issues</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: '#ffebee',
                                cursor: 'pointer',
                                border: activeTab === 'escalated' ? '2px solid #d32f2f' : 'none'
                            }}
                            onClick={() => handleTabChange(null, 'escalated')}
                        >
                            <Typography variant="h6" component="div">Escalated</Typography>
                            <Typography variant="h3" component="div">{escalatedCount}</Typography>
                            <Typography variant="body2" color="text.secondary">Sent to higher level</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: '#e3f2fd',
                                cursor: 'pointer',
                                border: activeTab === 'slaAtRisk' ? '2px solid #2196f3' : 'none'
                            }}
                            onClick={() => handleTabChange(null, 'slaAtRisk')}
                        >
                            <Typography variant="h6" component="div">SLA at Risk</Typography>
                            <Typography variant="h3" component="div">{slaAtRiskCount}</Typography>
                            <Typography variant="body2" color="text.secondary">Time limit issues</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                <Tab value="all" label="All Issues" />
                                <Tab value="open" label="New" />
                                <Tab value="acknowledged" label="Acknowledged" />
                                <Tab value="inProgress" label="In Progress" />
                                <Tab value="resolved" label="Resolved" />
                                <Tab value="escalated" label="Escalated" />
                                <Tab value="slaAtRisk" label="SLA at Risk" />
                            </Tabs>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search issues..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {loading ? (
                    <Typography variant="h6" align="center" sx={{ my: 4 }}>Loading issues...</Typography>
                ) : (
                    <>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {activeTab === 'all' ? 'All Issues' :
                                activeTab === 'open' ? 'New Issues' :
                                    activeTab === 'acknowledged' ? 'Acknowledged Issues' :
                                        activeTab === 'inProgress' ? 'In Progress Issues' :
                                            activeTab === 'resolved' ? 'Resolved Issues' :
                                                activeTab === 'escalated' ? 'Escalated Issues' :
                                                    'SLA at Risk Issues'}
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Issue</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Assignee</TableCell>
                                        <TableCell>SLA</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredIssues.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No issues found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredIssues.map((issue) => (
                                            <TableRow
                                                key={issue._id}
                                                hover
                                                sx={{
                                                    cursor: 'pointer',
                                                    bgcolor: (issue.status === 'Open')
                                                        ? 'rgba(255, 235, 238, 0.3)'
                                                        : (issue.status === 'Acknowledged' || issue.status === 'Updated')
                                                            ? 'rgba(255, 243, 224, 0.3)'
                                                            : 'inherit'
                                                }}
                                            >
                                                <TableCell>#{issue._id}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Typography variant="body1">{issue.description}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(issue.createdAt).toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip size="small" label={issue.priority} color={getPriorityColor(issue.priority)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {getStatusIcon(issue.status)}
                                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                                            {getDisplayedStatus(issue.status)}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{issue.assignee || 'Unassigned'}</TableCell>
                                                <TableCell>{issue.sla}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        {(issue.status === 'Open' || issue.status === 'Acknowledged' || issue.status === 'Updated') ? (
                                                            <>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewDetails(issue);
                                                                    }}
                                                                >
                                                                    View Details
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="success"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedIssue(issue);
                                                                        setDialogOpen(true);
                                                                    }}
                                                                >
                                                                    Resolve
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedIssue(issue);
                                                                        setEscalateDialogOpen(true);
                                                                    }}
                                                                    startIcon={<ArrowUpwardIcon />}
                                                                >
                                                                    Escalate
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleMarkAsRead(issue);
                                                                    }}
                                                                >
                                                                    Mark as Read
                                                                </Button>
                                                            </>
                                                        ) : issue.status === 'In Progress' ? (
                                                            <>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewDetails(issue);
                                                                    }}
                                                                >
                                                                    View Details
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="success"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedIssue(issue);
                                                                        setDialogOpen(true);
                                                                    }}
                                                                >
                                                                    Resolve
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedIssue(issue);
                                                                        setEscalateDialogOpen(true);
                                                                    }}
                                                                    startIcon={<ArrowUpwardIcon />}
                                                                >
                                                                    Escalate
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewDetails(issue);
                                                                }}
                                                            >
                                                                View Details
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}

                {/* Resolution Dialog */}
                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Issue #{selectedIssue?._id}: {selectedIssue?.description}</Typography>
                            <Chip
                                size="small"
                                label={selectedIssue?.priority}
                                color={getPriorityColor(selectedIssue?.priority)}
                            />
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>Description</Typography>
                                <Typography variant="body1" paragraph>
                                    {selectedIssue?.description}
                                </Typography>
                                <TextField
                                    label="Resolution Description"
                                    multiline
                                    rows={4}
                                    value={resolutionDescription}
                                    onChange={(e) => setResolutionDescription(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Document your resolution here..."
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleResolveIssue}
                            variant="contained"
                            color="primary"
                            disabled={!resolutionDescription}
                        >
                            Save Resolution
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Details Dialog */}
                <Dialog
                    open={detailsDialogOpen}
                    onClose={() => setDetailsDialogOpen(false)}
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle>Issue Details</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                            <Typography variant="h6">Current Issue Details</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Issue ID</strong></TableCell>
                                            <TableCell><strong>Description</strong></TableCell>
                                            <TableCell><strong>Priority</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                            <TableCell><strong>Departments</strong></TableCell>
                                            <TableCell><strong>Created At</strong></TableCell>
                                            <TableCell><strong>Updated At</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedIssue ? (
                                            <TableRow>
                                                <TableCell>#{selectedIssue._id}</TableCell>
                                                <TableCell>{selectedIssue.description}</TableCell>
                                                <TableCell>{selectedIssue.priority}</TableCell>
                                                <TableCell>{getDisplayedStatus(selectedIssue.status)}</TableCell>
                                                <TableCell>{selectedIssue.departments ? selectedIssue.departments.join(', ') : 'No departments assigned'}</TableCell>
                                                <TableCell>{new Date(selectedIssue.createdAt).toLocaleString()}</TableCell>
                                                <TableCell>{new Date(selectedIssue.updatedAt).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7}>Loading issue details...</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                            <Typography variant="h6">Old Issue Details</Typography>
                            {selectedIssue && selectedIssue.oldIssues && selectedIssue.oldIssues.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">No old details available.</Typography>
                            ) : (
                                selectedIssue && selectedIssue.oldIssues && (
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Old Description</strong></TableCell>
                                                    <TableCell><strong>Old Priority</strong></TableCell>
                                                    <TableCell><strong>Old Status</strong></TableCell>
                                                    <TableCell><strong>Old Departments</strong></TableCell>
                                                    <TableCell><strong>Old Created At</strong></TableCell>
                                                    <TableCell><strong>Old Updated At</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedIssue.oldIssues.map((oldIssue, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{oldIssue.description}</TableCell>
                                                        <TableCell>{oldIssue.priority}</TableCell>
                                                        <TableCell>{getDisplayedStatus(oldIssue.status)}</TableCell>
                                                        <TableCell>{oldIssue.departments ? oldIssue.departments.join(', ') : 'No departments assigned'}</TableCell>
                                                        <TableCell>{new Date(oldIssue.createdAt).toLocaleString()}</TableCell>
                                                        <TableCell>{new Date(oldIssue.updatedAt).toLocaleString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )
                            )}
                        </Box>

                        {/* Show resolution if available */}
                        {selectedIssue && selectedIssue.resolution && (
                            <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                                <Typography variant="h6">Resolution</Typography>
                                <Typography variant="body1" paragraph>
                                    {selectedIssue.resolution}
                                </Typography>
                            </Box>
                        )}

                        {/* Show escalation details if available */}
                        {selectedIssue && selectedIssue.escalationReason && (
                            <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                                <Typography variant="h6">Escalation Details</Typography>
                                <Typography variant="body2"><strong>Escalated To:</strong> {selectedIssue.escalationRecipient}</Typography>
                                <Typography variant="body2"><strong>Reason:</strong> {selectedIssue.escalationReason}</Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Escalate Dialog */}
                <Dialog
                    open={escalateDialogOpen}
                    onClose={() => setEscalateDialogOpen(false)}
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle>Escalate Issue</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                            <InputLabel>Escalation Recipient</InputLabel>
                            <Select
                                value={escalationRecipient}
                                onChange={(e) => setEscalationRecipient(e.target.value)}
                                label="Escalation Recipient"
                            >
                                <MenuItem value="Team Lead">Team Lead</MenuItem>
                                <MenuItem value="Department Manager">Department Manager</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Escalation Reason"
                            multiline
                            rows={4}
                            value={escalationReason}
                            onChange={(e) => setEscalationReason(e.target.value)}
                            fullWidth
                            variant="outlined"
                            placeholder="Provide details for escalation..."
                            sx={{ mb: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEscalateDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleEscalateIssue}
                            variant="contained"
                            color="error"
                            disabled={!escalationRecipient || !escalationReason}
                        >
                            Confirm Escalation
                        </Button>
                    </DialogActions>
                </Dialog>

                <Menu
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={handleNotificationClose}
                    PaperProps={{
                        elevation: 3,
                        sx: { width: 320, maxHeight: 500 }
                    }}
                >
                    <MenuItem sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">Notifications</Typography>
                        <Button size="small">Mark all as read</Button>
                    </MenuItem>
                    <Divider />
                    {notifications.map((notification) => (
                        <MenuItem
                            key={notification.id}
                            sx={{
                                py: 1.5,
                                bgcolor: notification.read ? 'inherit' : 'rgba(25, 118, 210, 0.08)'
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body2">{notification.message}</Typography>
                                <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
                            </Box>
                        </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem sx={{ justifyContent: 'center' }}>
                        <Button size="small">View All Notifications</Button>
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};

export default SupportDashboard;