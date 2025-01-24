export default interface Messages {
  senderId: string;
  recieverId: string;
  content?: string;
  image?: string;
  createdAt: Date;
  isRead: boolean;
}
