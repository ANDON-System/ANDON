import React, { useState } from 'react';
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

function IssueCategory() {
    // Mock data for demonstration
    const mockIssueCategories = [
        { id: 1, name: 'Equipment Failure', escalationTime: 10, assignTo: 'Support' },
        { id: 2, name: 'Material Shortage', escalationTime: 15, assignTo: 'Supervisor' },
        { id: 3, name: 'Quality Issue', escalationTime: 5, assignTo: 'Support' }
    ];

    // State declarations
    const [issueCategories, setIssueCategories] = useState(mockIssueCategories);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    // Issue category functions
    const openCategoryDialog = (category = {}) => {
        setCurrentItem(category);
        setIsEditing(!!category.id);
        setCategoryDialog(true);
    };

    const saveCategory = () => {
        if (isEditing) {
            setIssueCategories(issueCategories.map(c => c.id === currentItem.id ? currentItem : c));
        }
        setCategoryDialog(false);
        setCurrentItem({});
    };

    const deleteCategory = (id) => {
        setIssueCategories(issueCategories.filter(category => category.id !== id));
    };

    // Data export function
    const exportData = () => {
        const jsonString = JSON.stringify(issueCategories, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = href;
        link.download = 'issue_categories_export.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <AdminSidebar/>
            <Paper sx={{ p: 2, width: '100%', minHeight: 'calc(100vh - 112px)' }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Issue Categories & Escalation Rules</Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={exportData}
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
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {issueCategories.map((category) => (
                                <TableRow key={category.id} hover>
                                    <TableCell align="left">{category.name}</TableCell>
                                    <TableCell align="left">{category.escalationTime}</TableCell>
                                    <TableCell align="left">{category.assignTo}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton size="small" onClick={() => openCategoryDialog(category)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => deleteCategory(category.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Category Dialog */}
                <Dialog open={categoryDialog} onClose={() => setCategoryDialog(false)}>
                    <DialogTitle>{isEditing ? 'Edit Category' : 'Category Details'}</DialogTitle>
                    <DialogContent sx={{ width: { xs: '300px', sm: '400px' } }}>
                        <TextField
                            margin="dense"
                            label="Category Name"
                            fullWidth
                            value={currentItem.name || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Escalation Time (minutes)"
                            type="number"
                            fullWidth
                            value={currentItem.escalationTime || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, escalationTime: parseInt(e.target.value, 10) })}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Default Assignment</InputLabel>
                            <Select
                                value={currentItem.assignTo || ''}
                                label="Default Assignment"
                                onChange={(e) => setCurrentItem({ ...currentItem, assignTo: e.target.value })}
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
            </Paper>
        </Box>
    );
}

export default IssueCategory;