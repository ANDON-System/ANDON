import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

const Notifications = ({ notifications }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8' }}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        {notifications && notifications.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No new notifications</Typography>
        ) : (
          <Stack spacing={2}>
            {notifications && notifications.map(notification => (
              <Box key={notification.id} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                <Typography variant="body2">{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">{notification.timestamp}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Notifications;