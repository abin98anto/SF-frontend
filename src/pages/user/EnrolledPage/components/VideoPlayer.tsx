import React from "react";

import "./VideoPlayer.scss";

interface VideoPlayerProps {
  videoUrl?: string;

  thumbnail?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, thumbnail }) => {
  return (
    <div className="video-container">
      {videoUrl ? (
        <video
          controls
          className="video-player"
          key={videoUrl} // Force reload when URL changes
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="thumbnail-container">
          <img
            src={thumbnail || "/placeholder.svg"}
            alt="Course thumbnail"
            className="thumbnail"
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
