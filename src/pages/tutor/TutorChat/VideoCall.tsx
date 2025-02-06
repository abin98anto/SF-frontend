// VideoCall.tsx
import React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface VideoCallProps {
  selectedChat: any;
  currentUserId: string;
  onEndCall: () => void;
}

function generateRoomID(chatId: string, userId: string, studentId: string) {
  // Remove any special characters and create a clean string
  const cleanChatId = chatId.toString().replace(/[^a-zA-Z0-9]/g, "");
  const cleanUserId = userId.toString().replace(/[^a-zA-Z0-9]/g, "");
  const cleanStudentId = studentId.toString().replace(/[^a-zA-Z0-9]/g, "");

  // Take first 8 characters from each ID to keep room ID shorter
  return `room${cleanChatId.slice(0, 8)}${cleanUserId.slice(
    0,
    8
  )}${cleanStudentId.slice(0, 8)}`;
}

function generateUserName(userId: string, name: string = "") {
  // Create a clean username without special characters
  const cleanUserId = userId.toString().replace(/[^a-zA-Z0-9]/g, "");
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, "");
  return `user${cleanUserId.slice(0, 8)}${cleanName ? "_" + cleanName : ""}`;
}

const VideoCall: React.FC<VideoCallProps> = ({
  selectedChat,
  currentUserId,
  onEndCall,
}) => {
  const roomID = generateRoomID(
    selectedChat._id,
    currentUserId,
    selectedChat.studentId._id
  );

  const userName = generateUserName(currentUserId);

  const myMeeting = async (element: HTMLDivElement) => {
    // generate Kit Token
    const appID = 322862419;
    const serverSecret = "ce900a4fff13b348f4a9d75af743a64c";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userName,
      userName
    );

    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Call Link",
          url: window.location.origin + `/video-call?roomID=${roomID}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
      onLeaveRoom: () => {
        onEndCall();
      },
    });
  };

  return (
    <div className="tutC-video-call">
      <div ref={myMeeting} className="tutC-video-container" />
    </div>
  );
};

export default VideoCall;
