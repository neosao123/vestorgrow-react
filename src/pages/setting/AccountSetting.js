import React, { useState, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import UserService from "../../services/UserService";
import moment from "moment";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import "./accountsetting.css"
import { toast } from "react-toastify";

const ValidateSchema = Yup.object().shape({
  user_name: Yup.string().required("Required"),
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  email: Yup.string().required("Required"),
  date_of_birth: Yup.string(),
});
const ValidateSchema1 = Yup.object().shape({
  password: Yup.string().required("Password is required.").min(8, "Minimum 8 characters required.").max(20, "Maximum 20 characters allowed."),
  verifyPassword: Yup.string().required("Confirm password is required").min(8, "Minimum 8 characters required.").max(20, "Maximum 20 characters allowed.").notOneOf([Yup.ref('password')], 'Confirm password must not be the same as the current password').matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
    'Password must contain at least one lowercase letter, one uppercase letter, one symbol, and one number'
  ).when("password", {
    is: (password) => password,
    then: Yup.string().oneOf(
      [Yup.ref('newPassword')],
      'New password must be equal to verify password.'
    ),
  }),
  newPassword: Yup.string().required("New password is required").min(8, "Minimum 8 characters required.").max(20, "Maximum 20 characters allowed.").notOneOf([Yup.ref('password')], 'New password must not be the same as the current password').matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
    'Password must contain at least one lowercase letter, one uppercase letter, one symbol, and one number'
  ).when("password", {
    is: (password) => password,
    then: Yup.string(),
  }),
})

const validateSchema2 = Yup.object().shape({
  otp: Yup.string().required("OTP is required.").length(6, "Invalid OTP")
})

export default function AccouctSetting() {
  const userServ = new UserService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [successMsg1, setSuccessMsg1] = useState("");
  const [OTP, setOtp] = useState("");
  const [initialValue, setInitialValue] = useState({
    user_name: user.user_name || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    date_of_birth: moment(user.date_of_birth).format("YYYY-MM-DD") || ""
  });
  const [show, setShow] = useState(false);
  const [initialValue1, setInitialValue1] = useState({
    password: "",
    verifyPassword: "",
    newPassword: "",
  })

  const [inititalValue2, setInitialValue2] = useState({ otp: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [shownewPassword, setShownewPassword] = useState(false);
  const [showverifyPassword, setShowVerifyPassword] = useState(false);

  const handleClose = () => {
    setShow(false);
    formik2.resetForm();
    formik1.resetForm();
    formik.resetForm();
  };
  const handleShow = () => setShow(true);

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

  const onSubmit1 = async (values) => {
    try {
      const obj = {
        email: formik.values.email,
        username: formik.values.user_name
      }
      const resp = await userServ.passUpdateotp(obj);
      if (resp?.result === true) {
        handleShow();
      }
    } catch (err) {
      toast.error(err.response.data.err);
      console.log(err);
    }
  }

  const formik1 = useFormik({
    initialValues: initialValue1,
    validateOnBlur: true,
    onSubmit: onSubmit1,
    validationSchema: ValidateSchema1,
    enableReinitialize: true
  });

  const onSubmit2 = async () => {
    try {
      let obj = {
        email: formik.values.email,
        password: formik1.values.password,
        username: formik.values.user_name,
        newPassword: formik1.values.newPassword,
        verifyPassword: formik1.values.verifyPassword,
        otp: formik2.values.otp
      }

      await userServ.updatePassword(obj)
        .then((res) => {
          if (res.status === 300) {
            toast.error(res.message)
          } else {
            toast.success("Password updated successfully.")
            handleClose()
            formik2.resetForm();
            formik1.resetForm();
            formik.resetForm();
          }
        })
        .catch((err) => { toast.error(err) })
    } catch (error) {
      toast.success(error.err, {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true
      });
    }
  }


  const formik2 = useFormik({
    initialValues: inititalValue2,
    validateOnBlur: true,
    onSubmit: onSubmit2,
    validationSchema: validateSchema2,
    enableReinitialize: true
  })

  const handleResend = () => {
    toast.info(`We have sent an OTP to your ${formik.values.email}; please check your inbox for the one-time password`)
    onSubmit1();
  }





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
                {errorMsg && <div className="valid_feedbackMsg text-center">{errorMsg}</div>}
                {successMsg && <div className="valid_feedbackMsg valid_feedbackMsgCustom text-center">{successMsg}</div>}
                <div className=" profileform_btn pt-1 pt-lg-1 pb-1 settingsaveBtn">
                  {/* <a href="javascript:void(0)" className="editComm_btn me-3">
                    {" "}
                    Cancel
                  </a> */}
                  <button href="javascript:void(0);" type="submit" className="btn btnColor">
                    Save changes
                  </button>
                </div>
              </div>
            </form>
            <form onSubmit={formik1.handleSubmit}>
              <div className="customGroup1">
                <div className="mb-3 mb-sm-4 commonform commonform_custom">
                  <label htmlFor="Old_password" className="form-label">Current Password</label>
                  <div className="password_input_box">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={
                        "form-control mb_20" + (formik1.touched.password && formik1.errors.password ? " is-invalid" : "")
                      }
                      id="userpass"
                      placeholder=""
                      name="password"
                      onChange={formik1.handleChange}
                      onBlur={formik1.handleBlur}
                      value={formik1.values.password}
                    />
                    {showPassword && <span className="eye_icon" onClick={() => setShowPassword(!showPassword)}><IoEyeOffOutline /></span>}
                    {!showPassword && <span className="eye_icon" onClick={() => setShowPassword(!showPassword)}><IoEyeOutline /></span>}
                  </div>

                  {formik1.touched.password && formik1.errors.password ? (
                    <div className="valid_feedbackMsg">{formik1.errors.password}</div>
                  ) : null}
                </div>
                <div className="mb-3 mb-sm-4 commonform commonform_custom">
                  <label htmlFor="New_password" className="form-label">New Password</label>
                  <div className="password_input_box">
                    <input
                      type={shownewPassword ? "text" : "password"}
                      className={
                        "form-control mb_20" +
                        (formik1.touched.newPassword && formik1.errors.newPassword ? " is-invalid" : "")
                      }
                      id="usernewpass"
                      placeholder=""
                      name="newPassword"
                      onChange={formik1.handleChange}
                      onBlur={formik1.handleBlur}
                      value={formik1.values.newPassword}
                    />
                    {shownewPassword && <span className="eye_icon" onClick={() => setShownewPassword(!shownewPassword)}><IoEyeOffOutline /></span>}
                    {!shownewPassword && <span className="eye_icon" onClick={() => setShownewPassword(!shownewPassword)}><IoEyeOutline /></span>}
                  </div>
                  {formik1.touched.newPassword && formik1.errors.newPassword ? (
                    <div className="valid_feedbackMsg">{formik1.errors.newPassword}</div>
                  ) : null}
                </div>
                <div className="mb-3 mb-sm-4 commonform commonform_custom">
                  <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                  <div className="password_input_box">
                    <input
                      type={showverifyPassword ? "text" : "password"}
                      className={
                        "form-control mb_20" +
                        (formik1.touched.verifyPassword && formik1.errors.verifyPassword ? " is-invalid" : "")
                      }
                      id="Retype new password"
                      placeholder=""
                      name="verifyPassword"
                      onChange={formik1.handleChange}
                      onBlur={formik1.handleBlur}
                      value={formik1.values.verifyPassword}
                    />
                    {showverifyPassword && <span className="eye_icon" onClick={() => setShowVerifyPassword(!showverifyPassword)}><IoEyeOffOutline /></span>}
                    {!showverifyPassword && <span className="eye_icon" onClick={() => setShowVerifyPassword(!showverifyPassword)}><IoEyeOutline /></span>}
                  </div>
                  {formik1.touched.verifyPassword && formik1.errors.verifyPassword ? (
                    <div className="valid_feedbackMsg">{formik1.errors.verifyPassword}</div>
                  ) : null}
                </div>
                <div className=" profileform_btn pt-1 pt-lg-1 pb-1 settingsaveBtn">
                  {/* <a href="javascript:void(0)" className="editComm_btn me-3">
                    {" "}
                    Cancel
                  </a> */}
                  <button href="javascript:void(0);" type="submit" className="btn btnColor">
                    Change password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <form onSubmit={formik2.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>OTP Verification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              placeholder="Enter OTP"
              style={{ width: "100%", fontSize: "18px", borderRadius: "5px" }}
              name="otp"
              type="number"
              onChange={formik2.handleChange}
              onBlur={formik2.handleBlur}
              value={formik2.values.otp}
              className="px-2 py-1 no-spinners"
            />
            {formik2.touched.otp && formik2.errors.otp ? (
              <div className="valid_feedbackMsg">{formik2.errors.otp}</div>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" style={{ borderRadius: "10px" }} onClick={handleResend}>
              Resend
            </Button>
            <Button type="submit" variant="#00808b" style={{ backgroundColor: "#00808b", color: "white", borderRadius: "10px" }}>
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}




{/* <div className="customGroup">
                <div className="commonform commonform_custom-password">
                  <label className="form-label">Password</label>
                  {/* <input type="password" className="form-control mb_20" id="userpass" placeholder="Enter current password" />
                                    <input type="password" className="form-control mb_20" id="usernewpass" placeholder="Enter new password" />
                                    <input type="password" className="form-control" placeholder="Retype new password" /> */}
//   <div className="password-setting-field">
//     <input
//       type="password"
//       className={
//         "form-control mb_20" + (formik.touched.password && formik.errors.password ? " is-invalid" : "")
//       }
//       id="userpass"
//       placeholder="Enter current password"
//       name="password"
//       onChange={formik.handleChange}
//       onBlur={formik.handleBlur}
//       value={formik.values.password}
//     />
//     {formik.touched.password && formik.errors.password ? (
//       <div className="valid_feedbackMsg">{formik.errors.password}</div>
//     ) : null}
//     <input
//       type="password"
//       className={
//         "form-control mb_20" +
//         (formik.touched.newPassword && formik.errors.newPassword ? " is-invalid" : "")
//       }
//       id="usernewpass"
//       placeholder="Enter new password"
//       name="newPassword"
//       onChange={formik.handleChange}
//       onBlur={formik.handleBlur}
//       value={formik.values.newPassword}
//     />
//     {formik.touched.newPassword && formik.errors.newPassword ? (
//       <div className="valid_feedbackMsg">{formik.errors.newPassword}</div>
//     ) : null}
//     <input
//       type="password"
//       className={
//         "form-control mb_20" +
//         (formik.touched.verifyPassword && formik.errors.verifyPassword ? " is-invalid" : "")
//       }
//       id="Retype new password"
//       placeholder="Retype new password"
//       name="verifyPassword"
//       onChange={formik.handleChange}
//       onBlur={formik.handleBlur}
//       value={formik.values.verifyPassword}
//     />
//     {formik.touched.verifyPassword && formik.errors.verifyPassword ? (
//       <div className="valid_feedbackMsg">{formik.errors.verifyPassword}</div>
//     ) : null}
//   </div>
// </div>
// </div> */}




{/* <div className="commonform commonform_custom-password">
                  <label className="form-label">Old Password</label>
                  {/* <input type="password" className="form-control mb_20" id="userpass" placeholder="Enter current password" />
                                    <input type="password" className="form-control mb_20" id="usernewpass" placeholder="Enter new password" />
                                    <input type="password" className="form-control" placeholder="Retype new password" /> */}
// <div className="password-setting-field">
//   <input
//     type="password"
//     className={
//       "form-control mb_20" + (formik1.touched.password && formik1.errors.password ? " is-invalid" : "")
//     }
//     id="userpass"
//     placeholder="Enter current password"
//     name="password"
//     onChange={formik1.handleChange}
//     onBlur={formik1.handleBlur}
//     value={formik1.values.password}
//   />
//   {formik1.touched.password && formik1.errors.password ? (
//     <div className="valid_feedbackMsg">{formik1.errors.password}</div>
//   ) : null}
//   <input
//       type="password"
//       className={
//         "form-control mb_20" +
//         (formik1.touched.newPassword && formik1.errors.newPassword ? " is-invalid" : "")
//       }
//       id="usernewpass"
//       placeholder="Enter new password"
//       name="newPassword"
//       onChange={formik1.handleChange}
//       onBlur={formik1.handleBlur}
//       value={formik1.values.newPassword}
//     />
//     {formik1.touched.newPassword && formik1.errors.newPassword ? (
//       <div className="valid_feedbackMsg">{formik1.errors.newPassword}</div>
//     ) : null}
//     <input
//       type="password"
//       className={
//         "form-control mb_20" +
//         (formik1.touched.verifyPassword && formik1.errors.verifyPassword ? " is-invalid" : "")
//       }
//       id="Retype new password"
//       placeholder="Retype new password"
//       name="verifyPassword"
//       onChange={formik1.handleChange}
//       onBlur={formik1.handleBlur}
//       value={formik1.values.verifyPassword}
//     />
//     {formik1.touched.verifyPassword && formik1.errors.verifyPassword ? (
//       <div className="valid_feedbackMsg">{formik1.errors.verifyPassword}</div>
//     ) : null}
//   </div>
// </div> */}