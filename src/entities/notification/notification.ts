export type NotificationType = "MESSAGE" | "VIDEO_CALL";

export interface INotification {
  _id?: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  onclickUrl?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
