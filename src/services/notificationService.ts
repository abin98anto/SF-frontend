import { INotification } from "../entities/notification/notification";
import axiosInstance from "../utils/axiosConfig";

export const fetchNotifications = async (): Promise<INotification[]> => {
  const response = await axiosInstance.get("/notification");
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  await axiosInstance.patch("/notification", { notificationId });
};
