import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Computer as ComputerIcon,
  Apartment as ApartmentIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Mock data for demonstration
  const mockUsers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Operator', department: 'Production' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Supervisor', department: 'Assembly' },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'Support', department: 'Maintenance' },
    { id: 4, name: 'Laura Taylor', email: 'laura@example.com', role: 'Manager', department: 'Quality Control' }
  ];

  const mockIssueCategories = [
    { id: 1, name: 'Equipment Failure', escalationTime: 10, assignTo: 'Support' },
    { id: 2, name: 'Material Shortage', escalationTime: 15, assignTo: 'Supervisor' },
    { id: 3, name: 'Quality Issue', escalationTime: 5, assignTo: 'Support' }
  ];

  const mockWorkstations = [
    { id: 1, name: 'Station A1', zone: 'Assembly Line 1', supervisor: 'Sarah Johnson' },
    { id: 2, name: 'Station A2', zone: 'Assembly Line 1', supervisor: 'Sarah Johnson' },
    { id: 3, name: 'Station B1', zone: 'Assembly Line 2', supervisor: 'Robert Brown' }
  ];

  const mockDepartments = [
    { id: 1, name: 'Production', manager: 'Laura Taylor', location: 'Building A' },
    { id: 2, name: 'Assembly', manager: 'Sarah Johnson', location: 'Building B' },
    { id: 3, name: 'Maintenance', manager: 'Mike Chen', location: 'Building A' },
    { id: 4, name: 'Quality Control', manager: 'Laura Taylor', location: 'Building C' }
  ];

  const mockLogs = [
    { id: 1, timestamp: '2025-04-02 08:30:22', action: 'Issue Created', user: 'John Smith', details: 'Equipment Failure at Station A1' },
    { id: 2, timestamp: '2025-04-02 08:35:45', action: 'Issue Assigned', user: 'Sarah Johnson', details: 'Assigned to Mike Chen' },
    { id: 3, timestamp: '2025-04-02 09:15:10', action: 'Issue Resolved', user: 'Mike Chen', details: 'Replaced faulty component' }
  ];

  // State declarations
  const [users, setUsers] = useState(mockUsers);
  const [issueCategories, setIssueCategories] = useState(mockIssueCategories);
  const [workstations, setWorkstations] = useState(mockWorkstations);
  const [departments, setDepartments] = useState(mockDepartments);
  const [logs, setLogs] = useState(mockLogs);
  
  // Dialog states
  const [userDialog, setUserDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [workstationDialog, setWorkstationDialog] = useState(false);
  const [departmentDialog, setDepartmentDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const drawerWidth = 240;

  // Toggle drawer function - works for both mobile and desktop
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Logout function
  const handleLogout = () => {
    // In a real application, this would clear auth tokens and redirect to login
    alert("Logging out...");
    // Simulate redirect to login page
    window.location.href = "/";
  };

  // Navigation items for the sidebar
  const navItems = [
    { text: 'User  & Role Management', icon: <PeopleIcon />, index: 0 },
    { text: 'Issue Categories & Rules', icon: <CategoryIcon />, index: 1 },
    { text: 'Workstation Mapping', icon: <ComputerIcon />, index: 2 },
    { text: 'Department Management', icon: <ApartmentIcon />, index: 3 },
    { text: 'Historical Data & Logs', icon: <HistoryIcon />, index: 4 },
    { text: 'Logout', icon: <LogoutIcon />, index: 5, action: handleLogout }
  ];

  const handleNavItemClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      setCurrentTab(item.index);
    }
    setMobileOpen(false);
  };

  // Drawer content
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Andon Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => handleNavItemClick(item)}
            selected={currentTab === item.index}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  // User management functions
  const openUserDialog = (user = {}) => {
    setCurrentItem(user);
    setIsEditing(!!user.id);
    setUserDialog(true);
  };

  const saveUser  = () => {
    if (isEditing) {
      setUsers(users.map(u => u.id === currentItem.id ? currentItem : u));
    } else {
      setUsers([...users, { ...currentItem, id: users.length + 1 }]);
    }
    setUserDialog(false);
    setCurrentItem({});
  };

  // Issue category functions
  const openCategoryDialog = (category = {}) => {
    setCurrentItem(category);
    setIsEditing(!!category.id);
    setCategoryDialog(true);
  };

  const saveCategory = () => {
    if (isEditing) {
      setIssueCategories(issueCategories.map(c => c.id === currentItem.id ? currentItem : c));
    } else {
      setIssueCategories([...issueCategories, { ...currentItem, id: issueCategories.length + 1 }]);
    }
    setCategoryDialog(false);
    setCurrentItem({});
  };

  // Workstation functions
  const openWorkstationDialog = (workstation = {}) => {
    setCurrentItem(workstation);
    setIsEditing(!!workstation.id);
    setWorkstationDialog(true);
  };

  const saveWorkstation = () => {
    if (isEditing) {
      setWorkstations(workstations.map(w => w.id === currentItem.id ? currentItem : w));
    } else {
      setWorkstations([...workstations, { ...currentItem, id: workstations.length + 1 }]);
    }
    setWorkstationDialog(false);
    setCurrentItem({});
  };

  // Department functions
  const openDepartmentDialog = (department = {}) => {
    setCurrentItem(department);
    setIsEditing(!!department.id);
    setDepartmentDialog(true);
  };

  const saveDepartment = () => {
    if (isEditing) {
      setDepartments(departments.map(d => d.id === currentItem.id ? currentItem : d));
    } else {
      setDepartments([...departments, { ...currentItem, id: departments.length + 1 }]);
    }
    setDepartmentDialog(false);
    setCurrentItem({});
  };

  const deleteDepartment = (id) => {
    setDepartments(departments.filter(department => department.id !== id));
  };

  // Data export function
  const exportData = (dataType) => {
    let data;
    let fileName;
    
    switch (dataType) {
      case 'users':
        data = users;
        fileName = 'users_export.json';
        break;
      case 'categories':
        data = issueCategories;
        fileName = 'issue_categories_export.json';
        break;
      case 'workstations':
        data = workstations;
        fileName = 'workstations_export.json';
        break;
      case 'departments':
        data = departments;
        fileName = 'departments_export.json';
        break;
      case 'logs':
        data = logs;
        fileName = 'system_logs_export.json';
        break;
      default:
        return;
    }
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Menu button - visible on all screens */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Andon System - Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar drawer - unified approach for both mobile and desktop */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="dashboard navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main content area */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: '100%'
        }}
      >
        <Toolbar /> {/* This provides spacing below the app bar */}
        
        {/* Tab 0: User & Role Management */}
        {currentTab === 0 && (
          <Paper sx={{ p: 2, width: '100%', minHeight: 'calc(100vh - 112px)' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>User  & Role Management</Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={() => exportData('users')}
                >
                  Export Users
                </Button>
              </Stack>
            </Box>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)', overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Department</TableCell>
                    <TableCell align="left">Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell align="left">{user.name}</TableCell>
                      <TableCell align="left">{user.email}</TableCell>
                      <TableCell align="left">{user.department}</TableCell>
                      <TableCell align="left">{user.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Tab 1: Issue Categories & Escalation Rules */}
        {currentTab === 1 && (
          <Paper sx={{ p: 2, width: '100%', minHeight: 'calc(100vh - 112px)' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Issue Categories & Escalation Rules</Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={() => exportData('categories')}
                >
                  Export Categories
                </Button>
              </Stack>
            </Box>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)', overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Category Name</TableCell>
                    <TableCell align="left">Escalation Time (mins)</TableCell>
                    <TableCell align="left">Default Assignment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {issueCategories.map((category) => (
                    <TableRow key={category.id} hover>
                      <TableCell align="left">{category.name}</TableCell>
                      <TableCell align="left">{category.escalationTime}</TableCell>
                      <TableCell align="left">{category.assignTo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Tab 2: Workstation Mapping */}
        {currentTab === 2 && (
          <Paper sx={{ p: 2, width: '100%', minHeight: 'calc(100vh - 112px)' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Workstation Mapping</Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={() => exportData('workstations')}
                >
                  Export Workstations
                </Button>
              </Stack>
            </Box>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)', overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Workstation Name</TableCell>
                    <TableCell align="left">Zone</TableCell>
                    <TableCell align="left">Supervisor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workstations.map((station) => (
                    <TableRow key={station.id} hover>
                      <TableCell align="left">{station.name}</TableCell>
                      <TableCell align="left">{station.zone}</TableCell>
                      <TableCell align="left">{station.supervisor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Tab 3: Department Management */}
        {currentTab === 3 && (
          <Paper sx={{ p: 2, width: '100%', minHeight: 'calc(100vh - 112px)' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Department Management</Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={() => openDepartmentDialog()}
                >
                  Add Department
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={() => exportData('departments')}
                >
                  Export Departments
                </Button>
              </Stack>
            </Box>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)', overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Department Name</TableCell>
                    <TableCell align="left">Manager</TableCell>
                    <TableCell align="left">Location</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id} hover>
                      <TableCell align="left">{department.name}</TableCell>
                      <TableCell align="left">{department.manager}</TableCell>
                      <TableCell align="left">{department.location}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" onClick={() => openDepartmentDialog(department)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteDepartment(department.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Tab 4: Historical Data & Logs */}
        {currentTab === 4 && (
          <Paper sx={{ p: 2, width: '100%', minHeight: 'calc(100vh - 112px)' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Historical Data & System Logs</Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={() => exportData('logs')}
                >
                  Export Logs
                </Button>
              </Stack>
            </Box>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)', overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Timestamp</TableCell>
                    <TableCell align="left">Action</TableCell>
                    <TableCell align="left">User </TableCell>
                    <TableCell align="left">Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell align="left">{log.timestamp}</TableCell>
                      <TableCell align="left">{log.action}</TableCell>
                      <TableCell align="left">{log.user}</TableCell>
                      <TableCell align="left">{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
      
      {/* User Dialog */}
      <Dialog open={userDialog} onClose={() => setUserDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent sx={{ width: { xs: '300px', sm: '400px' } }}>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={currentItem.name || ''}
            onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={currentItem.email || ''}
            onChange={(e) => setCurrentItem({...currentItem, email: e.target.value})}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Department</InputLabel>
            <Select
              value={currentItem.department || ''}
              label="Department"
              onChange={(e) => setCurrentItem({...currentItem, department: e.target.value})}
            >
              {departments.map(dept => (
                <MenuItem key={dept.id} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={currentItem.role || ''}
              label="Role"
              onChange={(e) => setCurrentItem({...currentItem, role: e.target.value})}
            >
              <MenuItem value="Operator">Operator</MenuItem>
              <MenuItem value="Supervisor">Supervisor</MenuItem>
              <MenuItem value="Support">Support Team</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog(false)}>Cancel</Button>
          <Button onClick={saveUser } variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Category Dialog */}
      <Dialog open={categoryDialog} onClose={() => setCategoryDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent sx={{ width: { xs: '300px', sm: '400px' } }}>
          <TextField
            margin="dense"
            label="Category Name"
            fullWidth
            value={currentItem.name || ''}
            onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Escalation Time (minutes)"
            type="number"
            fullWidth
            value={currentItem.escalationTime || ''}
            onChange={(e) => setCurrentItem({...currentItem, escalationTime: parseInt(e.target.value, 10)})}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Default Assignment</InputLabel>
            <Select
              value={currentItem.assignTo || ''}
              label="Default Assignment"
              onChange={(e) => setCurrentItem({...currentItem, assignTo: e.target.value})}
            >
              <MenuItem value="Supervisor">Supervisor</MenuItem>
              <MenuItem value="Support">Support Team</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialog(false)}>Cancel</Button>
          <Button onClick={saveCategory} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Workstation Dialog */}
      <Dialog open={workstationDialog} onClose={() => setWorkstationDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Workstation' : 'Add New Workstation'}</DialogTitle>
        <DialogContent sx={{ width: { xs: '300px', sm: '400px' } }}>
          <TextField
            margin="dense"
            label="Workstation Name"
            fullWidth
            value={currentItem.name || ''}
            onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Zone"
            fullWidth
            value={currentItem.zone || ''}
            onChange={(e) => setCurrentItem({...currentItem, zone: e.target.value})}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Supervisor</InputLabel>
            <Select
              value={currentItem.supervisor || ''}
              label="Supervisor"
              onChange={(e) => setCurrentItem({...currentItem, supervisor: e.target.value})}
            >
              {users
                .filter(user => user.role === 'Supervisor')
                .map(supervisor => (
                  <MenuItem key={supervisor.id} value={supervisor.name}>
                    {supervisor.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkstationDialog(false)}>Cancel</Button>
          <Button onClick={saveWorkstation} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Department Dialog */}
      <Dialog open={departmentDialog} onClose={() => setDepartmentDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Department' : 'Add New Department'}</DialogTitle>
        <DialogContent sx={{ width: { xs: '300px', sm: '400px' } }}>
          <TextField
            margin="dense"
            label="Department Name"
            fullWidth
            value={currentItem.name || ''}
            onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Manager</InputLabel>
            <Select
              value={currentItem.manager || ''}
              label="Manager"
              onChange={(e) => setCurrentItem({...currentItem, manager: e.target.value})}
            >
              {users
                .filter(user => user.role === 'Manager')
                .map(manager => (
                  <MenuItem key={manager.id} value={manager.name}>
                    {manager.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={currentItem.location || ''}
            onChange={(e) => setCurrentItem({...currentItem, location: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepartmentDialog(false)}>Cancel</Button>
          <Button onClick={saveDepartment} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard;