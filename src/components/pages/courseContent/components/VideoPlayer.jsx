import React from "react";

const VideoPlayer = ({ videoUrl, title }) => (
  <div className="mb-6">
    <iframe
      width="100%"
      height="400"
      src={videoUrl}
      title={title}
      frameBorder="0"
      allowFullScreen
    ></iframe>
  </div>
);

export default VideoPlayer;