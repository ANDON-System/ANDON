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

function UserRoleManagement() {
  const [users, setUsers] = useState([]); // State to hold fetched users
  const [userDialog, setUserDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include token if required
        }
      });
      console.log("Fetched Users:", response.data); // Log the fetched users
      setUsers(response.data); // Set the fetched users to state
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  // User management functions
  const openUserDialog = (user = {}) => {
    setCurrentItem(user);
    setIsEditing(!!user._id); // Use _id for editing
    setUserDialog(true);
  };

  const saveUser  = async () => {
    if (isEditing) {
      // Update user logic (you may want to send a PUT request to the backend)
      await axios.put(`http://localhost:5000/api/users/${currentItem._id}`, currentItem, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const updatedUsers = users.map(u => u._id === currentItem._id ? currentItem : u);
      setUsers(updatedUsers);
    } else {
      // Add new user logic (you may want to send a POST request to the backend)
      const response = await axios.post('http://localhost:5000/api/users', currentItem, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers([...users, response.data]); // Add the newly created user to the state
    }
    setUserDialog(false);
    setCurrentItem({});
  };

  const deleteUser  = async (id) => {
    // Send a DELETE request to the backend
    await axios.delete(`http://localhost:5000/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    setUsers(users.filter(user => user._id !== id)); // Use _ id for deletion
  };

  // Data export function
  const exportData = () => {
    const jsonString = JSON.stringify(users, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = 'users_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSidebar />
      <Paper sx={{ p: 2, width: '100%', minHeight: 'calc(100vh - 112px)' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>User  & Role Management</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportData}
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
                    <IconButton onClick={() => deleteUser (user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
                <MenuItem value="User ">User </MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserDialog(false)}>Cancel</Button>
            <Button onClick={saveUser }>{isEditing ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default UserRoleManagement;