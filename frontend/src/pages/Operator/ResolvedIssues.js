import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Stack, Alert, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton, Popover } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Warning as WarningIcon, Error as ErrorIcon, Notifications as NotificationsIcon, AccessTime as ClockIcon, Close as CloseIcon } from '@mui/icons-material';
import OperatorSidebar from '../../components/OperatorSidebar';
import axios from 'axios';

const ResolvedIssues = () => {
  const [resolvedIssues, setResolvedIssues] = useState([]); // For resolved issues
  const [workstationStatus, setWorkstationStatus] = useState('Green');
  const [notifications, setNotifications] = useState([]);

  // Notification Popover State
  const [anchorEl, setAnchorEl] = useState(null);
  const isNotificationOpen = Boolean(anchorEl);

  // Issue Modal States
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [currentIssueToResolve, setCurrentIssueToResolve] = useState(null);

  // Issue Raising State
  const [issuePriority, setIssuePriority] = useState('Low');
  const [issueDepartments, setIssueDepartments] = useState([]);
  const [issueDescription, setIssueDescription] = useState('');
  const [resolutionDescription, setResolutionDescription] = useState('');

  // Priority Colors
  const PRIORITY_COLORS = {
    Low: { main: '#4caf50', light: '#e8f5e9' },
    Medium: { main: '#ff9800', light: '#fff3e0' },
    High: { main: '#f44336', light: '#ffebee' }
  };

  const DEPARTMENTS = [
    'Production Team',
    'Quality Team',
    'Manufacturing Team',
    'Logistics Team',
    'Safety Team',
    'Maintenance Team'
  ];

  // Fetch issues on component mount
  useEffect(() => {
    const fetchResolvedIssues = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/issues/resolved");
        setResolvedIssues(response.data); // Fetch only resolved issues
      } catch (error) {
        console.error("Error fetching resolved issues:", error);
      }
    };

    fetchResolvedIssues();
  }, []);

  // Function to update workstation status based on resolved issue counts
  const updateWorkstationStatus = () => {
    const highCount = resolvedIssues.filter(issue => issue.priority === 'High').length;
    const mediumCount = resolvedIssues.filter(issue => issue.priority === 'Medium').length;

    if (highCount > 0) {
      setWorkstationStatus('Red'); // High priority issues present
    } else if (mediumCount > 0) {
      setWorkstationStatus('Yellow'); // Medium priority issues present
    } else {
      setWorkstationStatus('Green'); // No issues or only low priority issues
    }
  };

  // Update workstation status whenever resolvedIssues change
  useEffect(() => {
    updateWorkstationStatus();
  }, [resolvedIssues]);

  const createIssue = async (issueData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/issues", issueData);
      setResolvedIssues(prevResolved => [...prevResolved, response.data]); // Add the new issue to the state
    } catch (error) {
      console.error("Error creating issue:", error.response ? error.response.data : error.message);
    }
  };

  const updateIssue = async (id, newData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/issues/${id}`, newData);
      setResolvedIssues(prevResolved => prevResolved.map(issue => (issue._id === id ? response.data : issue))); // Use _id for comparison
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const acknowledgeIssue = async (id) => {
    try {
      const response = await axios.put(` http://localhost:5000/api/issues/acknowledge/${id}`);
      setResolvedIssues(prevResolved => [...prevResolved, response.data]); // Store acknowledged issue
      setNotifications(prev => [...prev, { id: Date.now(), message: `Issue ${response.data.title} acknowledged.`, timestamp: new Date().toLocaleString() }]); // Add notification
      alert(`Issue ${response.data.title} acknowledged.`); // Alert message
    } catch (error) {
      console.error("Error acknowledging issue:", error);
    }
  };

  const handleResolveIssue = async () => {
    if (currentIssueToResolve && resolutionDescription) {
      await updateIssue(currentIssueToResolve._id, { status: 'Resolved', resolution: resolutionDescription }); // Use _id for MongoDB
      setResolvedIssues(prevResolved => [...prevResolved, { ...currentIssueToResolve, resolution: resolutionDescription }]);
      setCurrentIssueToResolve(null);
      setResolutionDescription('');
      setIsResolveModalOpen(false);
      alert(`Issue ${currentIssueToResolve.title} resolved.`); // Alert message
      setNotifications(prev => [...prev, { id: Date.now(), message: `Issue ${currentIssueToResolve.title} resolved.`, timestamp: new Date().toLocaleString() }]); // Add notification
    }
  };

  // Notification Popover Handlers
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    handleNotificationClose();
  };

  // Issue Handling Functions
  const handleRaiseIssue = () => {
    if (issueDepartments.length > 0 && issueDescription) {
      createIssue({
        priority: issuePriority,
        departments: issueDepartments,
        description: issueDescription
      });

      // Reset modal state
      setIssuePriority('Low');
      setIssueDepartments([]);
      setIssueDescription('');
      setIsIssueModalOpen(false);
      alert('New issue raised successfully.'); // Alert message
      setNotifications(prev => [...prev, { id: Date.now(), message: 'New issue raised successfully.', timestamp: new Date().toLocaleString() }]); // Add notification
    }
  };

  const handleDepartmentToggle = (department) => {
    setIssueDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <OperatorSidebar />
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8' }}>
        {/* Issue Raising Modal */}
        <Dialog
          open={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Raise New Issue</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Priority Selection */}
              <Box>
                <Typography>Issue Priority</Typography>
                <Stack direction="row" spacing={2}>
                  {Object.keys(PRIORITY_COLORS).map(priority => (
                    <Chip
                      key={priority}
                      label={priority}
                      clickable
                      color={priority === issuePriority ? 'primary' : 'default'}
                      onClick={() => setIssuePriority(priority)}
                      sx={{
                        backgroundColor: PRIORITY_COLORS[priority].light,
                        color: PRIORITY_COLORS[priority].main
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Department Selection */}
              <Box>
                <Typography>Departments to Notify</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {DEPARTMENTS.map(department => (
                    <Chip
                      key={department}
                      label={department}
                      clickable
                      color={issueDepartments.includes(department) ? 'primary' : 'default'}
                      onClick={() => handleDepartmentToggle(department)}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Issue Description */}
              <TextField
                label="Issue Description"
                multiline
                rows={4}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleRaiseIssue}
              variant="contained"
              color="primary"
              disabled={issueDepartments.length === 0 || !issueDescription}
            >
              Raise Issue
            </Button>
          </DialogActions>
        </Dialog>

        {/* Resolve Issue Modal */}
        <Dialog
          open={isResolveModalOpen}
          onClose={() => setIsResolveModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Resolve Issue</DialogTitle>
          <DialogContent>
            {currentIssueToResolve && (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <Typography variant="h6">
                  Issue Details
                </Typography>
                <Typography>
                  Priority: {currentIssueToResolve.priority}
                </Typography>
                <Typography>
                  Departments: {currentIssueToResolve.departments ? currentIssueToResolve.departments.join(', ') : 'No departments assigned'}
                </Typography>
                <Typography>
                  Description: {currentIssueToResolve.description}
                </Typography>

                <TextField
                  label="Resolution Description"
                  multiline
                  rows={4}
                  value={resolutionDescription}
                  onChange={(e) => setResolutionDescription(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsResolveModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleResolveIssue}
              variant="contained"
              color="primary"
              disabled={!resolutionDescription}
            >
              Resolve Issue
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dashboard Header with Notification Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Resolved Issues
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              icon={
                workstationStatus === 'Green' ? <CheckCircleIcon color="success" /> :
                  workstationStatus === 'Yellow' ? <WarningIcon color="warning" /> :
                    <ErrorIcon color="error" />
              }
              label={`${workstationStatus} Status`}
              color={
                workstationStatus === 'Green' ? 'success' :
                  workstationStatus === 'Yellow' ? 'warning' : 'error'
              }
              variant="outlined"
              sx={{ mr: 2 }}
            />

            <IconButton
              color="primary"
              onClick={handleNotificationClick}
              sx={{ position: 'relative' }}
            >
              <NotificationsIcon />
              {notifications.length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10
                  }}
                >
                  {notifications.length}
                </Box>
              )}
            </IconButton>

            {/* Notification Popover */}
            <Popover
              open={isNotificationOpen}
              anchorEl={anchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{
                width: 300,
                maxHeight: 400,
                overflow: 'auto',
                p: 2
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="h6">Notifications</Typography>
                  <IconButton
                    size="small"
                    onClick={handleClearNotifications}
                    disabled={notifications.length === 0}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {notifications.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No new notifications
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {notifications.map(notification => (
                      <Box
                        key={notification.id}
                        sx={{
                          backgroundColor: '#f0f0f0',
                          p: 1,
                          borderRadius: 1
                        }}
                      >
                        <Typography variant="body2">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <ClockIcon sx={{
                            fontSize: 'small',
                            mr: 1,
                            verticalAlign: 'middle'
                          }} />
                          {notification.timestamp}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Popover>
          </Box>
        </Box>

        {/* Issues Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {resolvedIssues.length === 0 ? (
              <Alert severity="info">No resolved issues</Alert>
            ) : (
              <Grid container spacing={2}>
                {resolvedIssues.map(issue => (
                  <Grid item xs={12} sm={6} md={4} key={issue._id}>
                    <Card
                      sx={{
                        backgroundColor: PRIORITY_COLORS[issue.priority].light,
                        border: `1px solid ${PRIORITY_COLORS[issue.priority].main}`,
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label={issue.priority}
                            size="small"
                            sx={{
                              backgroundColor: PRIORITY_COLORS[ issue.priority].main,
                              color: 'white'
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Resolved at: {new Date(issue.updatedAt).toLocaleString()}
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Departments:</strong> {issue.departments ? issue.departments.join(', ') : 'No departments assigned'}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Original Description:</strong> {issue.description}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2 }}>
                          <strong>Resolution:</strong> {issue.resolution}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ResolvedIssues;