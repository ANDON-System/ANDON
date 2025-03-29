import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  Divider, 
  Badge, 
  IconButton, 
  Card, 
  CardContent, 
  CardActions, 
  Chip, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Avatar, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Menu
} from '@mui/material';

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

const SupportDashboard = () => {
  // State
  const [open, setOpen] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  // Mock data
  const issues = [
    { id: 1, title: 'Server outage in production', priority: 'High', status: 'New', time: '10 min ago', assignee: 'Unassigned', sla: '1 hour', description: 'Production server is not responding to requests.', tags: ['Server', 'Production'] },
    { id: 2, title: 'Database connection issue', priority: 'Medium', status: 'In Progress', time: '45 min ago', assignee: 'Jane Smith', sla: '3 hours', description: 'Users are experiencing slow response when accessing database.', tags: ['Database', 'Performance'] },
    { id: 3, title: 'User cannot reset password', priority: 'Low', status: 'Acknowledged', time: '2 hours ago', assignee: 'You', sla: '8 hours', description: 'User reports that password reset functionality is not working.', tags: ['Authentication', 'User'] },
    { id: 4, title: 'Mobile app crashing on startup', priority: 'High', status: 'In Progress', time: '30 min ago', assignee: 'John Doe', sla: '2 hours', description: 'Multiple users reported app crashes on Android devices.', tags: ['Mobile', 'Android'] },
    { id: 5, title: 'API endpoint returning 500 error', priority: 'Medium', status: 'New', time: '15 min ago', assignee: 'Unassigned', sla: '4 hours', description: 'The /users/profile endpoint is returning server errors.', tags: ['API', 'Backend'] },
  ];

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

  // Handle issue selection
  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setDialogOpen(true);
  };

  // Handle issue acknowledgement
  const handleAcknowledge = (issue) => {
    console.log('Acknowledged issue:', issue);
    // Would update issue status in a real application
  };

  // Handle issue escalation
  const handleEscalate = (issue) => {
    setSelectedIssue(issue);
    setEscalateDialogOpen(true);
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
      case 'New':
        return <ErrorIcon color="error" />;
      case 'Acknowledged':
        return <HourglassEmptyIcon color="warning" />;
      case 'In Progress':
        return <HourglassEmptyIcon color="primary" />;
      case 'Resolved':
        return <CheckCircleIcon color="success" />;
      default:
        return <HourglassEmptyIcon />;
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

  // Drawer width
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Support Team Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleNotificationMenu}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <PersonIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            ...(!open && {
              overflowX: 'hidden',
              width: theme => theme.spacing(7),
              transition: theme => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button selected>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Badge badgeContent={5} color="error">
                  <AssignmentIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Issues" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="My Assignments" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#ffebee' }}>
              <Typography variant="h6" component="div">New Issues</Typography>
              <Typography variant="h3" component="div">2</Typography>
              <Typography variant="body2" color="text.secondary">Requires acknowledgement</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fff8e1' }}>
              <Typography variant="h6" component="div">In Progress</Typography>
              <Typography variant="h3" component="div">2</Typography>
              <Typography variant="body2" color="text.secondary">Currently being worked on</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#e8f5e9' }}>
              <Typography variant="h6" component="div">Resolved</Typography>
              <Typography variant="h3" component="div">0</Typography>
              <Typography variant="body2" color="text.secondary">Waiting for confirmation</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#e3f2fd' }}>
              <Typography variant="h6" component="div">SLA at Risk</Typography>
              <Typography variant="h3" component="div">1</Typography>
              <Typography variant="body2" color="text.secondary">Approaching time limit</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Search and Filter Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search issues..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                sx={{ mr: 1 }}
                onClick={() => setFilterDialogOpen(true)}
              >
                Filter
              </Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
              >
                New Issue
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Issue List */}
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
              {issues.map((issue) => (
                <TableRow 
                  key={issue.id}
                  hover
                  onClick={() => handleIssueSelect(issue)}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: issue.status === 'New' ? 'rgba(255, 0, 0, 0.05)' : 'inherit' 
                  }}
                >
                  <TableCell>#{issue.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1">{issue.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{issue.time}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={issue.priority}
                      color={getPriorityColor(issue.priority)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(issue.status)}
                      <Typography variant="body2" sx={{ ml: 1 }}>{issue.status}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{issue.assignee}</TableCell>
                  <TableCell>{issue.sla}</TableCell>
                  <TableCell>
                    <Box>
                      {issue.status === 'New' && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcknowledge(issue);
                          }}
                          sx={{ mr: 1 }}
                        >
                          Acknowledge
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEscalate(issue);
                        }}
                        startIcon={<ArrowUpwardIcon />}
                      >
                        Escalate
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Issue Detail Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          {selectedIssue && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Issue #{selectedIssue.id}: {selectedIssue.title}</Typography>
                  <Chip
                    size="small"
                    label={selectedIssue.priority}
                    color={getPriorityColor(selectedIssue.priority)}
                  />
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1" gutterBottom>Description</Typography>
                    <Typography variant="body1" paragraph>
                      {selectedIssue.description}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>Tags</Typography>
                    <Box sx={{ mb: 3 }}>
                      {selectedIssue.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small" sx={{ mr: 1 }} />
                      ))}
                    </Box>
                    
                    <Typography variant="subtitle1" gutterBottom>Updates & Notes</Typography>
                    <TextField
                      label="Add update or solution"
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      placeholder="Document your progress or solution here..."
                      sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="primary">
                      Save Update
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Status</Typography>
                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Update Status</InputLabel>
                        <Select
                          value={selectedIssue.status}
                          label="Update Status"
                        >
                          <MenuItem value="New">New</MenuItem>
                          <MenuItem value="Acknowledged">Acknowledged</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Resolved">Resolved</MenuItem>
                          <MenuItem value="Closed">Closed</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <Typography variant="subtitle2" gutterBottom>Assignee</Typography>
                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Assignee</InputLabel>
                        <Select
                          value={selectedIssue.assignee === 'Unassigned' ? '' : selectedIssue.assignee}
                          label="Assignee"
                        >
                          <MenuItem value="">Unassigned</MenuItem>
                          <MenuItem value="You">You</MenuItem>
                          <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                          <MenuItem value="John Doe">John Doe</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <Typography variant="subtitle2" gutterBottom>SLA Deadline</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {selectedIssue.sla} (from creation)
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>Reported</Typography>
                      <Typography variant="body2">
                        {selectedIssue.time}
                      </Typography>
                    </Paper>
                    
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      color="error" 
                      startIcon={<ArrowUpwardIcon />}
                      sx={{ mb: 1 }}
                    >
                      Escalate Issue
                    </Button>
                    
                    {selectedIssue.status !== 'Resolved' && (
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircleIcon />}
                      >
                        Mark as Resolved
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
                <Button variant="contained" color="primary">Save Changes</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
        
        {/* Escalation Dialog */}
        <Dialog
          open={escalateDialogOpen}
          onClose={() => setEscalateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Escalate Issue</DialogTitle>
          <DialogContent>
            {selectedIssue && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  You are about to escalate issue #{selectedIssue.id}: {selectedIssue.title}
                </Typography>
                
                <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                  <InputLabel>Escalation Level</InputLabel>
                  <Select
                    label="Escalation Level"
                    defaultValue="1"
                  >
                    <MenuItem value="1">Level 1 - Team Lead</MenuItem>
                    <MenuItem value="2">Level 2 - Department Manager</MenuItem>
                    <MenuItem value="3">Level 3 - Senior Management</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  label="Reason for Escalation"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  placeholder="Explain why this issue needs to be escalated..."
                  sx={{ mb: 2 }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEscalateDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error">Confirm Escalation</Button>
          </DialogActions>
        </Dialog>
        
        {/* Filter Dialog */}
        <Dialog
          open={filterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Filter Issues</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    defaultValue="all"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Acknowledged">Acknowledged</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    label="Priority"
                    defaultValue="all"
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Assignee</InputLabel>
                  <Select
                    label="Assignee"
                    defaultValue="all"
                  >
                    <MenuItem value="all">All Assignees</MenuItem>
                    <MenuItem value="me">Assigned to Me</MenuItem>
                    <MenuItem value="unassigned">Unassigned</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>SLA Status</InputLabel>
                  <Select
                    label="SLA Status"
                    defaultValue="all"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="atrisk">At Risk</MenuItem>
                    <MenuItem value="breached">Breached</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
            <Button variant="outlined">Reset</Button>
            <Button variant="contained" color="primary">Apply Filters</Button>
          </DialogActions>
        </Dialog>
        
        {/* Notification Menu */}
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