import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip
} from '@mui/material';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer
} from 'recharts';
import AdminSidebar from '../../components/AdminSidebar';
import IssueTimelineChart from '../Admin/IssueTimeLineChart';
import axios from 'axios';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [issueCategories, setIssueCategories] = useState([]);
  const [issueStatusCounts, setIssueStatusCounts] = useState({
    open: 0,
    acknowledged: 0,
    inProgress: 0,
    escalated: 0,
    resolved: 0,
    completed: 0
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const statColors = ['#FF69B4', '#34A85A', '#FFC107', '#2196F3'];
  const issueStatusColors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#F86624', '#7209B7', '#2EC4B6'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        setLoading(true);
        setError(null);

        // Fetch users
        const usersRes = await axios.get('http://localhost:5000/api/users', { headers });
        setUsers(usersRes.data);

        // Fetch departments (users with role=department)
        const deptRes = await axios.get('http://localhost:5000/api/users?role=department', { headers });
        setDepartments(deptRes.data);

        // Fetch issue counts by status
        const statuses = ['open', 'acknowledged', 'in-progress', 'escalated', 'resolved', 'completed'];
        const issueCounts = {};

        await Promise.all(statuses.map(async (status) => {
          const response = await axios.get(`http://localhost:5000/api/issues?status=${status}`, { headers });
          let key = status.replace('-', '');
          if (key === 'inprogress') key = 'inProgress';
          issueCounts[key] = response.data.length;
        }));

        setIssueStatusCounts(issueCounts);

        // Fetch all issues
        const issuesRes = await axios.get('http://localhost:5000/api/issues', { headers });
        setIssues(issuesRes.data);

        // Calculate issue priority categories
        const categories = {};
        issuesRes.data.forEach(issue => {
          const priority = issue.priority || 'Undefined';
          categories[priority] = (categories[priority] || 0) + 1;
        });

        const categoryData = Object.entries(categories).map(([name, count]) => ({
          name,
          count
        }));

        setIssueCategories(categoryData);

      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const mainChartData = [
    { name: 'Users', value: users.length },
    { name: 'Issues', value: issues.length },
    { name: 'Departments', value: departments.length },
    { name: 'Team Leaders', value: users.filter(u => u.role === 'Manager').length }
  ];

  const issueStatusData = [
    { name: 'Open', value: issueStatusCounts.open || 0 },
    { name: 'Acknowledged', value: issueStatusCounts.acknowledged || 0 },
    { name: 'In Progress', value: issueStatusCounts.inProgress || 0 },
    { name: 'Escalated', value: issueStatusCounts.escalated || 0 },
    { name: 'Resolved', value: issueStatusCounts.resolved || 0 },
    { name: 'Completed', value: issueStatusCounts.completed || 0 }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#ff9800';
      case 'acknowledged': return '#2196f3';
      case 'in progress': return '#3f51b5';
      case 'escalated': return '#f44336';
      case 'resolved': return '#4caf50';
      case 'completed': return '#9c27b0';
      default: return '#9e9e9e';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading dashboard data...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex" }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" color="error">Error loading dashboard</Typography>
          <Typography>{error}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Dashboard Overview</Typography>

        {/* Stat Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: statColors[0] }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Users</Typography>
              <Typography variant="h4" sx={{ color: '#fff' }}>{users.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: statColors[1] }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Issues</Typography>
              <Typography variant="h4" sx={{ color: '#fff' }}>{issues.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: statColors[2] }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Departments</Typography>
              <Typography variant="h4" sx={{ color: '#fff' }}>{departments.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: statColors[3] }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Team Leaders</Typography>
              <Typography variant="h4" sx={{ color: '#fff' }}>{users.filter(u => u.role === 'Manager').length}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Issues List and Timeline side by side */}
        <Grid container spacing={3}>
          {/* Issues Table */}
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ mb: 2 }}>Issues List</Typography>
            <Paper>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Updated At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {issues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(issue => (
                      <TableRow key={issue._id}>
                        <TableCell>{issue._id}</TableCell>
                        <TableCell>{issue.title}</TableCell>
                        <TableCell>
                          <Chip
                            label={issue.priority}
                            sx={{
                              backgroundColor: getPriorityColor(issue.priority),
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={issue.status}
                            sx={{
                              backgroundColor: getStatusColor(issue.status),
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                        <TableCell>{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(issue.updatedAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={issues.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>

          {/* Issue Timeline Chart */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ mb: 2 }}>Issue Timeline</Typography>
            <Paper sx={{ p: 2, height: 400 }}>
              <IssueTimelineChart issues={issues} />
            </Paper>
          </Grid>
        </Grid>

        {/* Pie Charts */}
        {/* <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>Issues Status Distribution</Typography>
            <Paper sx={{ p: 2, height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={issueStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    fill="#8884d8"
                    label
                  >
                    {issueStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={issueStatusColors[index % issueStatusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>Issues Priority Distribution</Typography>
            <Paper sx={{ p: 2, height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="count"
                    isAnimationActive={false}
                    data={issueCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    fill="#82ca9d"
                    label
                  >
                    {issueCategories.map((entry, index) => (
                      <Cell key={`cell-priority-${index}`} fill={statColors[index % statColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid> */}
      </Box>
    </Box>
  );
}

export default AdminDashboard;
