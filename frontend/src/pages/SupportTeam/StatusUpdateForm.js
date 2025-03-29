import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem } from "@mui/material";

const StatusUpdateForm = ({ open, onClose, onUpdate, issue }) => {
  const [status, setStatus] = useState(issue.status);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Status</DialogTitle>
      <DialogContent>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onUpdate(issue.id, status)} color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusUpdateForm;
