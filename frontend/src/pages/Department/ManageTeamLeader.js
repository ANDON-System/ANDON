import React, { useState } from "react";
import {
    Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Button,
    Select, MenuItem, FormControl, InputLabel, Grid, Box, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material"; // Import icons
import DepartmentSidebar from "../../components/DepartmentSidebar";

const ManageTeamLeaders = () => {
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [users, setUsers] = useState([
        { _id: "101", name: "John Doe" },
        { _id: "102", name: "Jane Smith" },
        { _id: "103", name: "Mark Johnson" },
    ]);
    const [teams, setTeams] = useState([
        { _id: "201", name: "Production Team" },
        { _id: "202", name: "Quality Team" },
        { _id: "203", name: "Manufacturing Team" },
        { _id: "204", name: "Logistics Team" },
        { _id: "205", name: "Safety Team" },
        { _id: "206", name: "Maintenance Team" },
    ]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [editingLeader, setEditingLeader] = useState(null);

    const handleAssign = () => {
        if (!selectedUser || !selectedTeam) return alert("Please select both user and team!");

        const user = users.find(user => user._id === selectedUser);
        const team = teams.find(team => team._id === selectedTeam);

        if (!user || !team) return alert("Invalid selection!");

        if (editingLeader) {
            setTeamLeaders(prevLeaders =>
                prevLeaders.map(leader =>
                    leader._id === editingLeader._id
                        ? { ...leader, name: user.name, team: team }
                        : leader
                )
            );
            setEditingLeader(null);
            alert("Team Leader updated!");
        } else {
            const newLeader = { _id: Date.now().toString(), name: user.name, team };
            setTeamLeaders(prevLeaders => [...prevLeaders, newLeader]);
            alert("Team Leader assigned Successfully!");
        }

        setSelectedUser("");
        setSelectedTeam("");
    };

    const handleEdit = (leader) => {
        setEditingLeader(leader);
        setSelectedUser(users.find(user => user.name === leader.name)?._id || "");
        setSelectedTeam(leader.team._id);
    };

    const handleDelete = (leaderId) => {
        setTeamLeaders(prevLeaders => prevLeaders.filter(leader => leader._id !== leaderId));
        alert("Team Leader removed!");
    };

    return (
        <Box sx={{ display: "flex", backgroundColor: "#F4F1EA", minHeight: "100vh", padding: "20px" }}>
            <DepartmentSidebar />
            <Container>
                <Typography variant="h4" gutterBottom color="secondary">Manage Team Leaders</Typography>

                <Grid container spacing={2} alignItems="center" sx={{ marginBottom: "20px" }}>
                    <Grid item xs={5}>
                        <FormControl fullWidth sx={{ backgroundColor: "#FAFAF5", borderRadius: "8px" }}>
                            <InputLabel>Select User</InputLabel>
                            <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                                <MenuItem value="">Select User</MenuItem>
                                {users.map(user => (
                                    <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={5}>
                        <FormControl fullWidth sx={{ backgroundColor: "#FAFAF5", borderRadius: "8px" }}>
                            <InputLabel>Select Team</InputLabel>
                            <Select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                                <MenuItem value="">Select Team</MenuItem>
                                {teams.map(team => (
                                    <MenuItem key={team._id} value={team._id}>{team.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="secondary" fullWidth onClick={handleAssign}>
                            {editingLeader ? "Update" : "Assign"}
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#EDEAE5" }}>
                            <TableRow>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell><b>Team</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teamLeaders.map(leader => (
                                <TableRow key={leader._id}>
                                    <TableCell>{leader.name}</TableCell>
                                    <TableCell>{leader.team?.name || "No Team Assigned"}</TableCell>
                                    <TableCell>
                                        <IconButton color="secondary" onClick={() => handleEdit(leader)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(leader._id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default ManageTeamLeaders;
