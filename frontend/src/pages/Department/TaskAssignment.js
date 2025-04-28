import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Toolbar,
    Typography,
    AppBar,
    Box,
    Chip,
    Divider
} from '@mui/material';
import DepartmentSidebar from '../../components/DepartmentSidebar';

const TaskTracking = () => {
    const [tasks, setTasks] = useState([
        { id: 1, leader: 'Alice', description: 'Create onboarding checklist for new hires', status: 'Pending' },
        { id: 2, leader: 'Bob', description: 'Develop training materials for onboarding', status: 'Processing' },
        { id: 3, leader: 'Charlie', description: 'Implement feedback system for new employees', status: 'Resolved' },
    ]);

    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleClickOpen = (task) => {
        setSelectedTask(task);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTask(null);
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", margin: 0 }}>
            <DepartmentSidebar />
            <Box sx={{ flexGrow: 1, padding: 0, overflow: "hidden" }}>
                <AppBar position="static" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <Toolbar>
                        <Typography variant="h4" color="secondary" style={{ flexGrow: 1 }}>
                            Task Assignment and Tracking
                        </Typography>
                    </Toolbar>
                </AppBar>

                <TableContainer component={Paper} sx={{ marginTop: 0 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Leader Name</strong></TableCell>
                                <TableCell><strong>Task Description</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map(task => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.leader}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={task.status}
                                            color={
                                                task.status === 'Pending' ? 'warning' :
                                                task.status === 'Processing' ? 'info' :
                                                task.status === 'Resolved' ? 'success' :
                                                'default'
                                            }
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleClickOpen(task)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Task Details</DialogTitle>
                    <DialogContent dividers>
                        {selectedTask && (
                            <div>
                                <Typography gutterBottom><strong>Leader:</strong> {selectedTask.leader}</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography gutterBottom><strong>Task Description:</strong> {selectedTask.description}</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography gutterBottom><strong>Status:</strong> {selectedTask.status}</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography gutterBottom>
                                    <strong>Details:</strong> This is some dummy text providing more details about the task related to the Onboarding Management System.
                                </Typography>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default TaskTracking;
