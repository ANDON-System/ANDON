import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Box
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


function UserRoleManagement() {
  const [users, setUsers] = useState([]);
  const [userDialog, setUserDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false); // NEW

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openUserDialog = (user = {}) => {
    setCurrentItem(user);
    setIsEditing(!!user._id);
    setUserDialog(true);
  };

  const saveUser = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/users/${currentItem._id}`, currentItem, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const updatedUsers = users.map(u => u._id === currentItem._id ? currentItem : u);
        setUsers(updatedUsers);
      } else {
        const response = await axios.post('http://localhost:5000/api/users', currentItem, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsers([...users, response.data]);
      }
      setUserDialog(false);
      setCurrentItem({});
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user.");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  // Actual export logic
  const exportData = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('User Report', 14, 22);

  const columns = ['Name', 'Email', 'Department', 'Role'];
  const rows = users.map(user => [
    user.name || 'N/A',
    user.email || 'N/A',
    user.department || 'N/A',
    user.role || 'N/A',
  ]);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 30,
    styles: { fontSize: 10 },
  });

  doc.save('users_report.pdf');
};


  return (
    <Box sx={{ display: "flex" }}>
      <AdminSidebar />
      <Paper sx={{ p: 2, width: '100%', minHeight: 'calc(100vh - 112px)' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>User & Role Management</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => setExportDialogOpen(true)} // NEW
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
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell align="left">{user.name}</TableCell>
                  <TableCell align="left">{user.email}</TableCell>
                  <TableCell align="left">{user.department}</TableCell>
                  <TableCell align="left">{user.role}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openUserDialog(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteUser(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add / Edit User Dialog */}
        <Dialog open={userDialog} onClose={() => setUserDialog(false)}>
          <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={currentItem.name || ''}
              onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={currentItem.email || ''}
              onChange={(e) => setCurrentItem({ ...currentItem, email: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Department</InputLabel>
              <Select
                value={currentItem.department || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, department: e.target.value })}
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                value={currentItem.role || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserDialog(false)}>Cancel</Button>
            <Button onClick={saveUser}>{isEditing ? 'Update' : 'Add'}</Button>
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
      </Paper>
    </Box>
  );
}

export default UserRoleManagement;
