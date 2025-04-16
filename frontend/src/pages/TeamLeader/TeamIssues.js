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
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Notifications as NotificationsIcon,
  AccessTime as ClockIcon,
  Close as CloseIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';

const Issues = () => {
  const [issues, setIssues] = useState([]); // For active issues
  const [workstationStatus, setWorkstationStatus] = useState('Green');
  const [notifications, setNotifications] = useState([]);

  // Notification Popover State
  const [anchorEl, setAnchorEl] = useState(null);
  const isNotificationOpen = Boolean(anchorEl);

  // Issue Modal States
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentIssueToAssign, setCurrentIssueToAssign] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');

  // Support Team Members
  const [supportTeam, setSupportTeam] = useState([]);

  // Issue Raising State
  const [issuePriority, setIssuePriority] = useState('Low');
  const [issueDepartments, setIssueDepartments] = useState([]);
  const [issueDescription, setIssueDescription] = useState('');

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

  // Fetch acknowledged issues and support team on component mount
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/issues");
        setIssues(response.data); // Fetch only acknowledged issues
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    const fetchSupportTeam = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users"); // Adjust the endpoint as necessary
        setSupportTeam(response.data);
      } catch (error) {
        console.error("Error fetching support team:", error);
      }
    };

    fetchIssues();
    fetchSupportTeam();
  }, []);

  // Function to update workstation status based on issue counts
  const updateWorkstationStatus = () => {
    const highCount = issues.filter(issue => issue.priority === 'High').length;
    const mediumCount = issues.filter(issue => issue.priority === 'Medium').length;

    if (highCount > 0) {
      setWorkstationStatus('Red'); // High priority issues present
    } else if (mediumCount > 0) {
      setWorkstationStatus('Yellow'); // Medium priority issues present
    } else {
      setWorkstationStatus('Green'); // No issues or only low priority issues
    }
  };

  // Update workstation status whenever issues change
  useEffect(() => {
    updateWorkstationStatus();
  }, [issues]);

  const createIssue = async (issueData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/issues", issueData);
      setIssues(prevIssues => [...prevIssues, response.data]); // Add the new issue to the state
    } catch (error) {
      console.error("Error creating issue:", error.response ? error.response.data : error.message);
    }
  };

  const handleAssignIssue = (issue) => {
    setCurrentIssueToAssign(issue);
    setSelectedTeamMember(issue.assignedTo || '');
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (selectedTeamMember) {
      try {
        const assignmentTime = new Date().toISOString();
        
        await axios.put(`http://localhost:5000/api/issues/${currentIssueToAssign._id}`, {
          assignedTo: selectedTeamMember,
          assignedAt: assignmentTime,
          status: 'In Progress'
        });
        
        // Update the issue in the issues state
        setIssues(prevIssues => prevIssues.map(issue => 
          issue._id === currentIssueToAssign._id 
            ? { 
                ...issue, 
                assignedTo: selectedTeamMember,
                assignedAt: assignmentTime,
                status: 'In Progress'
              } 
            : issue
        ));
        
        setIsAssignModalOpen(false);
        setSelectedTeamMember('');
        
        // Create notification for assignment
        const assignmentMessage = currentIssueToAssign.assignedTo 
          ? `Issue reassigned to ${selectedTeamMember}.`
          : `Issue assigned to ${selectedTeamMember}.`;
          
        setNotifications(prev => [...prev, { 
          id: Date.now(), 
          message: assignmentMessage, 
          timestamp: new Date().toLocaleString() 
        }]);
        
        alert(assignmentMessage);
      } catch (error) {
        console.error("Error assigning issue:", error);
      }
    }
  };

  const handleDepartmentToggle = (department) => {
    setIssueDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
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

  const handleMarkAsRead = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/issues/mark-as-read/${id}`);
      setIssues(prevIssues => prevIssues.map(issue => (issue._id === id ? { ...issue, status: 'In Progress' } : issue)));
      setNotifications(prev => [...prev, { id: Date.now(), message: `Issue ${response.data.title} marked as read.`, timestamp: new Date().toLocaleString() }]); // Add notification
      alert(`Issue ${response.data.title} marked as read.`); // Alert message
    } catch (error) {
      console.error("Error marking issue as read:", error);
    }
  };

  const handleEscalateIssue = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/issues/escalate/${id}`);
      setIssues(prevIssues => prevIssues.map(issue => (issue._id === id ? { ...issue, status: 'Escalated' } : issue)));
      setNotifications(prev => [...prev, { id: Date.now(), message: `Issue ${response.data.title} escalated.`, timestamp: new Date().toLocaleString() }]); // Add notification
      alert(`Issue ${response.data.title} escalated.`); // Alert message
    } catch (error) {
      console.error("Error escalating issue:", error);
    }
  };

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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not assigned';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Box sx={{ display: "flex" }}>
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

        {/* Assign Issue Modal */}
        <Dialog
          open={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {currentIssueToAssign?.assignedTo ? 'Reassign Issue' : 'Assign Issue'}
          </DialogTitle>
          <DialogContent>
            {currentIssueToAssign && (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <Typography variant="h6">
                  Issue Details
                </Typography>
                <Typography>
                  Priority: {currentIssueToAssign.priority}
                </Typography>
                <Typography>
                  Departments: {currentIssueToAssign.departments ? currentIssueToAssign.departments.join(', ') : 'No departments assigned'}
                </Typography>
                <Typography>
                  Description: {currentIssueToAssign.description}
                </Typography>
                
                {currentIssueToAssign.assignedTo && (
                  <Box sx={{ mt: 1, mb: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>Currently assigned to:</strong> {currentIssueToAssign.assignedTo}
                    </Typography>
                    {currentIssueToAssign.assignedAt && (
                      <Typography variant="body2">
                        <strong>Assigned at:</strong> {formatDate(currentIssueToAssign.assignedAt)}
                      </Typography>
                    )}
                  </Box>
                )}
                
                <FormControl fullWidth>
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    value={selectedTeamMember}
                    onChange={(e) => setSelectedTeamMember(e.target.value)}
                    label="Assign To"
                  >
                    {supportTeam.map(member => (
                      <MenuItem key={member._id} value={member.name}>
                        {member.name} ({member.availability}) - 
                        {issues.filter(issue => issue.assignedTo === member.name).length} assigned issues
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmAssign}
              variant="contained"
              color="primary"
              disabled={!selectedTeamMember}
            >
              {currentIssueToAssign?.assignedTo ? 'Reassign' : 'Assign'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dashboard Header with Notification Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Issues
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setIsIssueModalOpen(true)}
              sx={{ mr: 2 }}
            >
              Raise New Issue
            </Button>
            
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
            {issues.length === 0 ? (
              <Alert severity="info">No active issues</Alert>
            ) : (
              <Grid container spacing={2}>
                {issues.map(issue => (
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
                            {new Date(issue.createdAt).toLocaleString()}
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Departments:</strong> {issue.departments ? issue.departments.join(', ') : 'No departments assigned'}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {issue.description}
                        </Typography>
                        
                        {/* Assigned Team Member Information */}
                        {issue.assignedTo && (
                          <Box sx={{ mb: 2, p: 1, backgroundColor: '#f0f4f8', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                <strong>Assigned to:</strong> {issue.assignedTo}
                              </Typography>
                            </Box>
                            {issue.assignedAt && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ClockIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                  <strong>On:</strong> {formatDate(issue.assignedAt)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="info"
                            onClick={() => handleMarkAsRead(issue._id)}
                          >
                            Mark as Read
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleAssignIssue(issue)}
                          >
                            {issue.assignedTo ? 'Reassign' : 'Assign'}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleEscalateIssue(issue._id)}
                          >
                            Escalate
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
        
        {/* Support Team Assignment Summary */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Support Team Assignments
          </Typography>
          
          <Grid container spacing={2}>
            {supportTeam.map(member => {
              const assignedIssues = issues.filter(issue => issue.assignedTo === member.name);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={member._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">{member.name}</Typography>
                        <Chip 
                          label={member.availability}
                          color={member.availability === 'available' ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Assigned Issues:</strong> {assignedIssues.length}
                      </Typography>
                      
                      {assignedIssues.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" gutterBottom>
                            <strong>Recent Assignments:</strong>
                          </Typography>
                          <Stack spacing={1}>
                            {assignedIssues
                              .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
                              .slice(0, 3)
                              .map(issue => (
                                <Box key={issue._id} sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                  <Typography variant="caption" display="block">
                                    {issue.description.length > 30 
                                      ? `${issue.description.substring(0, 30)}...` 
                                      : issue.description}
                                  </Typography>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Chip 
                                      label={issue.priority} 
                                      size="small"
                                      color={
                                        issue.priority === 'High' ? 'error' :
                                        issue.priority === 'Medium' ? 'warning' : 'success'
                                      }
                                      sx={{ height: 20, fontSize: '0.7rem' }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      {issue.assignedAt ? formatDate(issue.assignedAt) : ''}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                          </Stack>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Issues;