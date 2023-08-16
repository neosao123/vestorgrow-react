import React, { useState, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import UserService from "../../services/UserService";
import moment from "moment";

const ValidateSchema = Yup.object().shape({
  user_name: Yup.string().required("Required"),
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  email: Yup.string().required("Required"),
  date_of_birth: Yup.string(),
  password: Yup.string(),
  verifyPassword: Yup.string().when("password", {
    is: (password) => password,
    then: Yup.string().required("verify password is required"),
  }),
  newPassword: Yup.string().when("password", {
    is: (password) => password,
    then: Yup.string().required("new password is required"),
  }),
});

export default function AccouctSetting() {
  const userServ = new UserService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValue, setInitialValue] = useState({
    user_name: user.user_name || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    date_of_birth: moment(user.date_of_birth).format("YYYY-MM-DD") || "",
    password: "",
    verifyPassword: "",
    newPassword: "",
  });

  const onSubmit = async (values) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const formData = { _id: user._id, ...values };
      if (formData.password === "") {
        delete formData.password;
        delete formData.verifyPassword;
        delete formData.newPassword;
      }
      const resp = await userServ.editProfile(formData);
      if (resp.data) {
        setUser(resp.data.result);
        // setUser(resp.data)
        localStorage.setItem("user", JSON.stringify(resp.data.result));
        setSuccessMsg(resp.data.message);
      } else {
        setErrorMsg(resp.err);
      }
    } catch (err) {
      // onFail()
      setErrorMsg(err.response.data.err);
      console.log(err);
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
      <div className="tab-pane active">
        <div className="socialContant py-4">
          <div className="settig_heading">
            <h5>Account</h5>
            <p>Edit your account settings and change your password</p>
          </div>
          <div className="settingAccount_form commonSettgcard">
            <form onSubmit={formik.handleSubmit}>
              <div className="customGroup">
                <div className="mb-3 mb-sm-4 commonform commonform_custom">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  {/* <input type="text" className="form-control" id="username" defaultValue="Michael Philip" /> */}
                  <input
                    type="text"
                    className={
                      "form-control" + (formik.touched.user_name && formik.errors.user_name ? " is-invalid" : "")
                    }
                    id="username"
                    // placeholder="Hamza Anjum"
                    name="user_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.user_name}
                  />
                  {formik.touched.user_name && formik.errors.user_name ? (
                    <div className="valid_feedbackMsg">{formik.errors.user_name}</div>
                  ) : null}
                </div>
                <div className="mb-3 mb-sm-4 commonform commonform_custom">
                  <label htmlFor="firstName" className="form-label">
                    First name
                  </label>
                  {/* <input type="email" className="form-control" id="userEmail" defaultValue="michaelphilip@gmail.com" /> */}
                  <input
                    type="text"
                    className={
                      "form-control" + (formik.touched.first_name && formik.errors.first_name ? " is-invalid" : "")
                    }
                    id="firstName"
                    // placeholder="Micheal"
                    name="first_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.first_name}
                  />
                  {formik.touched.first_name && formik.errors.first_name ? (
                    <div className="valid_feedbackMsg">{formik.errors.first_name}</div>
                  ) : null}
                </div>
                <div className="mb-3 mb-sm-4 commonform commonform_custom">
                  <label htmlFor="lastName" className="form-label">
                    Last name
                  </label>
                  {/* <input type="text" className="form-control" id="username" defaultValue="Michael Philip" /> */}
                  <input
                    type="text"
                    className={
                      "form-control" + (formik.touched.last_name && formik.errors.last_name ? " is-invalid" : "")
                    }
                    id="lastName"
                    // placeholder="Smith"
                    name="last_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.last_name}
                  />
                  {formik.touched.last_name && formik.errors.last_name ? (
                    <div className="valid_feedbackMsg">{formik.errors.last_name}</div>
                  ) : null}
                </div>
                <div className="mb-2 mb-sm-4 setting-inner-heading_custom">
                  <h4>Private details</h4>
                  <p>This information will not be publicly displayed.</p>
                </div>

                <div className="mb-3 mb-sm-4 commonform commonform_custom">
                  <label htmlFor="userEmail" className="form-label">
                    Email
                  </label>
                  {/* <input type="email" className="form-control" id="userEmail" defaultValue="michaelphilip@gmail.com" /> */}
                  <input
                    type="text"
                    className={"form-control" + (formik.touched.email && formik.errors.email ? " is-invalid" : "")}
                    id="userEmail"
                    // placeholder="michaelphilip@gmail.com"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="valid_feedbackMsg">{formik.errors.email}</div>
                  ) : null}
                </div>
                <div className="mb-3 mb-sm-4 commonform commonform_custom">
                  <label htmlFor="userBirh" className="form-label">
                    Birthday
                  </label>
                  {/* <input type="text" className="form-control" id="username" defaultValue="25/07/1998" /> */}
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
                </div>
              </div>
              <div className="customGroup">
                <div className="commonform commonform_custom-password">
                  <label className="form-label">Password</label>
                  {/* <input type="password" className="form-control mb_20" id="userpass" placeholder="Enter current password" />
                                    <input type="password" className="form-control mb_20" id="usernewpass" placeholder="Enter new password" />
                                    <input type="password" className="form-control" placeholder="Retype new password" /> */}
                  <div className="password-setting-field">
                    <input
                      type="password"
                      className={
                        "form-control mb_20" + (formik.touched.password && formik.errors.password ? " is-invalid" : "")
                      }
                      id="userpass"
                      placeholder="Enter current password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="valid_feedbackMsg">{formik.errors.password}</div>
                    ) : null}
                    <input
                      type="password"
                      className={
                        "form-control mb_20" +
                        (formik.touched.newPassword && formik.errors.newPassword ? " is-invalid" : "")
                      }
                      id="usernewpass"
                      placeholder="Enter new password"
                      name="newPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.newPassword}
                    />
                    {formik.touched.newPassword && formik.errors.newPassword ? (
                      <div className="valid_feedbackMsg">{formik.errors.newPassword}</div>
                    ) : null}
                    <input
                      type="password"
                      className={
                        "form-control mb_20" +
                        (formik.touched.verifyPassword && formik.errors.verifyPassword ? " is-invalid" : "")
                      }
                      id="Retype new password"
                      placeholder="Retype new password"
                      name="verifyPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.verifyPassword}
                    />
                    {formik.touched.verifyPassword && formik.errors.verifyPassword ? (
                      <div className="valid_feedbackMsg">{formik.errors.verifyPassword}</div>
                    ) : null}
                  </div>
                </div>
              </div>
              {errorMsg && <div className="valid_feedbackMsg text-center">{errorMsg}</div>}
              {successMsg && <div className="valid_feedbackMsg valid_feedbackMsgCustom text-center">{successMsg}</div>}
              <div className=" profileform_btn pt-4 pt-lg-5 pb-4 settingsaveBtn">
                <a href="javascript:void(0)" className="editComm_btn me-3">
                  {" "}
                  Cancel
                </a>
                <button href="javascript:void(0);" type="submit" className="btn btnColor">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
