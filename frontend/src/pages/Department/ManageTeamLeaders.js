import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Button,
    Select, MenuItem, FormControl, InputLabel, Grid, Box
} from "@mui/material";
import DepartmentSidebar from "../../components/DepartmentSidebar";

const ManageTeamLeaders = () => {
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");

    useEffect(() => {
        fetchTeamLeaders();
        fetchUsers();
        fetchTeams();
    }, []);

    const fetchTeamLeaders = async () => {
        try {
            const response = await axios.get("/api/team-leader/all", {
                headers: { Authorization: localStorage.getItem("token") }
            });
            setTeamLeaders(response.data);
        } catch (error) {
            console.error("Error fetching team leaders:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/employee/all", {
                headers: { Authorization: localStorage.getItem("token") }
            });
            setUsers(response.data.filter(user => user.role === "employee"));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get("/api/team/all", {
                headers: { Authorization: localStorage.getItem("token") }
            });
            setTeams(response.data);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    const assignTeamLeader = async () => {
        if (!selectedUser || !selectedTeam) return alert("Select user and team!");
        try {
            await axios.post("/api/team-leader/assign", { userId: selectedUser, teamId: selectedTeam }, {
                headers: { Authorization: localStorage.getItem("token") }
            });
            alert("Team Leader assigned successfully");
            fetchTeamLeaders();
        } catch (error) {
            console.error("Error assigning team leader:", error);
        }
    };

    const removeTeamLeader = async (userId) => {
        try {
            await axios.delete(`/api/team-leader/remove/${userId}`, {
                headers: { Authorization: localStorage.getItem("token") }
            });
            alert("Team Leader removed successfully");
            fetchTeamLeaders();
        } catch (error) {
            console.error("Error removing team leader:", error);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <DepartmentSidebar/>
            <Container>

                <Typography variant="h4" gutterBottom>Manage Team Leaders</Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5}>
                        <FormControl fullWidth>
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
                        <FormControl fullWidth>
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
                        <Button variant="contained" color="primary" fullWidth onClick={assignTeamLeader}>Assign</Button>
                    </Grid>
                </Grid>

                <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>Current Team Leaders</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teamLeaders.map(leader => (
                                <TableRow key={leader._id}>
                                    <TableCell>{leader.name}</TableCell>
                                    <TableCell>{leader.team?.name || "No Team Assigned"}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="secondary" onClick={() => removeTeamLeader(leader._id)}>
                                            Remove
                                        </Button>
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