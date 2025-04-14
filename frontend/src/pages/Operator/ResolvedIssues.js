import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Warning as WarningIcon, Error as ErrorIcon } from '@mui/icons-material';
import OperatorSidebar from '../../components/OperatorSidebar';
import axios from 'axios';

const ResolvedIssues = () => {
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [workstationStatus, setWorkstationStatus] = useState('Green');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentIssueToRaise, setCurrentIssueToRaise] = useState(null);
  const [issuePriority, setIssuePriority] = useState('Low');
  const [issueDepartments, setIssueDepartments] = useState([]);
  const [issueDescription, setIssueDescription] = useState('');
  const [issueDetails, setIssueDetails] = useState(null);
  const [error, setError] = useState('');

  const PRIORITY_COLORS = {
    Low: { main: '#4caf50', light: '#e8f5e9' },
    Medium: { main: '#ff9800', light: '#fff3e0' },
    High: { main: '#f44336', light: '#ffebee' }
  };

  const DEPARTMENTS = [
    'Production Team',
    'Quality Team',
    'Manufacturing Team',
    'Logistics Team',
    'Safety Team',
    'Maintenance Team'
  ];

  useEffect(() => {
    const fetchResolvedIssues = async () => {
      try {
        const response1 = await axios.get("http://localhost:5000/api/issues/resolved");
        const response2 = await axios.get("http://localhost:5000/api/issues/completed");
        setResolvedIssues([...response1.data, ...response2.data]);
      } catch (error) {
        console.error("Error fetching resolved issues:", error);
      }
    };

    fetchResolvedIssues();
  }, []);

  const updateWorkstationStatus = () => {
    const highCount = resolvedIssues.filter(issue => issue.priority === 'High').length;
    const mediumCount = resolvedIssues.filter(issue => issue.priority === 'Medium').length;

    if (highCount > 0) {
      setWorkstationStatus('Red');
    } else if (mediumCount > 0) {
      setWorkstationStatus('Yellow');
    } else {
      setWorkstationStatus('Green');
    }
  };

  useEffect(() => {
    updateWorkstationStatus();
  }, [resolvedIssues]);

  const updateIssue = async () => {
    if (issueDepartments.length > 0 && issueDescription) {
      try {
        const existingIssueResponse = await axios.get(`http://localhost:5000/api/issues/${currentIssueToRaise._id}`);
        const existingIssue = existingIssueResponse.data;

        await axios.post(`http://localhost:5000/api/issues/old`, {
          originalIssueId: existingIssue._id,
          title: existingIssue.title,
          description: existingIssue.description,
          priority: existingIssue.priority,
          status: existingIssue.status,
          departments: existingIssue.departments,
          resolution: existingIssue.resolution,
          machine_id: existingIssue.machine_id,
          sla: existingIssue.sla,
          createdAt: existingIssue.createdAt,
          updatedAt: existingIssue.updatedAt
        });

        const updatedIssueData = {
          title: currentIssueToRaise.title,
          description: issueDescription,
          priority: issuePriority,
          departments: issueDepartments,
          machine_id: currentIssueToRaise.machine_id,
          sla: currentIssueToRaise.sla,
          status: "Updated"
        };

        const response = await axios.put(`http://localhost:5000/api/issues/${currentIssueToRaise._id}`, updatedIssueData);
        console.log("Response", response);
        setResolvedIssues(prev => prev.map(issue => issue._id === response.data._id ? response.data : issue));
        setIsIssueModalOpen(false);
        setIssueDescription('');
        setIssueDepartments([]);
        alert('Issue updated successfully.');
      } catch (error) {
        console.error("Error updating issue:", error);
        setError("Failed to update issue: " + (error.response ? error.response .data.details || error.message : error.message));
      }
    } else {
      setError("Please fill in all required fields.");
    }
  };

  const fetchIssueDetails = async (issueId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/issues/${issueId}`);
      const oldResponse = await axios.get(`http://localhost:5000/api/issues/old/${issueId}`);
      const oldIssuesData = oldResponse.data.length > 0 ? oldResponse.data : [];
      setIssueDetails({ new: response.data, old: oldIssuesData });
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching issue details:", error);
      setError("Failed to fetch issue details: " + error.message);
    }
  };

  const handleViewIssue = (issue) => {
    setCurrentIssueToRaise(issue);
    setIssuePriority(issue.priority);
    setIssueDepartments(issue.departments);
    setIssueDescription(issue.description);
    setIsIssueModalOpen(true);
  };

  const handleViewDetails = (issue) => {
    fetchIssueDetails(issue._id);
  };

  const handleDepartmentToggle = (department) => {
    setIssueDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <OperatorSidebar />
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Resolved Issues
          </Typography>
          <Chip
            icon={
              workstationStatus === 'Green' ? <CheckCircleIcon color="success" /> :
                workstationStatus === 'Yellow' ? <WarningIcon color="warning" /> :
                  <ErrorIcon color="error" />
            }
            label={`${workstationStatus} Status`}
            color={
              workstationStatus === 'Green' ? 'success' :
                workstationStatus === 'Yellow' ? 'warning' : 'error'
            }
            variant="outlined"
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {resolvedIssues.length === 0 ? (
              <Alert severity="info">No resolved issues</Alert>
            ) : (
              <Grid container spacing={2}>
                {resolvedIssues.map(issue => (
                  <Grid item xs={12} sm={6} md={4} key={issue._id}>
                    <Card
                      sx={{
                        backgroundColor: PRIORITY_COLORS[issue.priority].light,
                        border: `1px solid ${PRIORITY_COLORS[issue.priority].main}`,
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label={issue.priority}
                            size="small"
                            sx={{
                              backgroundColor: PRIORITY_COLORS[issue.priority].main,
                              color: 'white'
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Resolved at: {new Date(issue.updatedAt).toLocaleString()}
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Departments:</strong> {issue.departments ? issue.departments.join(', ') : 'No departments assigned'}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Original Description:</strong> {issue.description}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2 }}>
                          <strong>Resolution:</strong> {issue.resolution}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleViewIssue(issue)}
                          >
                            Raise Issue
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewDetails(issue)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        <Dialog open={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} fullWidth maxWidth="md">
  <DialogTitle> Issue Details</DialogTitle>
  <DialogContent>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Field</strong></TableCell>
            <TableCell><strong>Current Value</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issueDetails ? ( // Check if issueDetails is not null
            <>
              <TableRow>
                <TableCell>Issue ID</TableCell>
                <TableCell>#{issueDetails.new?._id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{issueDetails.new?.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Priority</TableCell>
                <TableCell>{issueDetails.new?.priority}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>{issueDetails.new?.status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Departments</TableCell>
                <TableCell>{issueDetails.new?.departments.join(', ') || 'No departments assigned'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created At</TableCell>
                <TableCell>{new Date(issueDetails.new?.createdAt).toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Updated At</TableCell>
                <TableCell>{new Date(issueDetails.new?.updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={2}>Loading issue details...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Old Issue Details</Typography>
      {issueDetails && issueDetails.old.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No old details available.</Typography>
      ) : (
        issueDetails && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Field</strong></TableCell>
                  <TableCell><strong>Old Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issueDetails.old.map((oldIssue, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>Old Description</TableCell>
                      <TableCell>{oldIssue.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Old Priority</TableCell>
                      <TableCell>{oldIssue.priority}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Old Status</TableCell>
                      <TableCell>{oldIssue.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Old Departments</TableCell>
                      <TableCell>{oldIssue.departments.join(', ') || 'No departments assigned'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Old Created At</TableCell>
                      <TableCell>{new Date(oldIssue.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Old Updated At</TableCell>
                      <TableCell>{new Date(oldIssue.updatedAt).toLocaleString()}</TableCell>
                    </TableRow>
                    <Divider sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </TableContainer>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
  </DialogActions>
</Dialog>

        <Dialog open={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Update Issue</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography>Machine ID</Typography>
                <TextField
                  value={currentIssueToRaise?.machine_id}
                  disabled
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <Box>
                <Typography>SLA</Typography>
                <TextField
                  value={currentIssueToRaise?.sla}
                  disabled
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <Box>
                <Typography>Issue Priority</Typography>
                <Stack direction="row" spacing={2}>
                  {Object.keys(PRIORITY_COLORS).map(priority => (
                    <Chip
                      key={priority}
                      label={priority}
                      clickable
                      color={priority === issuePriority ? 'primary' : 'default'}
                      onClick={() => setIssuePriority(priority)}
                      sx={{
                        backgroundColor: PRIORITY_COLORS[priority].light,
                        color: PRIORITY_COLORS[priority].main
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography>Departments to Notify</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {DEPARTMENTS.map(department => (
                    <Chip
                      key={department}
                      label={department}
                      clickable
                      color={issueDepartments.includes(department) ? 'primary' : 'default'}
                      onClick={() => handleDepartmentToggle(department)}
                    />
                  ))}
                </Stack>
              </Box>

              <TextField
                label="Issue Description"
                multiline
                rows={4}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                fullWidth
                variant="outlined"
              />
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
            <Button
              onClick={updateIssue}
              variant="contained"
              color="primary"
              disabled={issueDepartments.length === 0 || !issueDescription}
            >
              Update Issue
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ResolvedIssues;