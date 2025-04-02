import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Box, Tabs, Tab, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Grid, Card, CardContent, Divider, Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  Search as SearchIcon
} from '@mui/icons-material';

function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // User management functions
  const openUserDialog = (user = {}) => {
    setCurrentItem(user);
    setIsEditing(!!user.id);
    setUserDialog(true);
  };

  const saveUser = () => {
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Andon System - Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="User & Role Management" />
            <Tab label="Issue Categories & Escalation Rules" />
            <Tab label="Workstation Mapping" />
            <Tab label="Department Management" />
            <Tab label="Historical Data & Logs" />
          </Tabs>
        </Paper>
        
        {/* Tab 1: User & Role Management */}
        {tabValue === 0 && (
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">User & Role Management</Typography>
              <Box>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={() => openUserDialog()}
                >
                  Add User
                </Button>
                <Button 
                  sx={{ ml: 2 }} 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={() => exportData('users')}
                >
                  Export Users
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Tab 2: Issue Categories & Escalation Rules */}
        {tabValue === 1 && (
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Issue Categories & Escalation Rules</Typography>
              <Box>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={() => openCategoryDialog()}
                >
                  Add Category
                </Button>
                <Button 
                  sx={{ ml: 2 }} 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={() => exportData('categories')}
                >
                  Export Categories
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category Name</TableCell>
                    <TableCell>Escalation Time (mins)</TableCell>
                    <TableCell>Default Assignment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {issueCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.escalationTime}</TableCell>
                      <TableCell>{category.assignTo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Tab 3: Workstation Mapping */}
        {tabValue === 2 && (
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Workstation Mapping</Typography>
              <Box>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={() => openWorkstationDialog()}
                >
                  Add Workstation
                </Button>
                <Button 
                  sx={{ ml: 2 }} 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={() => exportData('workstations')}
                >
                  Export Workstations
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Workstation Name</TableCell>
                    <TableCell>Zone</TableCell>
                    <TableCell>Supervisor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workstations.map((station) => (
                    <TableRow key={station.id}>
                      <TableCell>{station.name}</TableCell>
                      <TableCell>{station.zone}</TableCell>
                      <TableCell>{station.supervisor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Tab 4: Department Management - Keeping Edit/Delete functionality */}
        {tabValue === 3 && (
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Department Management</Typography>
              <Box>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={() => openDepartmentDialog()}
                >
                  Add Department
                </Button>
                <Button 
                  sx={{ ml: 2 }} 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={() => exportData('departments')}
                >
                  Export Departments
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Department Name</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>{department.name}</TableCell>
                      <TableCell>{department.manager}</TableCell>
                      <TableCell>{department.location}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openDepartmentDialog(department)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => deleteDepartment(department.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Tab 5: Historical Data & Logs */}
        {tabValue === 4 && (
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Historical Data & System Logs</Typography>
              <Box>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
                <Button 
                  sx={{ ml: 2 }} 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={() => exportData('logs')}
                >
                  Export Logs
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
      
      {/* User Dialog */}
      <Dialog open={userDialog} onClose={() => setUserDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
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
          <Button onClick={saveUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Category Dialog */}
      <Dialog open={categoryDialog} onClose={() => setCategoryDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
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
        <DialogContent>
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
        <DialogContent>
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