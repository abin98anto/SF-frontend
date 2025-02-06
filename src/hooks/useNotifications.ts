import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/notificationService";
import { INotification } from "../entities/notification/notification";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    loadNotifications();
  }, []);

  return { notifications, unreadCount, setNotifications };
};
