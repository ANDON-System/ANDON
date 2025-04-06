import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Popover,
  TextField,
  Paper,
  Divider
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Warning as WarningIcon, Error as ErrorIcon, Notifications as NotificationsIcon, AccessTime as ClockIcon, Close as CloseIcon } from '@mui/icons-material';
import OperatorSidebar from '../../components/OperatorSidebar';
import axios from 'axios';

const ResolvedIssues = () => {
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [workstationStatus, setWorkstationStatus] = useState('Green');
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isNotificationOpen = Boolean(anchorEl);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentIssueToRaise, setCurrentIssueToRaise] = useState(null);
  const [issuePriority, setIssuePriority] = useState('Low');
  const [issueDepartments, setIssueDepartments] = useState([]);
  const [issueDescription, setIssueDescription] = useState('');
  const [issueDetails, setIssueDetails] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    const fetchResolvedIssues = async () => {
      try {
        const response1 = await axios.get("http://localhost:5000/api/issues/resolved");
        const response2 = await axios.get("http://localhost:5000/api/issues/completed");
        setResolvedIssues([...response1.data, ...response2.data]);
      } catch (error) {
        console.error("Error fetching resolved issues:", error);
      }
    };

    fetchResolvedIssues();
  }, []);

  const updateWorkstationStatus = () => {
    const highCount = resolvedIssues.filter(issue => issue.priority === 'High').length;
    const mediumCount = resolvedIssues.filter(issue => issue.priority === 'Medium').length;

    if (highCount > 0) {
      setWorkstationStatus('Red');
    } else if (mediumCount > 0) {
      setWorkstationStatus('Yellow');
    } else {
      setWorkstationStatus('Green');
    }
  };

  useEffect(() => {
    updateWorkstationStatus();
  }, [resolvedIssues]);

  const createIssue = async () => {
    if (issueDepartments.length > 0 && issueDescription) {
      try {
        // Fetch machine_id and sla from the backend or set default values
        const machineId = "426"; // Replace with actual logic to fetch machine_id
        const sla = 24; // Replace with actual logic to fetch SLA
  
        const response = await axios.post("http://localhost:5000/api/issues", {
          title: `Reopened: ${currentIssueToRaise.title}`,
          description: issueDescription,
          priority: issuePriority,
          departments: issueDepartments,
          machine_id: machineId, // Include machine_id
          sla: sla // Include SLA
        });
  
        setResolvedIssues(prev => [...prev, response.data]);
        setIsIssueModalOpen(false);
        setIssueDescription('');
        setIssueDepartments([]);
        alert('New issue raised successfully.');
      } catch (error) {
        const errorMessage = error.response ? error.response.data.details || error.message : error.message;
        console.error("Error creating issue:", errorMessage);
        setError("Failed to raise issue: " + errorMessage);
      }
    } else {
      setError("Please fill in all required fields.");
    }
  };

  const fetchIssueDetails = async (issueId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/issues/${issueId}`);
      setIssueDetails(response.data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching issue details:", error.response ? error.response.data : error.message);
    }
  };

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

  const handleDepartmentToggle = (department) => {
    setIssueDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const handleViewIssue = (issue) => {
    setCurrentIssueToRaise(issue);
    setIsIssueModalOpen(true);
  };

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue);
    setDetailsDialogOpen(true);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <OperatorSidebar />
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8' }}>
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
                              backgroundColor: PRIORITY_COLORS[issue.priority].main,
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

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleViewIssue(issue)}
                          >
                            Raise Issue
                          </Button>
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
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Issue Details</DialogTitle>
          <DialogContent>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6">Issue ID: #{selectedIssue?._id}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph>
                <strong>Original Description:</strong> {selectedIssue?.description}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Updated Description:</strong> {issueDescription}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Priority :</strong> {selectedIssue?.priority}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong> {selectedIssue?.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Assignee:</strong> {selectedIssue?.assignee || 'Unassigned'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Created At:</strong> {new Date(selectedIssue?.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Updated At:</strong> {new Date(selectedIssue?.updatedAt).toLocaleString()}
              </Typography>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle> Raise New Issue</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
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

              <TextField
                label="Issue Description"
                multiline
                rows={4}
                value={ issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                fullWidth
                variant="outlined"
              />
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
            <Button
              onClick={createIssue}
              variant="contained"
              color="primary"
              disabled={issueDepartments.length === 0 || !issueDescription}
            >
              Raise Issue
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ResolvedIssues;