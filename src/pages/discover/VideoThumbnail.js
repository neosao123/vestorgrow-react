import React, { useRef, useState } from 'react';
import VideoThumbnail from 'react-video-thumbnail';

const VideoThumbnailComp = () => {
  const videoRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);

  const captureThumbnail = () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const thumbnailUrl = canvas.toDataURL('image/png');
      setThumbnail(thumbnailUrl);
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        // controls
        width="400"
        onLoadedMetadata={() => captureThumbnail()}
      >
        <source src="your-video.mp4" type="video/mp4" />
      </video>

      {thumbnail && (
        <div>
          <h2>Thumbnail</h2>
          <img src={thumbnail} alt="Video Thumbnail" />
        </div>
      )}
    </div>
  );
};

export default VideoThumbnailComp;
