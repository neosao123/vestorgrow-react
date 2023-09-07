import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import UserService from "../../services/UserService";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import util from "../../util/util";
import DeletePhoto from "../deletePhoto/DeletePhoto";

export default function EditCoverImage({ file, onClose, onComplete }) {
  const userServ = new UserService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [toBeCroped, setToBeCroped] = useState("");
  const [cropedImage, setCropedImage] = useState("");
  const cropperRef = useRef(null);
  const [showDeleteCoverPopup, setShowDeleteCoverPopup] = useState(false);
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
    let fileImage = await util.dataUrlToFile(cropedImage, "coverImage.png");
    submitImage(fileImage);
  };

  const submitImage = async (fileImage) => {
    try {
      const formData = new FormData();
      formData.append("_id", user._id);
      formData.append("cover_img", fileImage);
      const resp = await userServ.editCoverPicture(formData);
      if (resp.data) {
        setUser(resp.data.data);
        localStorage.setItem("user", JSON.stringify(resp.data.data));
        onComplete(fileImage);
      }
    } catch (error) {
      // onFail()
      console.log(error);
    }
  };

  const deleteProfilePicHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("_id", user._id);
      formData.append("cover_img", "");
      const resp = await userServ.editCoverPicture(formData);
      if (resp.data) {
        setUser(resp.data.data);
        localStorage.setItem("user", JSON.stringify(resp.data.data));
        onClose();
      }
    } catch (error) {
      // onFail()
      console.log(error);
    }
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
            <div className="edit_profile bannerImg_croper modal-dialog modal-lg">
              <div className="modal-content modal-content-custom">
                {/* Modal Header */}
                <div className="modal-header">
                  <div className="followesNav">
                    <h4 className="mb-0">Edit Banner</h4>
                  </div>
                  <div className="createPostRight d-flex align-items-center">
                    <button type="button" className="btn-close" onClick={onClose} />
                  </div>
                </div>
                {/* Modal body */}
                <div className="modal-body px-0">
                  <div className="tabSendContent">
                    <div className="bannerImg bannerImg-custom">
                      <Cropper
                        src={toBeCroped}
                        style={{ width: "100%", height: "290px" }}
                        aspectRatio={25 / 9}
                        guides={true}
                        crop={onCrop}
                        ref={cropperRef}
                        // zoomTo={parseInt(zoom) / 4}
                        center={true}
                        zoom={zoom}
                        viewMode={1}
                        cropBoxResizable={false}
                        dragMode='move'
                        cropBoxMovable={false}
                        movable={true}
                      />
                      {/* <img src="/images/img/Banner.png" className="img-fluid" /> */}
                      {/* <div className="croperbox">
                                            </div> */}
                    </div>
                    <div className=" cropper_rage_custom">
                      <div className="cropper_rage d-flex flex-row justify-content-center align-items-center cropper_rage-custom">
                        <img alt="" onClick={handleZoomOut} src="/images/profile/minus-circle.svg" />
                        <img alt="" onClick={handleZoomIn} src="/images/profile/plus-circle.svg" />
                        <img src="/images/profile/history-reset.svg" alt="" onClick={resetZoom} />
                        <div className=" profileform_btn text-end profileform_btn-options">
                          <Link
                            className="btnColor-dlt-custom"
                            id="delete-photo"
                            onClick={() => setShowDeleteCoverPopup(true)}
                          >
                            Delete Photo
                          </Link>
                          <div className="profile-Photo-options">
                            <button
                              className="editComm_btn"
                              id="change-photo"
                            >
                              <label htmlFor="cover_img">Change Photo</label>
                            </button>
                            <input
                              style={{ display: "none" }}
                              type="file"
                              name="cover_img"
                              id="cover_img"
                              accept="image/*"
                              onChange={(event) => {
                                setToBeCroped(URL.createObjectURL(event.currentTarget.files[0]));
                                // setShowEditProfileImg(user?.profile_img);
                                event.target.value = null;
                              }}
                            />
                            <Link
                              className="btn btnColor btn-custom-line-height"
                              onClick={() => cropImageNow()}
                            >
                              Save
                            </Link>
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
      {showDeleteCoverPopup && (
        <DeletePhoto onClose={() => setShowDeleteCoverPopup(false)} onDelete={deleteProfilePicHandler} />
      )}
    </>
  );
}
