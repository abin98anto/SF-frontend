"use client";

import { useRef } from "react";
import "./video-player.scss";

interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="videoContainer">
      <video ref={videoRef} className="video" controls crossOrigin="anonymous">
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
