import React, { useState } from "react";
import { IconButton, Badge, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationBell = ({ notifications }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {notifications.length === 0 ? (
          <MenuItem>No new notifications</MenuItem>
        ) : (
          notifications.map((notif, index) => <MenuItem key={index}>{notif.message}</MenuItem>)
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
