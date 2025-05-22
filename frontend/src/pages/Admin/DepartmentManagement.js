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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const roles = ["admin", "department", "team_leader", "employee", "operator"];

function DepartmentManagement() {
    const [departments, setDepartments] = useState([]);
    const [departmentDialog, setDepartmentDialog] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const [isEditing, setIsEditing] = useState(false);

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
        try {
            const dataToSend = {
                ...currentItem,
                role: currentItem.role
            };

            if (isEditing) {
                const response = await axios.put(`http://localhost:5000/api/users/${currentItem._id}`, dataToSend);
                setDepartments(departments.map(d => d._id === currentItem._id ? response.data : d));
            } else {
                const response = await axios.post('http://localhost:5000/api/users', dataToSend);
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
        const doc = new jsPDF();
        doc.text("Departments Report", 14, 15);

        const tableColumn = ["Department Name", "Email ID"];
        const tableRows = [];

        departments.forEach(dept => {
            const deptData = [
                dept.name || 'N/A',
                dept.email || 'N/A'
            ];
            tableRows.push(deptData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 10 }
        });

        doc.save("departments_report.pdf");
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* <AdminSidebar /> */}
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
                            onClick={() => setExportDialogOpen(true)}
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

                {/* Add/Edit Department Dialog */}
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

                {/* Export Dialog */}
                <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
                    <DialogTitle>Export Departments</DialogTitle>
                    <DialogContent>
                        <Typography>Would you like to download the department report as a PDF?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => {
                                exportData();
                                setExportDialogOpen(false);
                            }}
                            variant="contained"
                        >
                            Download
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
}

export default DepartmentManagement;
