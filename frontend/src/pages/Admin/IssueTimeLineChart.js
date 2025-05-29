import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

const status = 'Open';
const issueColor = '#34A85A'; // Color for Open status

function IssueTimelineChart() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchIssueTimelineData();
  }, []);

  const fetchIssueTimelineData = async () => {
    try {
      setLoading(true);

      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return startOfDay(date);
      });

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(`http://localhost:5000/api/issues?status=${status}`, { headers });
      if (!response.ok) throw new Error(`Failed to fetch issues for ${status}`);
      const issues = await response.json();

      const processedData = dates.map((date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const displayDate = format(date, 'EEE, MMM d');

        const count = issues.filter(issue => {
          const issueDate = format(new Date(issue.createdAt), 'yyyy-MM-dd');
          return issueDate === dateStr;
        }).length;

        return {
          date: displayDate,
          open: count
        };
      });

      setChartData(processedData);
    } catch (err) {
      console.error('Error fetching issue timeline data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography variant="body1" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={8} sx={{ p: 4, borderRadius: '10px', height: '400px' }}>
      <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
        Open Issues Timeline (Last 7 Days)
      </Typography>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12, fill: "#555", angle: -45 }}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} />
          <Tooltip
            contentStyle={{
              fontSize: 14,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Bar
            dataKey="open"
            name="Open"
            fill={issueColor}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default IssueTimelineChart;