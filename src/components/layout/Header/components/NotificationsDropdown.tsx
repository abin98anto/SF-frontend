import type React from "react";
import {
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

interface NotificationsDropdownProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  anchorEl,
  onClose,
  notifications,
}) => {
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <List sx={{ width: 300, maxHeight: 400, overflow: "auto" }}>
        {notifications.length === 0 ? (
          <ListItem>
            <ListItemText primary="No new notifications" />
          </ListItem>
        ) : (
          notifications.map((notification) => (
            <ListItem key={notification.id}>
              <ListItemText
                primary={notification.message}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.createdAt).toLocaleString()}
                  </Typography>
                }
              />
            </ListItem>
          ))
        )}
      </List>
    </Popover>
  );
};

export default NotificationsDropdown;
