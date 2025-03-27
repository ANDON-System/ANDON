import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Button, 
  Chip, 
  Stack,
  Alert,
  Popover,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Warning as WarningIcon, 
  Error as ErrorIcon, 
  Notifications as NotificationsIcon,
  AccessTime as ClockIcon,
  Close as CloseIcon,
  History as HistoryIcon
} from '@mui/icons-material';

// Backend Service Simulation
const BackendService = {
  issues: [],
  resolvedIssues: [],
  listeners: [],

  raiseIssue(issueDetails) {
    const newIssue = {
      ...issueDetails,
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      status: 'Unacknowledged'
    };
    this.issues.push(newIssue);
    this.notifyListeners();
    return newIssue;
  },

  acknowledgeIssue(issueId) {
    const issue = this.issues.find(i => i.id === issueId);
    if (issue) {
      issue.status = 'Acknowledged';
      this.notifyListeners();
    }
  },

  resolveIssue(issueId, resolution) {
    const index = this.issues.findIndex(i => i.id === issueId);
    if (index !== -1) {
      const resolvedIssue = this.issues[index];
      resolvedIssue.status = 'Resolved';
      resolvedIssue.resolution = resolution;
      resolvedIssue.resolvedTimestamp = new Date().toLocaleString();
      
      // Move to resolved issues
      this.resolvedIssues.push(resolvedIssue);
      
      // Remove from active issues
      this.issues.splice(index, 1);
      
      this.notifyListeners();
    }
  },

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },

  notifyListeners() {
    this.listeners.forEach(listener => listener({
      activeIssues: this.issues,
      resolvedIssues: this.resolvedIssues
    }));
  }
};

const OperatorDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
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

  // Tab State
  const [tabValue, setTabValue] = useState(0);

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

  // Real-time issue tracking
  useEffect(() => {
    const unsubscribe = BackendService.subscribe(({ activeIssues, resolvedIssues }) => {
      setIssues(activeIssues);
      setResolvedIssues(resolvedIssues);

      // Determine workstation status based on active issues
      const highPriorityIssues = activeIssues.filter(issue => issue.priority === 'High');
      const mediumPriorityIssues = activeIssues.filter(issue => issue.priority === 'Medium');

      if (highPriorityIssues.length > 0) {
        setWorkstationStatus('Red');
      } else if (mediumPriorityIssues.length > 0) {
        setWorkstationStatus('Yellow');
      } else {
        setWorkstationStatus('Green');
      }

      // Add notifications for new issues
      const newNotifications = activeIssues
        .filter(issue => issue.status === 'Unacknowledged')
        .map(issue => ({
          id: issue.id,
          message: `New ${issue.priority} priority issue raised for ${issue.departments.join(', ')}`,
          timestamp: new Date().toLocaleString()
        }));

      setNotifications(prev => [...prev, ...newNotifications]);
    });

    return () => unsubscribe();
  }, []);

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
      BackendService.raiseIssue({
        priority: issuePriority,
        departments: issueDepartments,
        description: issueDescription
      });
      
      // Reset modal state
      setIssuePriority('Low');
      setIssueDepartments([]);
      setIssueDescription('');
      setIsIssueModalOpen(false);
    }
  };

  const handleResolveIssue = () => {
    if (currentIssueToResolve && resolutionDescription) {
      BackendService.resolveIssue(
        currentIssueToResolve.id, 
        resolutionDescription
      );
      
      // Reset resolve modal state
      setCurrentIssueToResolve(null);
      setResolutionDescription('');
      setIsResolveModalOpen(false);
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
                Departments: {currentIssueToResolve.departments.join(', ')}
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
          Operator Control Center
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

      {/* Tabs for Active and Resolved Issues */}
      <Tabs 
        value={tabValue} 
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Active Issues" />
        <Tab label="Resolved Issues" icon={<HistoryIcon />} />
      </Tabs>

      {/* Issues Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {tabValue === 0 ? (
            <Card>
              <CardHeader 
                title="Active Issues" 
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => setIsIssueModalOpen(true)}
                      sx={{ mr: 2 }}
                    >
                      Raise Issue
                    </Button>
                    <Chip 
                      label={`Total: ${issues.length}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                } 
              />
              <CardContent>
                {issues.length === 0 ? (
                  <Alert severity="info">No active issues</Alert>
                ) : (
                  <Grid container spacing={2}>
                    {issues.map(issue => (
                      <Grid item xs={12} sm={6} md={4} key={issue.id}>
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
                                {issue.timestamp}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Departments:</strong> {issue.departments.join(', ')}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {issue.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              {issue.status === 'Unacknowledged' && (
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="primary"
                                  sx={{ mr: 1 }}
                                  onClick={() => BackendService.acknowledgeIssue(issue.id)}
                                >
                                  Acknowledge
                                </Button>
                              )}
                              <Button 
                                size="small" 
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  setCurrentIssueToResolve(issue);
                                  setIsResolveModalOpen(true);
                                }}
                              >
                                Resolve
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader 
                title="Resolved Issues" 
                action={
                  <Chip 
                    label={`Total: ${resolvedIssues.length}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                } 
              />
              <CardContent>
                {resolvedIssues.length === 0 ? (
                  <Alert severity="info">No resolved issues</Alert>
                ) : (
                  <Grid container spacing={2}>
                    {resolvedIssues.map(issue => (
                      <Grid item xs={12} sm={6} md={4} key={issue.id}>
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
                                Resolved at: {issue.resolvedTimestamp}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Departments:</strong> {issue.departments.join(', ')}
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
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default OperatorDashboard;




