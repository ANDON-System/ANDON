import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const EscalationModal = ({ open, onClose, onEscalate, issue }) => {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Escalate Issue</DialogTitle>
      <DialogContent>
        <TextField 
          label="Reason for Escalation" 
          fullWidth 
          multiline 
          rows={3} 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onEscalate(issue.id, reason)} color="error">Escalate</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EscalationModal;
