import { useState } from "react";
import { markNotificationAsRead } from "../../services/notificationService";
import { useNotifications } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.scss";
import { INotification } from "../../entities/notification/notification";

const NotificationBell = () => {
  const { notifications, unreadCount, setNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification._id!);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      );
    }
    if (notification.onclickUrl) {
      navigate(notification.onclickUrl);
    }
    setIsOpen(false);
  };

  return (
    <div className="notification-container">
      <div className="bell-icon" onClick={() => setIsOpen(!isOpen)}>
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${
                  !notification.isRead ? "unread" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <p className="title">{notification.title}</p>
                <p className="message">{notification.message}</p>
              </div>
            ))
          ) : (
            <p className="no-notifications">No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
