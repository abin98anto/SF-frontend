export interface IMessage {
  _id?: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  contentType: string;
  isRead: boolean;
  timestamp: Date;
}
