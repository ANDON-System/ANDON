import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    IconButton,
    Stack,
    Typography,
    Box,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import AdminSidebar from '../../components/AdminSidebar';

const roles = ["admin", "department", "team_leader", "employee", "operator"];

function DepartmentManagement() {
    const [departments, setDepartments] = useState([]);
    const [departmentDialog, setDepartmentDialog] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    // Fetch users with role 'department' from the backend
    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users?role=department');
            setDepartments(response.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };


    useEffect(() => {
        fetchDepartments();
    }, []);

    const openDepartmentDialog = (department = {}) => {
        setCurrentItem(department);
        setIsEditing(!!department._id);
        setDepartmentDialog(true);
    };

    const saveDepartment = async () => {
        console.log("Current Item:", currentItem);
        try {
            const dataToSend = {
                ...currentItem,
                role: currentItem.role // Ensure the role is included in the data being sent
            };

            if (isEditing) {
                const response = await axios.put(`http://localhost:5000/api/users/${currentItem._id}`, dataToSend);
                console.log("Updated User:", response.data);
                setDepartments(departments.map(d => d._id === currentItem._id ? response.data : d));
            } else {
                const response = await axios.post('http://localhost:5000/api/users', dataToSend);
                console.log("Created User:", response.data);
                setDepartments([...departments, response.data]);
            }
            setDepartmentDialog(false);
            setCurrentItem({});
        } catch (error) {
            console.error("Error saving department:", error);
            alert("Failed to save department. Please try again.");
        }
    };

    const deleteDepartment = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            setDepartments(departments.filter(department => department._id !== id));
        } catch (error) {
            console.error("Error deleting department:", error);
        }
    };

    const exportData = () => {
        const jsonString = JSON.stringify(departments, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = href;
        link.download = 'departments_export.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <AdminSidebar />
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
                            start Icon={<DownloadIcon />}
                            onClick={exportData}
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
                                <TableCell align="left">Email ID</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments.map((department) => (
                                <TableRow key={department._id} hover>
                                    <TableCell align="left">{department.name}</TableCell>
                                    <TableCell align="left">{department.email}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton size="small" onClick={() => openDepartmentDialog(department)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => deleteDepartment(department._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Department Dialog */}
                <Dialog open={departmentDialog} onClose={() => setDepartmentDialog(false)}>
                    <DialogTitle>{isEditing ? 'Edit Department' : 'Add New Department'}</DialogTitle>
                    <DialogContent sx={{ width: { xs: '300px', sm: '400px' } }}>
                        <TextField
                            margin="dense"
                            label="Department Name"
                            fullWidth
                            value={currentItem.name || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Email ID"
                            fullWidth
                            value={currentItem.email || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, email: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Password"
                            fullWidth
                            type="password"
                            value={currentItem.password || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, password: e.target.value })}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Role</InputLabel>
                            <TextField
                                select
                                value={currentItem.role || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDepartmentDialog(false)}>Cancel</Button>
                        <Button onClick={saveDepartment} variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
}

export default DepartmentManagement;
