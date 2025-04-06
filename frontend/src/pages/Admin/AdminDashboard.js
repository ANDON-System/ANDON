import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography
} from '@mui/material';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import AdminSidebar from '../../components/AdminSidebar';

function AdminDashboard() {
  // Mock data for demonstration
  const mockUsers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Operator', department: 'Production' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Supervisor', department: 'Assembly' },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'Support', department: 'Maintenance' },
    { id: 4, name: 'Laura Taylor', email: 'laura@example.com', role: 'Manager', department: 'Quality Control' }
  ];

  const mockIssueCategories = [
    { id: 1, name: 'Equipment Failure', escalationTime: 10, assignTo: 'Support' },
    { id: 2, name: 'Material Shortage', escalationTime: 15, assignTo: 'Supervisor' },
    { id: 3, name: 'Quality Issue', escalationTime: 5, assignTo: 'Support' }
  ];

  const mockDepartments = [
    { id: 1, name: 'Production', manager: 'Laura Taylor', location: 'Building A' },
    { id: 2, name: 'Assembly', manager: 'Sarah Johnson', location: 'Building B' },
    { id: 3, name: 'Maintenance', manager: 'Mike Chen', location: 'Building A' },
    { id: 4, name: 'Quality Control', manager: 'Laura Taylor', location: 'Building C' }
  ];

  // State declarations
  const [users, setUsers] = useState(mockUsers);
  const [issueCategories, setIssueCategories] = useState(mockIssueCategories);
  const [departments, setDepartments] = useState(mockDepartments);

  // Color palette
  const colors = ['#FF69B4', '#34A85A', '#FFC107', '#2196F3'];

  // Data for the pie chart
  const data = [
    { name: 'Users', value: users.length },
    { name: 'Issues', value: issueCategories.length },
    { name: 'Departments', value: departments.length },
    { name: 'Team Leaders', value: users.filter(user => user.role === 'Manager').length } // Assuming Managers are Team Leaders
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Dashboard Overview</Typography>
        {/* Dashboard Statistics */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: colors[0] }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Number of Users</Typography>
              <Typography variant="h4" sx={{ color: '#fff' }}>{users.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: colors[1] }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Number of Issues</Typography>
              <Typography variant="h4" sx={{ color: '#fff' }}>{issueCategories.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: colors[2] }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Number of Departments</Typography>
              <Typography variant="h4" sx={{ color: '#fff' }}>{departments.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: colors[3] }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Number of Team Leaders</Typography>
              <Typography variant="h4" sx={{ color: '#fff' }}>{users.filter(user => user.role === 'Manager').length}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Pie Chart */}
        <Box sx={{ mt: 4 }}>
          <PieChart width={600} height={300}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;