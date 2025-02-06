// import React from "react";
// import { useNavigate } from "react-router-dom";
// // import { Notification } from "../../types/notification";
// import "./Notifications.scss";
// import { INotification } from "../../entities/notification/notification";
// import axiosInstance from "../../utils/axiosConfig";
// // import { AppRootState } from "../../redux/store";
// // import { useAppSelector } from "../../hooks/hooks";

// interface NotificationListProps {
//   notifications: INotification[];
//   onClose: () => void;
// }

// export const NotificationList: React.FC<NotificationListProps> = ({
//   notifications,
//   onClose,
// }) => {
//   //   const { userInfo } = useAppSelector((state: AppRootState) => state.user);
//   const navigate = useNavigate();

//   const handleNotificationClick = (notification: INotification) => {
//     if (notification.onclickUrl) {
//       navigate(notification.onclickUrl);
//     }
//     markAsRead(notification._id!);
//     onClose();
//   };

//   const markAsRead = async (id: string) => {
//     try {
//       //   await fetch(`/api/notifications/${id}/read`, {
//       //     method: "PATCH",
//       //     headers: {
//       //       "Content-Type": "application/json",
//       //     },
//       //   });
//       await axiosInstance.patch("/notification/" + id);
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   return (
//     <div className="notification-list">
//       <div className="notification-header">
//         <h3>Notifications</h3>
//         <button className="close-button" onClick={onClose}>
//           &times;
//         </button>
//       </div>

//       {notifications.length === 0 ? (
//         <div className="no-notifications">No notifications at this time</div>
//       ) : (
//         <div className="notifications-container">
//           {notifications.map((notification) => (
//             <div
//               key={notification._id}
//               className={`notification-item ${
//                 !notification.isRead ? "unread" : ""
//               }`}
//               onClick={() => handleNotificationClick(notification)}
//             >
//               <div className="notification-content">
//                 <h4>{notification.title}</h4>
//                 <p>{notification.message}</p>
//                 <span className="notification-time">
//                   {new Date(notification.createdAt).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
