import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText,
  AppBar, Toolbar, CssBaseline, Divider, Card, CardContent, Grid,
  Chip, Button, Badge, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, Tooltip
} from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import WarningIcon from '@mui/icons-material/Warning';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person'; 
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TeamIssues from './TeamIssues';

const drawerWidth = 240;

const TeamLeaderDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [supportTeam, setSupportTeam] = useState([]);
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch issues and support team on component mount
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/issues/');
        setIssues(response.data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    const fetchSupportTeam = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/');
        setSupportTeam(response.data);
      } catch (error) {
        console.error("Error fetching support team:", error);
      }
    };

    fetchIssues();
    fetchSupportTeam();
  }, []);

  // Handle sidebar toggle
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Handle view selection and navigate to the appropriate route
  const handleViewSelect = (view) => {
    setSelectedView(view);
    if (view === 'issues') {
      navigate('/team-issues');
    }
    if (window.innerWidth < 600) {
      setDrawerOpen(false);
    }
  };

  // Handle actions
  const handleEditIssue = (issue) => {
    setSelectedIssue(issue);
    setSelectedTeamMember(issue.assignedTo || '');
    setIsEditDialogOpen(true);
  };

  const handleConfirmEdit = async () => {
    if (selectedTeamMember) {
      const updatedIssues = issues.map(issue => 
        issue._id === selectedIssue._id 
          ? { 
              ...issue, 
              assignedTo: selectedTeamMember,
              assignedAt: new Date().toISOString() // Add timestamp when issue is assigned
            } 
          : issue
      );
      setIssues(updatedIssues);
      setIsEditDialogOpen(false);
      setSelectedTeamMember('');

      // Update the issue in the backend
      await axios.put(`http://localhost:5000/api/issues/${selectedIssue._id}`, {
        assignedTo: selectedTeamMember,
        assignedAt: new Date().toISOString()
      });
    }
  };

  // Helper functions
  const statusIcon = (status) => {
    switch(status) {
      case 'pending': return <WarningIcon color="warning" />;
      case 'in-progress': return <HourglassEmptyIcon color="info" />;
      case 'escalated': return <ArrowUpwardIcon color="error" />;
      case 'resolved': return <CheckCircleIcon color="success" />;
      default: return <ErrorIcon />;
    }
  };

  const priorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Calculate team member assignments
  const getTeamMemberAssignmentCount = (memberName) => {
    return issues.filter(issue => issue.assignedTo === memberName).length;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not assigned';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Dashboard content renderer
  const renderContent = () => {
    switch(selectedView) {
      case 'dashboard':
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Team Leader Dashboard</Typography>
            
            {/* Summary Cards */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>Active Issues</Typography>
                    <Typography variant="h4">
                      {issues.filter(i => i.status !== 'resolved').length}
                    </Typography>
                    <Typography variant="body2">
                      {issues.filter(i => i.status === 'pending').length} pending
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>Escalated</Typography>
                    <Typography variant="h4">
                      {issues.filter(i => i.status === 'escalated').length}
                    </Typography>
                    <Typography variant="body2">Requires attention</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>Support Team</Typography>
                    <Typography variant="h4">
                      {supportTeam.filter(m => m.availability === 'available').length}
                    </Typography>
                    <Typography variant="body2">team members available</Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* New Card: Assigned Issues */}
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>Assigned Issues</Typography>
                    <Typography variant="h4">
                      {issues.filter(i => i.assignedTo).length}
                    </Typography>
                    <Typography variant="body2">
                      {issues.filter(i => !i.assignedTo && i.status !== 'resolved').length} unassigned
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Issues List */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Active Issues</Typography>
                {issues.filter(i => i.status !== 'resolved').map(issue => (
                  <Card key={issue._id} variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item xs={12} md={1}>{statusIcon(issue.status)}</Grid>
                      <Grid item xs={12} md={3}>{issue.description}</Grid>
                      <Grid item xs={6} md={1}>
                        <Chip 
                          size="small" 
                          label={issue.priority} 
                          color={priorityColor(issue.priority)} 
                        />
                      </Grid>
                      {/* Assigned To Section */}
                      <Grid item xs={6} md={2}>
                        {issue.assignedTo ? (
                          <Tooltip title={`Assigned at: ${formatDate(issue.assignedAt)}`}>
                            <Chip
                              icon={<PersonIcon />}
                              label={issue.assignedTo}
                              size="small"
                              color="primary"
                            />
                          </Tooltip>
                        ) : (
                          <Chip
                            label="Unassigned"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Grid>
                      {/* Assignment Time Section */}
                      <Grid item xs={6} md={2}>
                        {issue.assignedAt && (
                          <Tooltip title="Assignment Time">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="caption">
                                {formatDate(issue.assignedAt)}
                              </Typography>
                            </Box>
                          </Tooltip>
                        )}
                      </Grid>
                      <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {issue.assignedTo ? (
                          <Button 
                            variant="contained" 
                            size="small" 
                            onClick={() => handleEditIssue(issue)}
                            sx={{ mr: 1 }}
                          >
                            Reassign
                          </Button>
                        ) : (
                          <Button 
                            variant="contained" 
                            size="small" 
                            onClick={() => handleEditIssue(issue)}
                          >
                            Assign
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Team Members Assignment Stats */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Team Member Assignments</Typography>
                <Grid container spacing={2}>
                  {supportTeam.map(member => (
                    <Grid item xs={12} sm={6} md={4} key={member._id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">{member.name}</Typography>
                            <Chip
                              label={member.availability}
                              color={member.availability === 'available' ? 'success' : 'error'}
                              size="small"
                            />
                          </Box>
                          <Typography variant="h6">
                            {getTeamMemberAssignmentCount(member.name)} issues
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );
      case 'issues':
        return <TeamIssues />; // Render TeamIssues component
      case 'team':
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Support Team</Typography>
            <Grid container spacing={2}>
              {supportTeam.map(member => (
                <Grid item xs={12} sm={6} md={4} key={member._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{member.name}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Chip
                          label={member.availability}
                          color={member.availability === 'available' ? 'success' : 'error'}
                        />
                        <Typography>
                          {getTeamMemberAssignmentCount(member.name)} assigned issues
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      default:
        return <Box p={3}><Typography>Select a view</Typography></Box>;
    }
  };

  // Sidebar content
  const drawerContent = (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap>Control Panel</Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button selected={selectedView === 'dashboard'} onClick={() => handleViewSelect('dashboard')}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button selected={selectedView === 'issues'} onClick={() => handleViewSelect('issues')}>
          <ListItemIcon><WarningIcon /></ListItemIcon>
          <ListItemText primary="Issues" />
          <Chip 
            label={issues.filter(i => i.status !== 'resolved').length} 
            size="small" 
            color="error" 
          />
        </ListItem>
        <ListItem button selected={selectedView === 'team'} onClick={() => handleViewSelect('team')}>
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="Support Team" />
          <Chip 
            label={supportTeam.length} 
            size="small" 
            color="primary" 
          />
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem button onClick={() => window.location.href = '/'}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Andon System - Team Leader
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={issues.filter(i => i.status === 'pending').length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Temporary drawer that shows/hides with menu icon click */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 0 }}>
        <Toolbar />
        {renderContent()}
      </Box>

      {/* Edit Issue Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>
          {selectedIssue && selectedIssue.assignedTo ? 'Reassign Issue' : 'Assign Issue'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Typography variant="body1" gutterBottom>
            {selectedIssue && selectedIssue.description}
          </Typography>
          
          {selectedIssue && selectedIssue.assignedTo && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
              Currently assigned to: {selectedIssue.assignedTo}
              {selectedIssue.assignedAt && ` (since ${formatDate(selectedIssue.assignedAt)})`}
            </Typography>
          )}
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Assign to</InputLabel>
            <Select
              value={selectedTeamMember}
              onChange={(e) => setSelectedTeamMember(e.target.value)}
              label="Assign to"
            >
              {supportTeam.map(member => (
                <MenuItem key={member._id} value={member.name}>
                  {member.name} ({member.availability}) - 
                  {getTeamMemberAssignmentCount(member.name)} issues
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmEdit} variant="contained" disabled={!selectedTeamMember}>
            {selectedIssue && selectedIssue.assignedTo ? 'Reassign' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamLeaderDashboard;
