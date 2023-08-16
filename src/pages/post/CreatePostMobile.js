import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import PostService from "../../services/postService";
// import OwlCarousel from "react-owl-carousel";
import VideoImageThumbnail from "react-video-thumbnail-image";
import ProfileImage from "../../shared/ProfileImage";
import ImageCarousel from "../../popups/imageCarousel/ImageCarousel";
import MobImageCarousel from "../../popups/imageCarousel/mobImageCarousel";
import LoadingSpin from "react-loading-spin";

const ValidateSchema = Yup.object().shape({
  // message: Yup.string().required("Required"),
  shareType: Yup.string().required("Required"),
});
export default function CreatePostMobile({ onSuccess, onFail }) {
  const navigate = useNavigate();
  const postServ = new PostService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [postSuccessPopup, setPostSuccessPopup] = globalCtx.postSuccessPopup;
  const [postFailPopup, setPostFailPopup] = globalCtx.postFailPopup;
  const [mediaFiles, setMediaFiles] = useState([]);
  const [inputTouched, setInputTouched] = useState(false);
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [initialValue, setInitialValue] = useState({
    message: "",
    mediaFiles: "",
    shareType: "Friends",
  });

  const inputTouchedHandler = () => {
    setInputTouched(true);
  };
  const handlePostSuccessPopup = () => {
    setPostSuccessPopup(!postSuccessPopup);
  };
  const handlePostFailPopup = () => {
    setPostFailPopup(!postFailPopup);
  };

  const onSubmit = async (values) => {
    setShowLoadingBar(true);
    try {
      const formData = new FormData();
      formData.append("message", values.message);
      formData.append("shareType", values.shareType);
      formData.append("createdBy", user._id);
      if (Array.isArray(values.mediaFiles)) {
        values.mediaFiles.forEach((element) => {
          formData.append("mediaFiles", element);
        });
      }
      const resp = await postServ.sendPost(formData);
      if (resp.data) {
        setShowLoadingBar(false);
        navigate("/");
        handlePostSuccessPopup();
      } else {
        setShowLoadingBar(false);
        navigate("/");
        handlePostFailPopup();
      }
    } catch (error) {
      onFail();
      console.log(error);
    }
  };
  const handleRemoveFile = (idx) => {
    let arr = formik.values.mediaFiles.filter((item, index) => index != idx);
    formik.setFieldValue("mediaFiles", arr);
  };

  const formik = useFormik({
    initialValues: initialValue,
    validateOnBlur: true,
    onSubmit,
    validationSchema: ValidateSchema,
    enableReinitialize: true,
  });

  const imageClickHandler = () => {
    let allUrl = [];
    formik.values.mediaFiles.forEach((item, id) => {
      let urlNew = URL.createObjectURL(item);
      allUrl.push({ id: id, url: urlNew, type: item.type });
    });
    setMediaFiles([...allUrl]);
  };
  return (
    <>
      <div className="modal-content mobileCreatePost">
        <form onSubmit={formik.handleSubmit}>
          <div className="modal-header">
            <div className="followesNav createPostHeading-custom">
              <div className="createPostHeading-backButton" onClick={() => navigate("/")}>
                <img
                  className="arrow"
                  src="/images/icons/left-arrow.svg"
                  // onClick={setShowNotification(false)}
                />
              </div>
              <h4>Create post</h4>
            </div>
            <div className="postBtn ms-auto">
              <button href="javascript:void(0)" className="btn btnColor" type="submit">
                {" "}
                Post
              </button>
            </div>
          </div>
          {/* Modal body */}
          <div className="modal-body">
            <div className="tabSendContent">
              <div className="followersList">
                <div className="createPostMind d-flex">
                  <div className="createPostProf">
                    <ProfileImage url={user?.profile_img} style={{ borderRadius: "80px" }} />
                  </div>
                  <div className="createPostUserName">
                    <p>
                      {user?.first_name ? `${user?.first_name} ${user?.last_name}` : user?.user_name}{" "}
                      {user.role.includes("userPaid") ? (
                        <img src="/images/icons/green-tick.svg" />
                      ) : (
                        <img src="/images/icons/dot.svg" />
                      )}{" "}
                    </p>
                    <div className="createPostRight d-flex align-items-center">
                      <div className="createPostDropDown d-flex align-items-center">
                        <div className="selectWhoSeePost">
                          <div className="dropdown">
                            <button type="button" className="btn btn-primary" data-bs-toggle="dropdown">
                              <span>{formik.values.shareType}</span>{" "}
                              <img src="/images/icons/down-arrow-white.svg" alt="downarrow" className="img-fluid" />
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <div className="form-group">
                                  <label className="radioLabel">
                                    <input
                                      type="radio"
                                      id="shareType"
                                      name="shareType"
                                      value="Friends"
                                      onChange={formik.handleChange}
                                      className="d-none"
                                    />
                                    <span className="selectedRadio" />
                                    Friends
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div className="form-group">
                                  <label className="radioLabel">
                                    <input
                                      type="radio"
                                      id="shareType"
                                      name="shareType"
                                      value="Public"
                                      onChange={formik.handleChange}
                                      className="d-none"
                                    />
                                    <span className="selectedRadio" />
                                    Public
                                  </label>
                                </div>
                              </li>
                              {/* <li>
                                                                <div className="form-group">
                                                                    <label className="radioLabel">
                                                                        <input type="radio" id="shareType" name="shareType" value="Only me" onChange={formik.handleChange} className="d-none" />
                                                                        <span className="selectedRadio" />
                                                                        Only me
                                                                    </label>
                                                                </div>
                                                            </li> */}
                            </ul>
                          </div>
                        </div>
                      </div>
                      {/* <button type="button" className="btn-close" onClick={onClose} /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {formik.values.mediaFiles == "" ? (
            <>
              <div className="createPostTextarea createPostTextarea-mobile">
                {/* <textarea className="form-control" rows={6} id name placeholder="What's on your mind?" defaultValue={""} /> */}
                <textarea
                  className="form-control"
                  rows={inputTouched ? "6" : "1"}
                  id="message"
                  name="message"
                  placeholder="What's on your mind?"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.message}
                  onClick={inputTouchedHandler}
                />
                {formik.touched.message && formik.errors.message ? (
                  <div className="formik-errors bg-error">{formik.errors.message}</div>
                ) : null}
                <div className="postFile">
                  <div className="addPhoto">
                    <input
                      style={{ display: "none" }}
                      type="file"
                      name="mediaFiles"
                      id="mediaFiles"
                      accept="image/*,video/mp4,video/x-m4v,video/*"
                      multiple={true}
                      onChange={(event) =>
                        formik.setFieldValue("mediaFiles", [...formik.values.mediaFiles, ...event.currentTarget.files])
                      }
                    />
                    <label htmlFor="mediaFiles" className="btn">
                      <img src="/images/icons/image.svg" alt="img-icon" className="img-fluid" />
                      <span>Add Photo/Video</span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          ) : formik.values.mediaFiles.length >= 0 ? (
            <>
              <div className="createPostTxt">
                {/* <p>{formik.values.message}</p> */}
                <textarea
                  className="form-control border-0"
                  rows="1"
                  id="message"
                  name="message"
                  placeholder="What's on your mind?"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.message}
                />
                {formik.touched.message && formik.errors.message ? (
                  <div className="formik-errors bg-error">{formik.errors.message}</div>
                ) : null}
              </div>
              <div className="gallery position-relative">
                <div className="gallerySlider">
                  {/* <div className="item">
                                            <div className="galleryImg">
                                                <button type="button" className="btn-close galleryCloseIcon position-absolute" onClick={() => handleRemoveFile(0)} />
                                                {formik.values.mediaFiles[0].type.includes("image") ?
                                                    <img src={URL.createObjectURL(formik.values.mediaFiles[0])} alt="gallery" className="img-fluid" />
                                                    :
                                                    <>
                                                        <VideoImageThumbnail
                                                            videoUrl={URL.createObjectURL(formik.values.mediaFiles[0])}
                                                            alt="video"
                                                        />
                                                        <div className="overLay">
                                                            <span><i className="fa-sharp fa-solid fa-play"></i></span>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </div> */}
                  {/* <OwlCarousel
                    className="owl-carousel owl-theme gallerySlider"
                    loop={false}
                    margin={10}
                    dots={false}
                    nav={true}
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
                  > */}
                  {formik.values.mediaFiles.length === 1 && (
                    <div className="galleryImg galleryImg-customMobilePost">
                      {/* <a href="javascript:void(0);" onClick={() => handleRemoveFile(idx)} className="galleryCloseIcon position-absolute"><img src="/images/icons/close.svg" alt="close" className="img-fluid" /></a> */}
                      <div className="galleryCloseIcon position-absolute galleryCloseIcon-custom">
                        <button type="button" className="btn-close " onClick={() => handleRemoveFile(0)} />
                      </div>
                      {/* <img src={URL.createObjectURL(item)} alt="gallery" className="img-fluid" /> */}
                      {formik.values.mediaFiles[0].type.includes("image") ? (
                        <img
                          src={URL.createObjectURL(formik.values.mediaFiles[0])}
                          alt="gallery"
                          className="img-fluid"
                          onClick={imageClickHandler}
                        />
                      ) : (
                        <>
                          <VideoImageThumbnail
                            videoUrl={URL.createObjectURL(formik.values.mediaFiles[0])}
                            // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                            // width={120}
                            // height={80}
                            alt="video"
                            onClick={imageClickHandler}
                          />
                          <div className="overLay">
                            <span className="fa-sharp fa-solid fa-play"></span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {formik.values.mediaFiles.length === 2 && (
                    <div className="item item-galleryImg-custom-tf">
                      {formik.values.mediaFiles.map((item, idx) => {
                        return (
                          <div className="galleryImg">
                            {/* <a href="javascript:void(0);" onClick={() => handleRemoveFile(idx)} className="galleryCloseIcon position-absolute"><img src="/images/icons/close.svg" alt="close" className="img-fluid" /></a> */}
                            <div className="galleryCloseIcon position-absolute galleryCloseIcon-custom">
                              <button type="button" className="btn-close" onClick={() => handleRemoveFile(idx)} />
                            </div>
                            {/* <img src={URL.createObjectURL(item)} alt="gallery" className="img-fluid" /> */}
                            {item.type.includes("image") ? (
                              <img
                                src={URL.createObjectURL(item)}
                                alt="gallery"
                                className="img-fluid"
                                onClick={imageClickHandler}
                              />
                            ) : (
                              <>
                                <VideoImageThumbnail
                                  videoUrl={URL.createObjectURL(item)}
                                  // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                  // width={120}
                                  // height={80}
                                  alt="video"
                                  onClick={imageClickHandler}
                                />
                                <div className="overLay">
                                  <span className="fa-sharp fa-solid fa-play"></span>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {formik.values.mediaFiles.length > 2 && formik.values.mediaFiles.length <= 4 && (
                    <div className="item item-galleryImg-custom-tf">
                      <div className="item-galleryImg-custom-tf-one">
                        <div className="galleryImg">
                          {/* <a href="javascript:void(0);" onClick={() => handleRemoveFile(idx)} className="galleryCloseIcon position-absolute"><img src="/images/icons/close.svg" alt="close" className="img-fluid" /></a> */}
                          <div className="galleryCloseIcon position-absolute galleryCloseIcon-custom">
                            <button type="button" className="btn-close" onClick={() => handleRemoveFile(0)} />
                          </div>
                          {/* <img src={URL.createObjectURL(item)} alt="gallery" className="img-fluid" /> */}
                          {formik.values.mediaFiles[0].type.includes("image") ? (
                            <img
                              src={URL.createObjectURL(formik.values.mediaFiles[0])}
                              alt="gallery"
                              className="img-fluid"
                              onClick={imageClickHandler}
                            />
                          ) : (
                            <>
                              <VideoImageThumbnail
                                videoUrl={URL.createObjectURL(formik.values.mediaFiles[0])}
                                // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                // width={120}
                                // height={80}
                                alt="video"
                                onClick={imageClickHandler}
                              />
                              <div className="overLay">
                                <span className="fa-sharp fa-solid fa-play"></span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="item-galleryImg-custom-tf-two">
                        {formik.values.mediaFiles.slice(1).map((item, idx) => {
                          return (
                            <div className="galleryImg">
                              {/* <a href="javascript:void(0);" onClick={() => handleRemoveFile(idx)} className="galleryCloseIcon position-absolute"><img src="/images/icons/close.svg" alt="close" className="img-fluid" /></a> */}
                              <div className="galleryCloseIcon position-absolute galleryCloseIcon-custom">
                                <button type="button" className="btn-close" onClick={() => handleRemoveFile(idx + 1)} />
                              </div>
                              {/* <img src={URL.createObjectURL(item)} alt="gallery" className="img-fluid" /> */}
                              {item.type.includes("image") ? (
                                <img
                                  src={URL.createObjectURL(item)}
                                  alt="gallery"
                                  className="img-fluid"
                                  onClick={imageClickHandler}
                                />
                              ) : (
                                <>
                                  <VideoImageThumbnail
                                    videoUrl={URL.createObjectURL(item)}
                                    // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                    // width={120}
                                    // height={80}
                                    alt="video"
                                    onClick={imageClickHandler}
                                  />
                                  <div className="overLay">
                                    <span className="fa-sharp fa-solid fa-play"></span>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {formik.values.mediaFiles.length > 4 && (
                    <div className="item item-galleryImg-custom-tf item_custom">
                      <div className="item-galleryImg-custom-tf-one">
                        <div className="galleryImg">
                          {/* <a href="javascript:void(0);" onClick={() => handleRemoveFile(idx)} className="galleryCloseIcon position-absolute"><img src="/images/icons/close.svg" alt="close" className="img-fluid" /></a> */}
                          <div className="galleryCloseIcon position-absolute galleryCloseIcon-custom">
                            <button type="button" className="btn-close" onClick={() => handleRemoveFile(0)} />
                          </div>
                          {/* <img src={URL.createObjectURL(item)} alt="gallery" className="img-fluid" /> */}
                          {formik.values.mediaFiles[0].type.includes("image") ? (
                            <img
                              src={URL.createObjectURL(formik.values.mediaFiles[0])}
                              alt="gallery"
                              className="img-fluid"
                              onClick={imageClickHandler}
                            />
                          ) : (
                            <>
                              <VideoImageThumbnail
                                videoUrl={URL.createObjectURL(formik.values.mediaFiles[0])}
                                // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                // width={120}
                                // height={80}
                                alt="video"
                                onClick={imageClickHandler}
                              />
                              <div className="overLay">
                                <span className="fa-sharp fa-solid fa-play"></span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="item-galleryImg-custom-tf-two">
                        {formik.values.mediaFiles.slice(1, 3).map((item, idx) => {
                          return (
                            <div className="galleryImg">
                              {/* <a href="javascript:void(0);" onClick={() => handleRemoveFile(idx)} className="galleryCloseIcon position-absolute"><img src="/images/icons/close.svg" alt="close" className="img-fluid" /></a> */}
                              <div className="galleryCloseIcon position-absolute galleryCloseIcon-custom">
                                <button type="button" className="btn-close" onClick={() => handleRemoveFile(idx + 1)} />
                              </div>
                              {/* <img src={URL.createObjectURL(item)} alt="gallery" className="img-fluid" /> */}
                              {item.type.includes("image") ? (
                                <img
                                  src={URL.createObjectURL(item)}
                                  alt="gallery"
                                  className="img-fluid"
                                  // onClick={setMediaFiles}
                                  onClick={imageClickHandler}
                                />
                              ) : (
                                <>
                                  <VideoImageThumbnail
                                    videoUrl={URL.createObjectURL(item)}
                                    // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                    // width={120}
                                    // height={80}
                                    alt="video"
                                    onClick={imageClickHandler}
                                  />
                                  <div className="overLay">
                                    <span className="fa-sharp fa-solid fa-play"></span>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}

                        <div className="galleryImg">
                          {/* <a href="javascript:void(0);" onClick={() => handleRemoveFile(idx)} className="galleryCloseIcon position-absolute"><img src="/images/icons/close.svg" alt="close" className="img-fluid" /></a> */}
                          {/* <img src={URL.createObjectURL(item)} alt="gallery" className="img-fluid" /> */}
                          {formik.values.mediaFiles[3].type.includes("image") ? (
                            <img
                              src={URL.createObjectURL(formik.values.mediaFiles[3])}
                              alt="gallery"
                              className="img-fluid"
                              onClick={imageClickHandler}
                            />
                          ) : (
                            <>
                              <VideoImageThumbnail
                                videoUrl={URL.createObjectURL(formik.values.mediaFiles[3])}
                                // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                // width={120}
                                // height={80}
                                alt="video"
                                onClick={imageClickHandler}
                              />
                              <div className="overLay">
                                <span className="fa-sharp fa-solid fa-play"></span>
                              </div>
                            </>
                          )}
                          <div className="overLay rounded-0">
                            <span>+{formik.values.mediaFiles.length - 4}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* </OwlCarousel> */}
                </div>
              </div>
              <div className="postFile postFileCustom galleryPostFile">
                <div className="addPhoto addPhoto-custom">
                  <input
                    style={{ display: "none" }}
                    type="file"
                    name="mediaFiles"
                    id="mediaFiles"
                    accept="image/*,video/mp4,video/x-m4v,video/*"
                    multiple={true}
                    onChange={(event) =>
                      formik.setFieldValue("mediaFiles", [...formik.values.mediaFiles, ...event.currentTarget.files])
                    }
                  />
                  <label htmlFor="mediaFiles" className="btn addMore">
                    <img src="/images/icons/add-plus-icon.svg" alt="img-icon" className="img-fluid" />
                    <span>Add more</span>
                  </label>
                </div>
                {/* <div className="addVideo">
                                                                <input
                                                                    style={{ display: "none" }}
                                                                    type="file"
                                                                    name="mediaFiles"
                                                                    id="mediaFilesVideo"
                                                                    accept="video/mp4,video/x-m4v,video/*"
                                                                    multiple={true}
                                                                    onChange={(event) => formik.setFieldValue(
                                                                        "mediaFiles",
                                                                        [...formik.values.mediaFiles, ...event.currentTarget.files]
                                                                    )}
                                                                />
                                                                <label htmlFor="mediaFilesVideo" className="btn">
                                                                    <img src="/images/icons/video.svg" alt="img-icon" className="img-fluid" />
                                                                    <span>Add Video</span>
                                                                </label>
                                                            </div> */}
              </div>
            </>
          ) : (
            ""
          )}
        </form>
      </div>
      {mediaFiles && mediaFiles.length > 0 && (
        // <ImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} />
        // <MobImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} />
        <MobImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} />
      )}
      {showLoadingBar && (
        <>
          <div className="loader-container">
            <LoadingSpin
              duration="2s"
              width="4px"
              timingFunction="ease-in-out"
              direction="alternate"
              size="45px"
              primaryColor="#00808B"
              secondaryColor="#212529"
              numberOfRotationsInAnimation={2}
            />
          </div>
          <div className="modal-backdrop modal-backdrop-CustomLoading show"></div>
        </>
      )}
    </>
  );
}
