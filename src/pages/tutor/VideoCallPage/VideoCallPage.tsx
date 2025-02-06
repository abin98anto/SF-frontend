import React, { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useLocation, useNavigate } from "react-router-dom";

function generateUserName(userId: string, name: string = "") {
  const cleanUserId = userId.toString().replace(/[^a-zA-Z0-9]/g, "");
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, "");
  return `user${cleanUserId.slice(0, 8)}${cleanName ? "_" + cleanName : ""}`;
}

const VideoCallPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomID = queryParams.get("roomID");
    const userId = queryParams.get("userId");

    if (!roomID || !userId) {
      setError("Invalid call parameters");
      return;
    }

    const startCall = async (element: HTMLDivElement) => {
      try {
        const appID = 322862419;
        const serverSecret = "ce900a4fff13b348f4a9d75af743a64c";
        const userName = generateUserName(userId);
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userName,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        await zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: "Call Link",
              url: window.location.href,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: false,
          onLeaveRoom: () => {
            // Close the tab when call ends
            window.close();
            // Fallback if window.close() is blocked
            navigate("/chat");
          },
        });
      } catch (err) {
        setError("Failed to start video call");
        console.error("Video call error:", err);
      }
    };

    // Get container and validate it's a div element
    const container = document.getElementById("video-call-container");
    if (container instanceof HTMLDivElement) {
      startCall(container);
    } else {
      setError("Invalid video container element");
    }
  }, [location, navigate]);

  if (error) {
    return (
      <div className="video-call-error">
        <div className="error-message">{error}</div>
        <button onClick={() => window.close()}>Close</button>
      </div>
    );
  }

  return (
    <div className="video-call-page">
      <div id="video-call-container" className="video-container"></div>
    </div>
  );
};

export default VideoCallPage;
