import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Button,
    Select, MenuItem, FormControl, InputLabel, Grid, Box, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DepartmentSidebar from "../../components/DepartmentSidebar";

const ManageTeamLeaders = () => {
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser , setSelectedUser ] = useState("");
    const [editingLeader, setEditingLeader] = useState(null);
    const [departmentName, setDepartmentName] = useState("");

    // Helper to parse JWT and get userId
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const payloadBase64 = token.split(".")[1];
            const payload = JSON.parse(atob(payloadBase64));
            return payload.userId || null;
        } catch (e) {
            console.error("Failed to parse token", e);
            return null;
        }
    };

    // Fetch logged-in user's department and username from session storage
    const loggedInDepartment = sessionStorage.getItem("department");
    const loggedInUsername = sessionStorage.getItem("username");

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                window.location.href = "/login"; // Redirect to login page
                return;
            }

            try {
                // Fetch all users with role 'employee'
                const response = await axios.get(`http://localhost:5000/api/users?role=employee`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Filter users based on the logged-in user's department and username
                const filteredUsers = response.data.filter(user => 
                    user.department === loggedInDepartment && user.name !== loggedInUsername
                );
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchTeamLeaders = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return; // Exit if no token
            }

            try {
                // Fetch all users with role 'team_leader' based on department
                const response = await axios.get(`http://localhost:5000/api/users?role=team_leader`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Filter team leaders based on the logged-in user's department
                const filteredLeaders = response.data.filter(leader => leader.department === loggedInDepartment);
                setTeamLeaders(filteredLeaders);
            } catch (error) {
                console.error("Error fetching team leaders:", error);
            }
        };

        fetchUsers();
        fetchTeamLeaders();
    }, [loggedInDepartment, loggedInUsername]);

    const handleAssign = async () => {
        if (!selectedUser ) return alert("Please select a user!");
        const user = users.find(user => user._id === selectedUser );
        if (!user) return alert("Invalid selection!");

        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/users/${user._id}`,
                { role: "team_leader" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.filter(u => u._id !== user._id));
            if (editingLeader) {
                setTeamLeaders(prevLeaders =>
                    prevLeaders.map(leader =>
                        leader._id === editingLeader._id ? { ...leader, name: user.name } : leader
                    )
                );
                setEditingLeader(null);
                alert("Team Leader updated!");
            } else {
                const newLeader = { _id: Date.now().toString(), name: user.name };
                setTeamLeaders(prevLeaders => [...prevLeaders, newLeader]);
                alert("Team Leader assigned!");
            }
            setSelectedUser ("");
        } catch (error) {console.error("Error assigning team leader:", error);
            alert("Failed to assign team leader.");
        }
    };

    const handleEdit = (leader) => {
        setEditingLeader(leader);
        setSelectedUser (users.find(user => user.name === leader.name)?._id || "");
    };

    const handleDelete = async (leaderId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/users/${leaderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeamLeaders(prevLeaders => prevLeaders.filter(leader => leader._id !== leaderId));
            alert("Team Leader removed!");
        } catch (error) {
            console.error("Error removing team leader:", error);
            if (error.response?.data?.message === "Token expired") {
                alert("Your session has expired. Please log in again.");
                localStorage.removeItem("token");
                window.location.href = "/";
            } else {
                alert("Failed to remove team leader.");
            }
        }
    };

    return (
        <Box sx={{ display: "flex", backgroundColor: "#F4F1EA", minHeight: "100vh", padding: "20px" }}>
            {/* <DepartmentSidebar /> */}
            <Container>
                <Typography variant="h4" gutterBottom color="secondary">Manage Team Leaders</Typography>

                <Grid container spacing={2} alignItems="center" sx={{ marginBottom: "20px" }}>
                    <Grid item xs={5}>
                        <FormControl fullWidth sx={{ backgroundColor: "#FAFAF5", borderRadius: "8px" }}>
                            <InputLabel>Select User</InputLabel>
                            <Select value={selectedUser } onChange={(e) => setSelectedUser (e.target.value)}>
                                <MenuItem value="">Select User</MenuItem>
                                {users.map(user => (
                                    <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
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
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teamLeaders.map(leader => (
                                <TableRow key={leader._id}>
                                    <TableCell>{leader.name}</TableCell>
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