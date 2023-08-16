import React, { useState, useEffect, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import util from "../../util/util";

export default function ProfileImgEdit({ file, onClose, onComplete }) {
  const [toBeCroped, setToBeCroped] = useState("");
  const [cropedImage, setCropedImage] = useState("");
  const cropperRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    getToBeCropped();
  }, []);

  const getToBeCropped = () => {
    if (typeof file == "string") {
      setToBeCroped(file);
    } else {
      setToBeCroped(URL.createObjectURL(file));
    }
  };

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setCropedImage(cropper.getCroppedCanvas().toDataURL());
  };

  const cropImageNow = async () => {
    let fileImage = await util.dataUrlToFile(cropedImage, "profileImage.png");
    onComplete(fileImage);
  };

  const handleZoomIn = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      cropper.zoom(0.1);
      console.log(cropper.zoom);
    }
  };

  const handleZoomOut = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      cropper.zoom(-0.1);
      console.log(cropper.zoom);
    }
  };

  const resetZoom = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      cropper.reset();
    }
  }

  return (
    <>
      <div className="modal modal-Custom-zindex" style={{ display: "block" }}>
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div className="edit_profile profileImg_croper profileImg_croper_cover modal-dialog modal-lg">
              <div className="modal-content modal-content-profile-custom">
                {/* Modal Header */}
                <div className="modal-header">
                  <div className="followesNav">
                    <h4 className="mb-0">Edit Profile Picture</h4>
                  </div>
                  <div className="createPostRight d-flex align-items-center">
                    <button type="button" className="btn-close" onClick={onClose} />
                  </div>
                </div>
                {/* Modal body */}
                <div className="modal-body px-0">
                  <div className="tabSendContent">
                    <div style={{ display: "flex" }}>
                      <div id="image-cropper" className="profileImageCropper profileImageCropperCustom">
                        <Cropper
                          src={toBeCroped}
                          style={{ width: "100%", minHeight: "480px", maxHeight: "480px" }}
                          initialAspectRatio={1}
                          guides={false}
                          crop={onCrop}
                          ref={cropperRef}
                          // zoomTo={(parseInt(zoom) + 30) / 30}
                          //zoomTo={parseInt(zoom) / 4}
                          center={true}
                          zoom={zoom}
                          viewMode={1}
                          cropBoxResizable={false}
                          dragMode='move'
                          cropBoxMovable={false}
                          movable={true}                          
                        />
                        {/* </div> */}
                      </div>
                    </div>
                    <div className=" cropper_rage_custom">
                      <div className="cropper_rage d-flex justify-content-between align-items-center cropper_rage-custom">
                        <div className="cropper_rage d-flex flex-row justify-content-center align-items-center cropper_rage-custom mY-3">
                          <img alt="" onClick={handleZoomOut} src="/images/profile/minus-circle.svg" />
                          <img alt="" onClick={handleZoomIn} src="/images/profile/plus-circle.svg" />
                          <img src="/images/profile/history-reset.svg" alt="" onClick={resetZoom} />
                        </div>
                        <div className=" profileform_btn text-end profileform_btn-options">
                          <div className="profile-Photo-options">
                            <a
                              href="javascript:void(0);"
                              className="editComm_btn "
                              id="change-photo"
                            //   href="javascript:void(0)"
                            >
                              <label htmlFor="profile_img">Change Photo</label>
                            </a>
                            <input
                              style={{ display: "none" }}
                              type="file"
                              name="profile_img"
                              id="profile_img"
                              accept="image/*"
                              onChange={(event) => {
                                setToBeCroped(URL.createObjectURL(event.currentTarget.files[0]));
                                event.target.value = null;
                              }}
                            />
                            <a
                              href="javascript:void(0);"
                              className="btn btnColor btn-custom-line-height"
                              id="image-getter"
                              onClick={() => cropImageNow()}
                            >
                              Save
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show modal-backdrop-cust-zindex"></div>
    </>
  );
}
