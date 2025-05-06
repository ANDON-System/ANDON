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
    Divider,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ display: 'flex', height: '100vh', flexDirection: isMobile ? 'column' : 'row' }}>
            <DepartmentSidebar />
            <Box sx={{ flexGrow: 1, p: isMobile ? 2 : 3, overflowY: 'auto' }}>
                <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', mb: 2 }}>
                    <Toolbar disableGutters>
                        <Typography variant={isMobile ? 'h5' : 'h4'} color="secondary" sx={{ flexGrow: 1 }}>
                            Task Assignment and Tracking
                        </Typography>
                    </Toolbar>
                </AppBar>

                <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Table stickyHeader>
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
                                <TableRow key={task.id} hover>
                                    <TableCell>{task.leader}</TableCell>
                                    <TableCell sx={{ wordBreak: 'break-word' }}>{task.description}</TableCell>
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
                                            size={isMobile ? 'small' : 'medium'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size={isMobile ? 'small' : 'medium'}
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
                            <Box>
                                <Typography gutterBottom><strong>Leader:</strong> {selectedTask.leader}</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography gutterBottom><strong>Task Description:</strong> {selectedTask.description}</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography gutterBottom><strong>Status:</strong> {selectedTask.status}</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography gutterBottom>
                                    <strong>Details:</strong> This is some dummy text providing more details about the task related to the Onboarding Management System.
                                </Typography>
                            </Box>
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
