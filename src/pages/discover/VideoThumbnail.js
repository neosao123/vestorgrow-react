import React, { useRef, useState } from 'react';
import VideoThumbnail from 'react-video-thumbnail';
import "./discover.css"
import { Spinner } from 'react-bootstrap';

const VideoThumbnailComp = ({ videoURL }) => {
  const videoRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);


  const handleLoadedData = () => {
    setLoading(false);
  }
  console.log("LOADING:", loading)


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
      {loading && <div className='mt-2' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spinner animation='border' />
      </div>}
      <video
        ref={videoRef}
        // controls 
        id="video_post"
        onLoadedMetadata={() => captureThumbnail()}
        onLoadedData={handleLoadedData}
      >
        <source src={videoURL} type="video/mp4" />
      </video>

      {/* {thumbnail && (
        <div
          className="grid-image"
          style={{
            backgroundImage: `url(${thumbnail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            border:"1px solid red"
          }}
        ></div>
      )} */}
    </div>
  );
};

export default VideoThumbnailComp;
