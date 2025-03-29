import React from "react";
import { Card, CardContent, Typography, Button, Chip } from "@mui/material";

const IssueCard = ({ issue, onUpdateStatus, onEscalate }) => {
  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h6">{issue.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {issue.description}
        </Typography>
        <Chip 
          label={issue.status} 
          color={issue.status === "Resolved" ? "success" : "warning"} 
          sx={{ mt: 1 }} 
        />
        <Button onClick={() => onUpdateStatus(issue)} sx={{ ml: 2 }}>
          Update Status
        </Button>
        <Button onClick={() => onEscalate(issue)} color="error" sx={{ ml: 1 }}>
          Escalate
        </Button>
      </CardContent>
    </Card>
  );
};

export default IssueCard;
