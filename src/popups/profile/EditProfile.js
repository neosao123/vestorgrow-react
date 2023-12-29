import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import UserService from "../../services/UserService";
import ProfileImage from "../../shared/ProfileImage";
import EditCoverImage from "./EditCoverImage";
import EditProfileImage from "./EditProfileImage";
import "./editprofile.css"
const ValidateSchema = Yup.object().shape({
  user_name: Yup.string().required("Required").matches(/^\S*$/, 'Username cannot contain spaces').min(2, "Minimum 2 characters required.").max(20, "Maximum 20 characters are allowed"),
  title: Yup.string(),
  location: Yup.string(),
  // cover_img: Yup.string().required("Required"),
  // profile_img: Yup.string().required("Required"),
});


export default function EditProfile({ onClose, onSuccess, onFail }) {
  const userServ = new UserService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [showEditCoverImg, setShowEditCoverImg] = useState(null);
  const [showEditProfileImg, setShowEditProfileImg] = useState(null);
  const [initialValue, setInitialValue] = useState({
    user_name: user.user_name || "",
    title: user.title || "",
    location: user.location || "",
    cover_img: user.cover_img || "",
    profile_img: user.profile_img || "",
  });

  useEffect(() => {
    setInitialValue({
      ...initialValue,
      cover_img: user.cover_img || "",
      profile_img: user.profile_img || "",
    });
  }, [user]);

  useEffect(() => {
    if (window.innerWidth > 768) {
      document.body.style.overflow = "hidden";
      document.body.style.marginRight = "20px";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleCoverImage = (img) => {
    formik.setFieldValue("cover_img", img);
    setShowEditCoverImg(null);
  };

  const handleProfileImage = (img) => {
    formik.setFieldValue("profile_img", img);
    setShowEditProfileImg(null);
  };

  const onSubmit = async (values, e) => {
    try {
      const formData = new FormData();
      formData.append("user_name", values.user_name);
      formData.append("title", values.title);
      formData.append("location", values.location);
      formData.append("_id", user._id);
      // if (values.profile_img !== "") {
      //     formData.append("profile_img", values.profile_img)
      // }
      // if (values.cover_img !== "") {
      //     formData.append("cover_img", values.cover_img)
      // }
      const resp = await userServ.editProfile(formData);
      if (resp.data) {
        setUser(resp.data.result);
        localStorage.setItem("user", JSON.stringify(resp.data.result));
        onClose(e);
        document.body.style.overflow = "";
        document.body.style.marginRight = "";
      }
    } catch (error) {
      // onFail()
      console.log(error);
      document.body.style.overflow = "";
      document.body.style.marginRight = "";
    }
  };

  const formik = useFormik({
    initialValues: initialValue,
    validateOnBlur: true,
    onSubmit,
    validationSchema: ValidateSchema,
    enableReinitialize: true,
  });

  return (
    <>
      <div className="modal modal-custom-zindex-bg" style={{ display: "block", background: "rgba(0, 0, 0, 0.35)" }}>
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div className="edit_profile edit_profile-customPadding modal-dialog modal-lg">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <div className="followesNav">
                    <h4 className="mb-0 editProfileHeading-custom">
                      Edit Profile{" "}
                      <span className="editProfSpan">
                        (This information will be publicly displayed and visible for all users)
                      </span>
                    </h4>
                  </div>
                  <div className="createPostRight d-flex align-items-center">
                    <button
                      type="button"
                      className="btn-close"
                      onClick={(e) => {
                        onClose(e);
                        document.body.style.overflow = "";
                        document.body.style.marginRight = "";
                      }}
                    />
                  </div>
                </div>
                {/* Modal body */}
                <div className="modal-body px-0">
                  <div className="tabSendContent">
                    <div className="myProfile_sec">
                      <div className="about_profile">
                        {/* <div className="profileCoverPic mx-0" style={{ backgroundImage: `url(${formik.values.cover_img})` }}> */}
                        <div
                          className="profileCoverPic mx-0"
                          // style={{
                          //   backgroundImage: `url(${
                          //     typeof formik.values.cover_img == "string"
                          //       ? formik.values.cover_img
                          //       : URL.createObjectURL(formik.values.cover_img)
                          //   })`,
                          // }}
                          style={
                            user?.cover_img
                              ? {
                                backgroundImage: `url(${typeof formik.values.cover_img == "string"
                                  ? formik.values.cover_img
                                  : URL.createObjectURL(formik.values.cover_img)
                                  })`,
                              }
                              : { backgroundImage: "url(/images/profile/image_cover_profile.png)" }
                          }
                        >
                          <div className="edit_btn" onClick={() => setShowEditCoverImg(user?.cover_img)}>
                            <a href="javascript:void(0)">
                              <label htmlFor="cover_image">
                                <img src="/images/profile/Edit.svg" />
                              </label>
                            </a>
                          </div>
                          {!user?.cover_img && (
                            <input
                              style={{ display: "none" }}
                              type="file"
                              name="cover_image"
                              id="cover_image"
                              accept="image/*"
                              onChange={(event) => {
                                setShowEditCoverImg(event.currentTarget.files[0]);
                                event.target.value = null;
                              }}
                            />
                          )}
                          {!user?.profile_img && (
                            <input
                              style={{ display: "none" }}
                              type="file"
                              name="profile_image"
                              id="profile_image"
                              accept="image/*"
                              onChange={(event) => {
                                setShowEditProfileImg(event.currentTarget.files[0]);
                                event.target.value = null;
                              }}
                            />
                          )}
                        </div>
                        <div className="profilePic position-relative">
                          {/* <img src={user.profile_img} alt="user-pic" className="img-fluid" /> */}
                          <ProfileImage
                            url={
                              typeof formik.values.profile_img == "string"
                                ? formik.values.profile_img
                                : URL.createObjectURL(formik.values.profile_img)
                            }
                            style={{ borderRadius: "70px" }}
                          />
                          <div className="edit_btnImg" onClick={() => setShowEditProfileImg(user?.profile_img)}>
                            <a href="javascript:void(0)">
                              <label htmlFor="profile_image">
                                <img src="/images/profile/Edit.svg" alt="" id="edit_btn_image" style={{ height: "10px", width: "10px" }} />
                              </label>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="userprofile_form">
                        <form onSubmit={formik.handleSubmit}>
                          <div className="row pofiegrid">
                            <div className="col-sm-6 px-4">
                              <div className="mb-3 mb-sm-4 commonform">
                                <label htmlFor="username" className="form-label">
                                  Username
                                </label>
                                {/* <input type="text" className="form-control" id="username" defaultValue="Hamza Anjum" /> */}
                                <input
                                  className={
                                    "form-control" +
                                    (formik.touched.user_name && formik.errors.user_name ? " is-invalid" : "")
                                  }
                                  placeholder="Hamza Anjum"
                                  name="user_name"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.user_name}
                                />
                                {formik.touched.user_name && formik.errors.user_name ? (
                                  <div className="valid_feedbackMsg">{formik.errors.user_name}</div>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-sm-6 px-4">
                              <div className="mb-3 mb-sm-4 commonform">
                                <label htmlFor="title" className="form-label">
                                  Title
                                </label>
                                {/* <input type="text" className="form-control" id="title" defaultValue="UX/UI Designer" /> */}
                                <input
                                  className={
                                    "form-control" + (formik.touched.title && formik.errors.title ? " is-invalid" : "")
                                  }
                                  placeholder="Enter your job title"
                                  name="title"
                                  maxLength="40"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.title}
                                />
                                {formik.touched.title && formik.errors.title ? (
                                  <div className="valid_feedbackMsg">{formik.errors.title}</div>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-sm-6 px-4">
                              <div className="mb-3 mb-sm-4 commonform">
                                <label htmlFor="title" className="form-label">
                                  Location
                                </label>
                                {/* <input type="text" className="form-control" id="title" defaultValue="USA" /> */}
                                <input
                                  className={
                                    "form-control" +
                                    (formik.touched.location && formik.errors.location ? " is-invalid" : "")
                                  }
                                  placeholder="Enter country location"
                                  name="location"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.location}
                                />
                                {formik.touched.location && formik.errors.location ? (
                                  <div className="valid_feedbackMsg">{formik.errors.location}</div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className=" profileform_btn pb-2 text-end">
                            <a
                              href="javascript:void(0)"
                              className="editComm_btn me-3"
                              onClick={(e) => {
                                onClose(e);
                                document.body.style.overflow = "";
                                document.body.style.marginRight = "";
                              }}
                            >
                              Cancel
                            </a>
                            <button type="submit" className="btn btnColor">
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="modal-backdrop show"></div> */}
      {showEditCoverImg && (
        <div className="show modal-backdrop-custom-zindex-bg" style={{ position: "sticky" }}>
          <EditCoverImage
            file={showEditCoverImg}
            onClose={() => setShowEditCoverImg(null)}
            onComplete={handleCoverImage}
          />
        </div>
      )}
      {showEditProfileImg && (
        <div className="show modal-backdrop-custom-zindex-bg" style={{ position: "sticky" }}>
          <EditProfileImage
            file={showEditProfileImg}
            onClose={() => setShowEditProfileImg(null)}
            onComplete={handleProfileImage}
          />
        </div>
      )}
    </>
  );
}
