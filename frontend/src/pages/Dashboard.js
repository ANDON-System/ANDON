import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
    const [data, setData] = useState({
        totalDepartments: 0,
        totalTeamLeaders: 0,
        openIssues: 0,
        resolvedIssues: 0,
        recentActivities: [],
        pendingAssignments: []
    });

    useEffect(() => {
        axios.get("http://localhost:5000/api/dashboard")
            .then(response => setData(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Dashboard Overview
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: "center" }}>
                            <Typography variant="h6">Total Departments</Typography>
                            <Typography variant="h4">{data.totalDepartments}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: "center" }}>
                            <Typography variant="h6">Total Team Leaders</Typography>
                            <Typography variant="h4">{data.totalTeamLeaders}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: "center" }}>
                            <Typography variant="h6">Open Issues</Typography>
                            <Typography variant="h4">{data.openIssues}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: "center" }}>
                            <Typography variant="h6">Resolved Issues</Typography>
                            <Typography variant="h4">{data.resolvedIssues}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">Recent Activities</Typography>
                            <ul>
                                {data.recentActivities.length > 0 ? (
                                    data.recentActivities.map((activity, index) => <li key={index}>{activity}</li>)
                                ) : (
                                    <li>No recent activities</li>
                                )}
                            </ul>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">Pending Assignments</Typography>
                            <ul>
                                {data.pendingAssignments.length > 0 ? (
                                    data.pendingAssignments.map((assignment, index) => <li key={index}>{assignment}</li>)
                                ) : (
                                    <li>No pending assignments</li>
                                )}
                            </ul>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
