import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import UserService from "../../services/UserService";
import moment from "moment";
const ValidateSchema = Yup.object().shape({
  bio: Yup.string().required("Bio is required"),
  gender: Yup.string(),
  email: Yup.string(),
  // date_of_birth: Yup.string(),
});
export default function EditAboutModal({ onClose }) {
  const userServ = new UserService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [initialValue, setInitialValue] = useState({
    bio: user.bio || "",
    gender: user.gender || "",
    email: user.email || "",
    // date_of_birth: moment(user.date_of_birth).format("YYYY-MM-DD") || "",
  });

  useEffect(() => {
    if (window.innerWidth > 768) {
      document.body.style.overflow = "hidden";
      document.body.style.marginRight = "20px";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const onSubmit = async (values) => {
    try {
      const formData = { ...values };
      formData._id = user._id;
      const resp = await userServ.editProfile(formData);
      if (resp.data) {
        setUser(resp.data.result);
        localStorage.setItem("user", JSON.stringify(resp.data.result));
        onClose();
        document.body.style.overflow = "";
        document.body.style.marginRight = "";
      }
    } catch (error) {
      // onFail()
      console.log(error);
    }
  };
  // const genderOptions = ["Male", "Female"];

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
            <div className="edit_profile editproBiomodal modal-dialog modal-lg">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <div className="followesNav">
                    <h4 className="mb-0 editAboutHeading-custom">
                      About{" "}
                      <span className="editProfSpan">
                        (This information will be publicly displayed and visible for all users)
                      </span>
                    </h4>
                  </div>
                  <div className="createPostRight d-flex align-items-center">
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        onClose();
                        document.body.style.overflow = "";
                        document.body.style.marginRight = "";
                      }}
                    />
                  </div>
                </div>
                {/* Modal body */}
                <div className="modal-body px-0">
                  <div className="tabSendContent">
                    <div className="aboutboi_modaldata">
                      <form onSubmit={formik.handleSubmit}>
                        <div className="mb-3 mb-sm-4 commonform commonformBioCustom">
                          <label htmlFor="useBio" className="form-label">
                            Bio
                          </label>
                          {/* <textarea className="form-control" rows={5} id="useBio" value defaultValue={""} /> */}
                          <textarea
                            className={
                              "form-control allFeedUser" +
                              (formik.touched.bio && formik.errors.bio ? " is-invalid" : "")
                            }
                            placeholder="Tell something about you"
                            name="bio"
                            rows={10}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.bio}
                          />
                          {formik.touched.bio && formik.errors.bio ? (
                            <div className="valid_feedbackMsg">{formik.errors.bio}</div>
                          ) : null}
                        </div>
                        <div className="mb-3 mb-sm-4 commonform">
                          <label htmlFor="userGender" className="form-label">
                            Gender
                          </label>
                          {/* <input type="text" className="form-control" id="userGender" defaultValue="Male" /> */}
                          <input
                            className={
                              "form-control" + (formik.touched.gender && formik.errors.gender ? " is-invalid" : "")
                            }
                            // placeholder="Male"
                            name="gender"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.gender}
                          />
                          {formik.touched.gender && formik.errors.gender ? (
                            <div className="valid_feedbackMsg">{formik.errors.gender}</div>
                          ) : null}
                          {/* <div className="genderSelect-optionsCustom">
                            <select
                              className={
                                "form-control genderOptions-Custom" +
                                (formik.touched.gender && formik.errors.gender ? " is-invalid" : "")
                              }
                              // placeholder="Male"
                              name="gender"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.gender}
                            >
                              {genderOptions.map((option, index) => {
                                return (
                                  <option key={index} className="genderOptions-CustomOptions">
                                    {option}
                                  </option>
                                );
                              })}
                            </select>
                            <div className="nav-link downArrow">
                              {" "}
                              <img
                                src="/images/icons/down-arrow-pc.svg"
                                alt="downarrow"
                                className="img-fluid image-up-Arrow"
                              />{" "}
                            </div>
                          </div> */}
                        </div>
                        <div className="mb-3 mb-sm-4 commonform">
                          <label htmlFor="userEmail" className="form-label">
                            Email
                          </label>
                          {/* <input type="text" className="form-control" id="userEmail" defaultValue="michaelphilip@gmail.com" /> */}
                          <input
                            className={
                              "form-control" + (formik.touched.email && formik.errors.email ? " is-invalid" : "")
                            }
                            placeholder="xyz@gmail.com"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                          />
                          {formik.touched.email && formik.errors.email ? (
                            <div className="valid_feedbackMsg">{formik.errors.email}</div>
                          ) : null}
                        </div>
                        {/* <div className="mb-3 mb-sm-4 commonform">
                          <label htmlFor="userBirh" className="form-label">
                            Birthday
                          </label>
                          // <input type="text" className="form-control" id="username" defaultValue="25/07/1998" /> 
                          <input
                            type="date"
                            className={
                              "form-control" +
                              (formik.touched.date_of_birth && formik.errors.date_of_birth ? " is-invalid" : "")
                            }
                            placeholder="Enter your date of birth"
                            name="date_of_birth"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.date_of_birth}
                          />
                          {formik.touched.date_of_birth && formik.errors.date_of_birth ? (
                            <div className="valid_feedbackMsg">{formik.errors.date_of_birth}</div>
                          ) : null}
                        </div> */}
                        <div className=" profileform_btn py-2 text-end">
                          <a
                            href="javascript:void(0)"
                            className="editComm_btn me-3"
                            onClick={() => {
                              onClose();
                              document.body.style.overflow = "";
                              document.body.style.marginRight = "";
                            }}
                          >
                            {" "}
                            Cancel
                          </a>
                          <button type="submit" className="btn btnColor">
                            Save changes
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

      {/* <div className="modal-backdrop show"></div> */}
    </>
  );
}
