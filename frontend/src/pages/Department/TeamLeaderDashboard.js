import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  CssBaseline, 
  Divider, 
  Card, 
  CardContent, 
  CardHeader, 
  Grid, 
  Chip, 
  Button, 
  Badge, 
  IconButton, 
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ComputerIcon from '@mui/icons-material/Computer';
import WarningIcon from '@mui/icons-material/Warning';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const drawerWidth = 240;

const TeamLeader = () => {
  // Sample data
  const [workstations, setWorkstations] = useState([
    { id: 1, name: 'WS-001', status: 'online', issues: 2 },
    { id: 2, name: 'WS-002', status: 'offline', issues: 0 },
    { id: 3, name: 'WS-003', status: 'online', issues: 1 },
    { id: 4, name: 'WS-004', status: 'online', issues: 0 },
    { id: 5, name: 'WS-005', status: 'online', issues: 3 },
  ]);

  const [issues, setIssues] = useState([
    { 
      id: 1, 
      workstation: 'WS-001', 
      description: 'System crash during startup', 
      status: 'pending', 
      priority: 'high', 
      escalated: false,
      assignedTo: null,
      timestamp: '2025-03-29T09:15:00'
    },
    { 
      id: 2, 
      workstation: 'WS-001', 
      description: 'Network connectivity issues', 
      status: 'in-progress', 
      priority: 'medium', 
      escalated: false,
      assignedTo: 'John Doe',
      timestamp: '2025-03-29T10:22:00'
    },
    { 
      id: 3, 
      workstation: 'WS-003', 
      description: 'Software update failed', 
      status: 'pending', 
      priority: 'low', 
      escalated: false,
      assignedTo: null,
      timestamp: '2025-03-29T11:05:00'
    },
    { 
      id: 4, 
      workstation: 'WS-005', 
      description: 'Hardware malfunction', 
      status: 'escalated', 
      priority: 'high', 
      escalated: true,
      assignedTo: 'Support Team',
      timestamp: '2025-03-29T08:45:00'
    },
    { 
      id: 5, 
      workstation: 'WS-005', 
      description: 'Database connection timeout', 
      status: 'resolved', 
      priority: 'high', 
      escalated: false,
      assignedTo: 'Jane Smith',
      timestamp: '2025-03-29T07:30:00'
    },
    { 
      id: 6, 
      workstation: 'WS-005', 
      description: 'Security alert: Unauthorized access attempt', 
      status: 'in-progress', 
      priority: 'high', 
      escalated: true,
      assignedTo: 'Security Team',
      timestamp: '2025-03-29T12:10:00'
    },
  ]);

  const supportTeam = [
    { id: 1, name: 'John Doe', role: 'IT Support', availability: 'available' },
    { id: 2, name: 'Jane Smith', role: 'Network Specialist', availability: 'busy' },
    { id: 3, name: 'Robert Johnson', role: 'Hardware Tech', availability: 'available' },
    { id: 4, name: 'Emily Davis', role: 'Software Support', availability: 'offline' },
  ];

  // UI state
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleAssignIssue = (issue) => {
    setSelectedIssue(issue);
    setIsAssignDialogOpen(true);
  };

  const handleConfirmAssign = () => {
    if (selectedTeamMember) {
      const updatedIssues = issues.map(issue => 
        issue.id === selectedIssue.id 
          ? {...issue, assignedTo: selectedTeamMember, status: 'in-progress'} 
          : issue
      );
      setIssues(updatedIssues);
      setIsAssignDialogOpen(false);
      setSelectedTeamMember('');
    }
  };

  const handleEscalateIssue = (issueId) => {
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? {...issue, escalated: true, status: 'escalated'} 
        : issue
    );
    setIssues(updatedIssues);
  };

  const handleOpenMessageDialog = () => {
    setIsMessageDialogOpen(true);
  };

  const handleSendMessage = () => {
    console.log(`Message sent: ${messageText}`);
    setMessageText('');
    setIsMessageDialogOpen(false);
  };

  const priorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const statusIcon = (status) => {
    switch(status) {
      case 'pending': return <WarningIcon color="warning" />;
      case 'in-progress': return <HourglassEmptyIcon color="info" />;
      case 'escalated': return <ArrowUpwardIcon color="error" />;
      case 'resolved': return <CheckCircleIcon color="success" />;
      default: return <ErrorIcon />;
    }
  };

  // Summary cards component for reuse across views
  const renderSummaryCards = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Workstations
            </Typography>
            <Typography variant="h3">
              {workstations.length}
            </Typography>
            <Typography variant="body2">
              {workstations.filter(ws => ws.status === 'online').length} online
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Pending Issues
            </Typography>
            <Typography variant="h3">
              {issues.filter(issue => issue.status === 'pending').length}
            </Typography>
            <Typography variant="body2">
              {issues.filter(issue => issue.priority === 'high' || issue.priority === 'critical').length} high priority
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Escalated Issues
            </Typography>
            <Typography variant="h3">
              {issues.filter(issue => issue.escalated).length}
            </Typography>
            <Typography variant="body2">
              Requires attention
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Available Support
            </Typography>
            <Typography variant="h3">
              {supportTeam.filter(member => member.availability === 'available').length}
            </Typography>
            <Typography variant="body2">
              of {supportTeam.length} team members
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Issues list component for reuse across views
  const renderIssuesList = (limit = null) => {
    const filteredIssues = issues
      .filter(issue => issue.status !== 'resolved')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const displayIssues = limit ? filteredIssues.slice(0, limit) : filteredIssues;
    
    return (
      <Card>
        <CardHeader title="Active Issues" />
        <CardContent>
          <Grid container spacing={2}>
            {displayIssues.map(issue => (
              <Grid item xs={12} key={issue.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={1}>
                        {statusIcon(issue.status)}
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="subtitle2">
                          {issue.workstation}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={issue.priority} 
                          color={priorityColor(issue.priority)} 
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>{issue.description}</Typography>
                        <Typography variant="caption">
                          {new Date(issue.timestamp).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>
                          {issue.assignedTo || 'Unassigned'}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Box display="flex" justifyContent="flex-end">
                          {!issue.assignedTo && (
                            <Button 
                              variant="contained" 
                              size="small" 
                              color="primary"
                              onClick={() => handleAssignIssue(issue)}
                              sx={{ mr: 1 }}
                            >
                              Assign
                            </Button>
                          )}
                          {!issue.escalated && issue.status !== 'escalated' && (
                            <Button 
                              variant="contained" 
                              size="small" 
                              color="error"
                              onClick={() => handleEscalateIssue(issue.id)}
                            >
                              Escalate
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Workstation list component for reuse across views
  const renderWorkstationsList = () => (
    <Card>
      <CardHeader title="Workstation Status" />
      <CardContent>
        <List>
          {workstations.map(workstation => (
            <ListItem key={workstation.id}>
              <ListItemIcon>
                <ComputerIcon color={workstation.status === 'online' ? 'success' : 'error'} />
              </ListItemIcon>
              <ListItemText 
                primary={workstation.name} 
                secondary={`Status: ${workstation.status}`} 
              />
              {workstation.issues > 0 && (
                <Chip 
                  label={`${workstation.issues} issues`} 
                  color="warning" 
                  size="small" 
                />
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  // Support team list component for reuse across views
  const renderSupportTeamList = () => (
    <Card>
      <CardHeader 
        title="Support Team" 
        action={
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            onClick={handleOpenMessageDialog}
            startIcon={<MessageIcon />}
          >
            Message
          </Button>
        }
      />
      <CardContent>
        <List>
          {supportTeam.map(member => (
            <ListItem key={member.id}>
              <ListItemIcon>
                <Avatar>{member.name.charAt(0)}</Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={member.name} 
                secondary={member.role} 
              />
              <Chip 
                label={member.availability} 
                color={
                  member.availability === 'available' ? 'success' : 
                  member.availability === 'busy' ? 'warning' : 'default'
                }
                size="small" 
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch(selectedView) {
      case 'dashboard':
        return (
          <Box p={3}>
            <Typography variant="h4" gutterBottom>Team Leader Dashboard</Typography>
            {renderSummaryCards()}
            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {renderIssuesList(5)}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderWorkstationsList()}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderSupportTeamList()}
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
        
      case 'workstations':
        return (
          <Box p={3}>
            <Typography variant="h4" gutterBottom>Workstations</Typography>
            {renderSummaryCards()}
            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {renderWorkstationsList()}
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Workstation Issues" />
                    <CardContent>
                      <Grid container spacing={2}>
                        {issues
                          .filter(issue => issue.status !== 'resolved')
                          .sort((a, b) => a.workstation.localeCompare(b.workstation))
                          .map(issue => (
                            <Grid item xs={12} md={6} key={issue.id}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography variant="h6">{issue.workstation}</Typography>
                                  <Box display="flex" alignItems="center" mt={1}>
                                    {statusIcon(issue.status)}
                                    <Typography sx={{ ml: 1 }}>{issue.description}</Typography>
                                  </Box>
                                  <Box display="flex" justifyContent="space-between" mt={1}>
                                    <Chip 
                                      size="small" 
                                      label={issue.priority} 
                                      color={priorityColor(issue.priority)} 
                                    />
                                    <Typography variant="body2">
                                      {issue.assignedTo || 'Unassigned'}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
        
      case 'issues':
        return (
          <Box p={3}>
            <Typography variant="h4" gutterBottom>Issue Tracking</Typography>
            {renderSummaryCards()}
            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {renderIssuesList()}
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Resolved Issues" />
                    <CardContent>
                      <List>
                        {issues
                          .filter(issue => issue.status === 'resolved')
                          .map(issue => (
                            <ListItem key={issue.id}>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={issue.description} 
                                secondary={`${issue.workstation} | Resolved by: ${issue.assignedTo}`} 
                              />
                              <Typography variant="caption">
                                {new Date(issue.timestamp).toLocaleString()}
                              </Typography>
                            </ListItem>
                          ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
        
      case 'team':
        return (
          <Box p={3}>
            <Typography variant="h4" gutterBottom>Support Team</Typography>
            {renderSummaryCards()}
            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {renderSupportTeamList()}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Assigned Issues" />
                    <CardContent>
                      {supportTeam.map(member => (
                        <Box key={member.id} mb={2}>
                          <Typography variant="subtitle1">{member.name}</Typography>
                          <Divider />
                          <List dense>
                            {issues
                              .filter(issue => issue.assignedTo === member.name && issue.status !== 'resolved')
                              .map(issue => (
                                <ListItem key={issue.id}>
                                  <ListItemIcon>
                                    {statusIcon(issue.status)}
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={issue.description} 
                                    secondary={issue.workstation} 
                                  />
                                  <Chip 
                                    size="small" 
                                    label={issue.priority} 
                                    color={priorityColor(issue.priority)} 
                                  />
                                </ListItem>
                              ))}
                            {issues.filter(issue => issue.assignedTo === member.name && issue.status !== 'resolved').length === 0 && (
                              <ListItem>
                                <ListItemText primary="No active issues assigned" />
                              </ListItem>
                            )}
                          </List>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
        
      default:
        return (
          <Box p={3}>
            <Typography>Select a view from the sidebar</Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Team Leader Console
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={issues.filter(i => i.status === 'pending').length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Control Panel
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem 
            button 
            selected={selectedView === 'dashboard'} 
            onClick={() => setSelectedView('dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem 
            button 
            selected={selectedView === 'workstations'} 
            onClick={() => setSelectedView('workstations')}
          >
            <ListItemIcon>
              <ComputerIcon />
            </ListItemIcon>
            <ListItemText primary="Workstations" />
            <Chip 
              label={workstations.length} 
              size="small" 
              color="primary" 
            />
          </ListItem>
          <ListItem 
            button 
            selected={selectedView === 'issues'} 
            onClick={() => setSelectedView('issues')}
          >
            <ListItemIcon>
              <WarningIcon />
            </ListItemIcon>
            <ListItemText primary="Issues" />
            <Chip 
              label={issues.filter(i => i.status !== 'resolved').length} 
              size="small" 
              color="error" 
            />
          </ListItem>
          <ListItem 
            button 
            selected={selectedView === 'team'} 
            onClick={() => setSelectedView('team')}
          >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Support Team" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleOpenMessageDialog}>
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary="Messages" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 0 }}
      >
        <Toolbar />
        {renderContent()}
      </Box>

      {/* Assign Issue Dialog */}
      <Dialog open={isAssignDialogOpen} onClose={() => setIsAssignDialogOpen(false)}>
        <DialogTitle>Assign Issue</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {selectedIssue && selectedIssue.description}
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Assign to</InputLabel>
            <Select
              value={selectedTeamMember}
              onChange={(e) => setSelectedTeamMember(e.target.value)}
              label="Assign to"
            >
              {supportTeam.map(member => (
                <MenuItem key={member.id} value={member.name} disabled={member.availability === 'offline'}>
                  {member.name} - {member.role} ({member.availability})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmAssign} 
            variant="contained" 
            color="primary"
            disabled={!selectedTeamMember}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onClose={() => setIsMessageDialogOpen(false)}>
        <DialogTitle>Send Message</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Recipient</InputLabel>
            <Select
              value={selectedTeamMember}
              onChange={(e) => setSelectedTeamMember(e.target.value)}
              label="Recipient"
            >
              <MenuItem value="Support Team">Support Team (All)</MenuItem>
              {supportTeam.map(member => (
                <MenuItem key={member.id} value={member.name}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            label="Message"
            multiline
            rows={4}
            fullWidth
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMessageDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained" 
            color="primary"
            disabled={!messageText || !selectedTeamMember}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamLeader;