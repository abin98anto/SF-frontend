export default interface IMessages {
  senderId: string;
  recieverId: string;
  content?: string;
  image?: string;
  createdAt: Date;
  isRead: boolean;
}
