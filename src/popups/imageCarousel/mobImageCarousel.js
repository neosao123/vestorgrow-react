import React, { useState, useEffect, useContext } from "react";
// import VideoImageThumbnail from 'react-video-thumbnail-image';
import ReactPlayer from "react-player";
import OwlCarousel from "react-owl-carousel";
const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];
export default function MobImageCarousel({ onClose, mediaFiles, imageIdx }) {
  const [mediaFile, setMediaFile] = useState(mediaFiles);
  return (
    <>
      <div className="modal modal-custom_Zindex" style={{ display: "block" }}>
        <div className="vertical-alignment-helper position-relative-class">
          {/* <div className="closeBtnPositionCustom">
            <button type="button" className="btn-close btn-close-inner-custom" onClick={onClose} />
          </div> */}
          <div className="vertical-align-center">
            <div className="createPostModel modal-dialog imageCarouselModel modal-xl model-dialog-custom model-dialog-custom-mobile">
              <div className="modal-content p-3 padding-zero">
                <div className="closeBtnPositionCustom display_none-custom">
                  <button type="button" className="btn-close btn-close-inner-custom" onClick={onClose} />
                </div>
                <div className=" d-flex align-items-center h-100">
                  <OwlCarousel
                    className="owl-carousel owl-theme gallerySlider gallerySliderCustom"
                    loop={false}
                    margin={0}
                    dots={true}
                    nav={true}
                    startPosition={imageIdx}
                    navText={[
                      "<div class='carousel-right-btn-custom'><i class='fa-solid fa-angle-left'></i></div>",
                      "<div class='carousel-right-btn-custom'><i class='fa-solid fa-angle-right'></i></div>",
                    ]}
                    responsive={{
                      0: {
                        items: 1,
                      },
                      600: {
                        items: 1,
                      },
                      1000: {
                        items: 1,
                      },
                    }}
                  >
                    {mediaFile.map((item, idx) => {
                      return (
                        <div className="item" key={idx}>
                          <div className="galleryImg galleryImgCustom galleryImgCustom-mobile">
                            {isImage.includes(item.type.split("/").pop()) ? (
                              <img src={item.url} alt="gallery" className="img-fluid" />
                            ) : (
                              <>
                                <div className="position-relative postCustomLongImgpx" style={{ background: "#000" }}>
                                  {/* {playVideo ? */}
                                  <ReactPlayer
                                    width="100vw"
                                    height="100%"
                                    controls={true}
                                    url={item.url}
                                    onReady={() => console.log("ready")}
                                  />
                                  {/* :
                                                                        <>
                                                                            <VideoImageThumbnail
                                                                                videoUrl={item}
                                                                                // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                                                                // width={120}
                                                                                // height={80}
                                                                                alt="video"
                                                                            />
                                                                            <div className="overLay">
                                                                                <span className="overLayCustom"><i className="fa-solid fa-film"></i></span>
                                                                            </div>
                                                                        </>} */}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </OwlCarousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show modal-backdrop-black show-black "></div>
      <div className="closeBtnPositionCustom closeBtnPositionCustom-fixed">
        {/* <button type="button" className="btn-close btn-close-inner-custom" onClick={onClose} /> */}
        <button
          type="button"
          class="btn-close btn-close-white btn-close-inner-custom"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
    </>
  );
}
