import React, { useState, useEffect, useContext } from "react";
import ReactPlayer from "react-player";
import OwlCarousel from "react-owl-carousel";
import "./imgcarousel.css";

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];
export default function ImageCarousel({ onClose, mediaFiles, imageIdx }) {
  const [mediaFile, setMediaFile] = useState(mediaFiles);
  return (
    <>
      <div className="modal modal-custom_Zindex" style={{
        display: "block",
        marginTop:"40px"
      }}>
        <div className="vertical-alignment-helper position-relative-class">
          {/* <div className="closeBtnPositionCustom">
            <button type="button" className="btn-close btn-close-inner-custom" onClick={onClose} />
          </div> */}
          <div className="vertical-align-center">
            <div className="createPostModel modal-dialog imageCarouselModel modal-xl model-dialog-custom">
              <div className="modal-content p-3 padding-zero">
                <div className="closeBtnPositionCustom display_none-custom">
                  <button type="button" className="btn-close btn-close-inner-custom" onClick={onClose} />
                </div>
                <div className=" d-flex align-items-center h-100">
                  <OwlCarousel
                    className="owl-carousel owl-theme gallerySlider gallerySliderCustom"
                    loop={false}
                    margin={10}
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
                    {mediaFile &&
                      mediaFile.map((item, idx) => {

                        return (
                          <div className="item" key={idx}>
                            <div className="galleryImg galleryImgCustom">
                              {isImage.includes(item?.split(".").pop()) ? (
                                <img src={item} alt="gallery" className="img-fluid" />
                              ) : (
                                <>
                                  <div className="position-relative postCustomLongImgpx" style={{ background: "#000" }}>
                                    {console.log("ITEM:", item)}
                                    <ReactPlayer
                                      width="100%"
                                      height="100%"
                                      controls={true}
                                      url={item}
                                      playing={true}
                                      onReady={() => console.log("ready")}
                                    />
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
      <div className="modal-backdrop show modal-backdrop-black show-black image-dark-backdrop"></div>
      <div className="closeBtnPositionCustom closeBtnPositionCustom-fixed">
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
