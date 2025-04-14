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
  Select
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

const SupportDashboard = () => {
  // State
  const [open, setOpen] = useState(true);
  const [issues, setIssues] = useState([]); // State to hold issues
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

  // Fetch issues from the backend
  const fetchIssues = async () => {
    setLoading(true); // Set loading to true
    try {
      const [acknowledgedResponse, escalatedResponse, inProgressResponse, resolvedResponse, updatedResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/issues/acknowledged'), // Fetch acknowledged issues
        axios.get('http://localhost:5000/api/issues/updated'), // Fetch updated issues
        axios.get('http://localhost:5000/api/issues/escalated'), // Fetch escalated issues
        axios.get('http://localhost:5000/api/issues/in-progress'), // Fetch in-progress issues
        axios.get('http://localhost:5000/api/issues/completed') // Fetch completed issues
      ]);
      const allIssues = [
        ...acknowledgedResponse.data,
        ...escalatedResponse.data,
        ...inProgressResponse.data,
        ...resolvedResponse.data,
        ...updatedResponse.data // Include updated issues
      ];
      setIssues(allIssues);
      setFilteredIssues(allIssues); // Initialize filtered issues

      // Calculate counts
      setNewIssuesCount(acknowledgedResponse.data.length);
      setInProgressCount(inProgressResponse.data.length);
      setResolvedCount(resolvedResponse.data.length); // Count resolved issues
      setSlaAtRiskCount(allIssues.filter(issue => new Date(issue.sla) < new Date()).length); // Assuming SLA is a date
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    fetchIssues(); // Fetch issues when the component mounts
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter issues based on search term 
    const filtered = issues.filter(issue => issue.description.toLowerCase().includes(value.toLowerCase()));
    setFilteredIssues(filtered);
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
      case 'Acknowledged':
        return <Chip label="New" color="error" size="small" />;
      case 'In Progress':
        return <HourglassEmptyIcon color="primary" />;
      case 'Resolved':
        return <CheckCircleIcon color="success" />;
      case 'Escalated':
        return <ErrorIcon color="error" />;
      case 'Completed':
        return <CheckCircleIcon color="success" />;
      case 'Updated':
        return <Chip label="New" color="error" size="small" />;
      default:
        return <ErrorIcon color="error" />;
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
        await axios.put(`http://localhost:5000/api/issues/${selectedIssue._id}`, {
          status: 'Completed',
          resolution: resolutionDescription
        });
        setIssues(prevIssues => prevIssues.map(issue =>
          issue._id === selectedIssue._id ? { ...issue, status: 'Completed', resolution: resolutionDescription } : issue
        ));
        setFilteredIssues(prevIssues => prevIssues.map(issue =>
          issue._id === selectedIssue._id ? { ...issue, status: 'Completed', resolution: resolutionDescription } : issue
        ));
        alert(`Issue #${selectedIssue._id} has been resolved.`);
        setDialogOpen(false);
      } catch (error) {
        console.error("Error resolving issue:", error);
      }
    }
  };

  // Handle Mark as Read button click
  const handleMarkAsRead = async () => {
    if (selectedIssue) {
      try {
        await axios.put(`http://localhost:5000/api/issues/mark-as-read/${selectedIssue._id}`);
        setIssues(prevIssues => prevIssues.map(issue => issue._id === selectedIssue._id ? { ...issue, status: 'In Progress' } : issue));
        setFilteredIssues(prevIssues => prevIssues.map(issue => issue._id === selectedIssue._id ? { ...issue, status: 'In Progress' } : issue));
        alert(`Issue #${selectedIssue._id} has been marked as read.`);
        setDialogOpen(false);
      } catch (error) {
        console.error("Error marking issue as read:", error);
      }
    }
  };

  // Handle Escalate button click
  const handleEscalateIssue = async () => {
    if (selectedIssue && escalationRecipient && escalationReason) {
      try {
        await axios.put(`http://localhost:5000/api/issues/escalate/${selectedIssue._id}`, {
          status: 'Escalated',
          escalationRecipient: escalationRecipient,
          escalationReason: escalationReason
        });
        setIssues(prevIssues => prevIssues.map(issue =>
          issue._id === selectedIssue._id ? { ...issue, status: 'Escalated', escalationRecipient, escalationReason } : issue
        ));
        setFilteredIssues(prevIssues => prevIssues.map(issue =>
          issue._id === selectedIssue._id ? { ...issue, status: 'Escalated', escalationRecipient, escalationReason } : issue
        ));
        alert(`Issue #${selectedIssue._id} has been escalated.`);
        setEscalateDialogOpen(false);
      } catch (error) {
        console.error("Error escalating issue:", error);
      }
    }
  };

  // Handle View Details button click
  const handleViewDetails = async (issue) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/issues/${issue._id}`);
      const oldResponse = await axios.get(`http://localhost:5000/api/issues/old/${issue._id}`);
      const oldIssuesData = oldResponse.data.length > 0 ? oldResponse.data : [];
      setSelectedIssue({ ...response.data, oldIssues: oldIssuesData });
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching issue details:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SupportSidebar />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Support Team Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleNotificationMenu}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#ffebee' }}>
              <Typography variant="h6" component="div">New Issues</Typography>
              <Typography variant="h3" component="div">{newIssuesCount}</Typography>
              <Typography variant="body2" color="text.secondary">Requires acknowledgement</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fff8e1' }}>
              <Typography variant="h6" component="div">In Progress</Typography>
              <Typography variant="h3" component="div">{inProgressCount}</Typography>
              <Typography variant="body2" color="text.secondary">Currently being worked on</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#e8f5e9' }}>
              <Typography variant="h6" component="div">Resolved</Typography>
              <Typography variant="h3" component="div">{resolvedCount}</Typography>
              <Typography variant="body2" color="text.secondary">Waiting for confirmation</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#e3f2fd' }}>
              <Typography variant="h6" component="div">SLA at Risk</Typography>
              <Typography variant="h3" component="div">{slaAtRiskCount}</Typography>
              <Typography variant="body2" color="text.secondary">Approaching time limit</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
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

        <Typography variant="h6" sx={{ mb: 2 }}>Recent Issues</Typography>
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
                    No acknowledged, escalated, or in-progress issues found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredIssues.map((issue) => (
                  <TableRow
                    key={issue._id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      bgcolor: issue.status === 'Acknowledged' ? 'rgba(255, 255 , 0, 0.05)' : 'inherit'
                    }}
                  >
                    <TableCell>#{issue._id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1">{issue.description}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {issue.time}
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
                          {issue.status === 'Acknowledged' ? 'New' : issue.status}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{issue.assignee || 'Unassigned'}</TableCell>
                    <TableCell>{issue.sla}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {issue.status === 'Acknowledged' || issue.status === 'Updated' ? (
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
            <Grid
              container spacing={3}>
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
                        <TableCell>{selectedIssue.status}</TableCell>
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
                            <TableCell>{oldIssue.status}</TableCell>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={escalateDialogOpen}
          onClose={() => setEscalateDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Escalate Issue</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Escalation Recipient</InputLabel>
              <Select
                value={escalationRecipient}
                onChange={(e) => setEscalationRecipient(e.target.value)}
                label="Escalation Recipient"
              >
                <MenuItem value="Team Lead">Team Lead</MenuItem>
                <MenuItem value="Department Manager">Department Manager</MenuItem>
                <MenuItem Item value="Senior Management">Senior Management</MenuItem>
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