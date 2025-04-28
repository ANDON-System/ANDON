import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Paper, Typography, Avatar, Stack } from "@mui/material";
import DepartmentSidebar from "../../components/DepartmentSidebar";
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { blue, green, orange, red } from "@mui/material/colors";

const DepartmentDashboard = () => {
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

    const cards = [
        {
            title: "Total Departments",
            value: data.totalDepartments,
            icon: <GroupsIcon />,
            color: blue[500]
        },
        {
            title: "Total Team Leaders",
            value: data.totalTeamLeaders,
            icon: <AssignmentIcon />,
            color: green[500]
        },
        {
            title: "Open Issues",
            value: data.openIssues,
            icon: <BugReportIcon />,
            color: orange[500]
        },
        {
            title: "Resolved Issues",
            value: data.resolvedIssues,
            icon: <CheckCircleIcon />,
            color: red[500]
        }
    ];

    return (
        <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
            <DepartmentSidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    Dashboard Overview
                </Typography>

                <Grid container spacing={3}>
                    {cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper 
                                elevation={4} 
                                sx={{
                                    p: 3, 
                                    textAlign: "center", 
                                    borderRadius: 4, 
                                    bgcolor: "#fff",
                                    transition: "transform 0.3s",
                                    "&:hover": { transform: "scale(1.05)" }
                                }}
                            >
                                <Stack spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: card.color, width: 56, height: 56 }}>
                                        {card.icon}
                                    </Avatar>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h4" color="text.primary">
                                        {card.value}
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Recent Activities
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                                {data.recentActivities.length > 0 ? (
                                    data.recentActivities.map((activity, index) => (
                                        <Typography component="li" key={index} sx={{ mb: 1 }}>
                                            {activity}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography component="li" color="text.secondary">
                                        No recent activities
                                    </Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Pending Assignments
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                                {data.pendingAssignments.length > 0 ? (
                                    data.pendingAssignments.map((assignment, index) => (
                                        <Typography component="li" key={index} sx={{ mb: 1 }}>
                                            {assignment}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography component="li" color="text.secondary">
                                        No pending assignments
                                    </Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default DepartmentDashboard;
