import axiosInstance from "./axiosConfig";

const API_URL = import.meta.env.VITE_BASE_URL;

export const notificationService = {
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const response = await axiosInstance.get(
      `${API_URL}/notification/${userId}`
    );
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await axiosInstance.patch(
      `${API_URL}/notifications/${notificationId}`
    );
    return response.data;
  },
};
