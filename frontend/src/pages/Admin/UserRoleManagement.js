import React, { useState, useEffect } from 'react';
import {
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Stack,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import AdminSidebar from '../../components/AdminSidebar';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UserRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const API_URL = 'http://localhost:5000/api/users';

  const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, { headers: getAuthHeader() });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showSnackbar('Failed to fetch users. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openUserDialog = (user = {}) => {
    setCurrentUser(user);
    setIsEditing(Boolean(user._id));
    setUserDialogOpen(true);
  };

  const handleInputChange = (field, value) => {
    setCurrentUser((prev) => ({ ...prev, [field]: value }));
  };

  const saveUser = async () => {
    if (!currentUser.name?.trim() || !currentUser.email?.trim() || !currentUser.department || !currentUser.role) {
      showSnackbar('Please fill in all required fields.', 'warning');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(`${API_URL}/${currentUser._id}`, currentUser, { headers: getAuthHeader() });
        setUsers((prev) => prev.map((user) => (user._id === currentUser._id ? currentUser : user)));
        showSnackbar('User updated successfully.', 'success');
      } else {
        const response = await axios.post(API_URL, currentUser, { headers: getAuthHeader() });
        setUsers((prev) => [...prev, response.data]);
        showSnackbar('User added successfully.', 'success');
      }
      setUserDialogOpen(false);
      setCurrentUser({});
    } catch (error) {
      console.error('Failed to save user:', error);
      showSnackbar('Failed to save user. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
      setUsers((prev) => prev.filter((user) => user._id !== id));
      showSnackbar('User deleted successfully.', 'success');
    } catch (error) {
      console.error('Failed to delete user:', error);
      showSnackbar('Failed to delete user. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (users.length === 0) {
      showSnackbar('No user data available to export.', 'info');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('User Report', 14, 22);

    const columns = ['Name', 'Email', 'Department', 'Role'];
    const rows = users.map(({ name, email, department, role }) => [
      name || 'N/A',
      email || 'N/A',
      department || 'N/A',
      role || 'N/A',
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [25, 118, 210] },
    });

    doc.save('users_report.pdf');
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* <AdminSidebar /> */}

      <Paper sx={{ p: 3, width: '100%', minHeight: 'calc(100vh - 112px)' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          User & Role Management
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => setExportDialogOpen(true)}
          >
            Export Users
          </Button>

          <Button variant="contained" onClick={() => openUserDialog()}>
            Add User
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 6 }}>
            No users found.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 220px)' }}>
            <Table stickyHeader aria-label="user table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => openUserDialog(user)}
                        aria-label="edit user"
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteUser(user._id)}
                        aria-label="delete user"
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Add / Edit User Dialog */}
        <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={currentUser.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={currentUser.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Department</InputLabel>
              <Select
                value={currentUser.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
                label="Department"
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Role</InputLabel>
              <Select
                value={currentUser.role || ''}
                onChange={(e) => handleInputChange('role', e.target.value)}
                label="Role"
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={saveUser} disabled={loading}>
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Confirmation Dialog */}
        <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
          <DialogTitle>Export Users</DialogTitle>
          <DialogContent>
            <Typography>Would you like to download the user report as a PDF?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                exportData();
                setExportDialogOpen(false);
              }}
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default UserRoleManagement;
