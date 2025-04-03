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
  TextField,
  DialogActions,
  IconButton,
  Popover
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Warning as WarningIcon, Error as ErrorIcon, Notifications as NotificationsIcon, AccessTime as ClockIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import SupportSidebar from '../../components/SupportSidebar';

const MyAssignments = () => {
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [escalatedIssues, setEscalatedIssues] = useState([]);
  const [inProgressIssues, setInProgressIssues] = useState([]);
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
    const fetchIssues = async () => {
      try {
        const [resolvedResponse, escalatedResponse, inProgressResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/issues/completed"),
          axios.get("http://localhost:5000/api/issues/escalated"),
          axios.get("http://localhost:5000/api/issues/in-progress")
        ]);
        setResolvedIssues(resolvedResponse.data);
        setEscalatedIssues(escalatedResponse.data);
        setInProgressIssues(inProgressResponse.data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, []);

  // Function to update workstation status based on resolved issue counts
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

  return (
    <Box sx={{ display: "flex" }}>
      <SupportSidebar />
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8' }}>
        {/* Dashboard Header with Notification Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Resolved Issues
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              icon={
                workstationStatus === ' Green' ? <CheckCircleIcon color="success" /> :
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

        {/* Resolved Issues Section */}
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
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Escalated Issues Section */}
        <Typography variant="h4" gutter bottom>
          Escalated Issues
        </Typography>
        {escalatedIssues.length === 0 ? (
          <Alert severity="info">No escalated issues</Alert>
        ) : (
          <Grid container spacing={2}>
            {escalatedIssues.map(issue => (
              <Grid item xs={12} sm={6} md={4} key={issue._id}>
                <Card
                  sx={{
                    backgroundColor: PRIORITY_COLORS[issue.priority].light,
                    border: `1px solid ${PRIORITY_COLORS[issue.priority].main}`,
                    height: '100%'
                  }}
                >
                  <CardContent>
                    <Typography variant="body2">
                      <strong>Title:</strong> {issue.title}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Description:</strong> {issue.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Priority:</strong> {issue.priority}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {issue.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Departments:</strong> {issue.departments ? issue.departments.join(', ') : 'No departments assigned'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Escalation Reason:</strong> {issue.escalationReason}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Escalation Recipient:</strong> {issue.escalationRecipient}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created At:</strong> {new Date(issue.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* In-Progress Issues Section */}
        <Typography variant="h4" gutterBottom>
          In-Progress Issues
        </Typography>
        {inProgressIssues.length === 0 ? (
          <Alert severity="info">No in-progress issues</Alert>
        ) : (
          <Grid container spacing={2}>
            {inProgressIssues.map(issue => (
              <Grid item xs={12} sm={6} md={4} key={issue._id}>
                <Card
                  sx={{
                    backgroundColor: PRIORITY_COLORS[issue.priority].light,
                    border: `1px solid ${PRIORITY_COLORS[issue.priority].main}`,
                    height: '100%'
                  }}
                >
                  <CardContent>
                    <Typography variant="body2">
                      <strong>Title:</strong> {issue.title}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Description:</strong> {issue.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Priority:</strong> {issue.priority}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {issue.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Departments:</strong> {issue.departments ? issue.departments.join(', ') : 'No departments assigned'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created At:</strong> {new Date(issue.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default MyAssignments;