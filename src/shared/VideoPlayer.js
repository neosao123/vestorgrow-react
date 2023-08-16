import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

function VideoPlayer({ videoUrl, setVideoUrl }) {
  console.log("video", videoUrl);
  // const [url, setUrl] = useState(null)
  // useEffect(() => {
  //     setUrl(videoUrl)
  // }, [videoUrl])
  return (
    <>
      <div className="modal" id="sendModal" style={{ display: "block" }}>
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div
              className="followModel "
              style={{ width: "70%", margin: "50px auto" }}
            >
              <div className="modal-content">
                <button
                  onClick={() => {
                    setVideoUrl(null);
                  }}
                  className="vd-btn-custom"
                  type="button"
                >
                  x
                </button>

                <ReactPlayer
                  width="100%"
                  height="100%"
                  controls={true}
                  url={videoUrl}
                  onReady={() => console.log("ready")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </>
  );
}
export default VideoPlayer;
