import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import UserService from "../../services/UserService";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import util from "../../util/util";
import DeletePhoto from "../deletePhoto/DeletePhoto";
export default function EditProfileImage({ file, onClose, onComplete }) {
    const userServ = new UserService();
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [toBeCroped, setToBeCroped] = useState("");
    const [cropedImage, setCropedImage] = useState("");
    const [showDeletePhotoPopup, setShowDeletePhotoPopup] = useState(false);
    const cropperRef = useRef(null);
    const [zoom, setZoom] = useState(1);

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
        onComplete(fileImage);
    };

    const submitImage = async (fileImage) => {
        try {
            const formData = new FormData();
            formData.append("_id", user._id);
            formData.append("profile_img", fileImage);
            const resp = await userServ.editProfilePicture(formData);
            if (resp?.data) {
                setUser(resp.data.data);
                localStorage.setItem("user", JSON.stringify(resp.data.data));
                onClose();
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
            formData.append("profile_img", "");
            const resp = await userServ.editProfilePicture(formData);
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
        }
    };

    const handleZoomOut = () => {
        if (cropperRef.current) {
            const cropper = cropperRef.current.cropper;
            cropper.zoom(-0.1);
        }
    };

    const resetZoom = () => {
        if (cropperRef.current) {
            const cropper = cropperRef.current.cropper;
            cropper.reset();
        }
    }

    useEffect(() => {
        getToBeCropped();
    }, []);

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
                                                    center={true}
                                                    zoom={zoom}
                                                    viewMode={1}
                                                    cropBoxResizable={false}
                                                    dragMode='move'
                                                    cropBoxMovable={false}
                                                    movable={true}
                                                />

                                            </div>
                                        </div>
                                        <div className="cropper_rage_custom">
                                            <div className="cropper_rage d-flex flex-row justify-content-center align-items-center cropper_rage-custom mb-3">
                                                <img alt="" onClick={handleZoomOut} src="/images/profile/minus-circle.svg" />
                                                <img alt="" onClick={handleZoomIn} src="/images/profile/plus-circle.svg" />
                                                <img src="/images/profile/history-reset.svg" alt="" onClick={resetZoom} />
                                            </div>
                                            <div className=" profileform_btn text-end profileform_btn-options">
                                                <button
                                                    className="btnColor-dlt-custom"
                                                    id="delete-photo"
                                                    onClick={() => setShowDeletePhotoPopup(true)}
                                                >
                                                    Delete Photo
                                                </button>
                                                <div className="profile-Photo-options">
                                                    <button
                                                        className="editComm_btn"
                                                        id="change-photo"
                                                    >
                                                        <label htmlFor="profile_img">Change Photo</label>
                                                    </button>
                                                    <input
                                                        style={{ display: "none" }}
                                                        type="file"
                                                        name="profile_img"
                                                        id="profile_img"
                                                        accept="image/*"
                                                        onChange={(event) => {
                                                            setToBeCroped(URL.createObjectURL(event.currentTarget.files[0]));
                                                            // setShowEditProfileImg(user?.profile_img);
                                                            event.target.value = null;
                                                        }}
                                                    />
                                                    <Link
                                                        className="btn btnColor btn-custom-line-height"
                                                        id="image-getter"
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
            <div className="modal-backdrop show modal-backdrop-cust-zindex"></div>
            {
                showDeletePhotoPopup && (
                    <DeletePhoto
                        // file={showEditProfileImg}
                        onClose={() => setShowDeletePhotoPopup(false)}
                        onDelete={deleteProfilePicHandler}
                    />
                )
            }
        </>
    );
}
