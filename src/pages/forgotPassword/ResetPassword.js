import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserService from "../../services/UserService";
import { useFormik } from "formik";
import * as Yup from "yup";

const serv = new UserService();
const ValidateSchema = Yup.object({
  newPassword: Yup.string().required("New Password is a required field"),
  otp: Yup.string().required("OTP is a required field"),
  verifyPassword: Yup.string().required("Verify Password is a required field"),
});
function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVeri, setShowPasswordVeri] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loginObj, setLoginObj] = new useState({
    otp: "",
    newPassword: "",
    verifyPassword: "",
  });
  const resendOtp = async () => {
    let obj = {
      email: location.state.email,
    };
    try {
      const resp = await serv.sendOtp(obj);
      if (resp?.result) {
      } else {
        setErrorMsg(resp.error);
      }
    } catch (err) {
      err = JSON.parse(err.message);
      setErrorMsg(err.err);
    }
  };
  const onSubmit = async (values) => {
    let obj = { ...values };
    obj.email = location.state.email;
    try {
      const resp = await serv.resetPassword(obj);
      if (resp?.result) {
        navigate("/login");
      } else {
        setErrorMsg(resp);
      }
    } catch (err) {
      err = JSON.parse(err);
      setErrorMsg(err.err);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleShowPasswordVeri = () => {
    setShowPasswordVeri(!showPasswordVeri);
  };
  const formik = useFormik({
    initialValues: loginObj,
    validateOnBlur: true,
    onSubmit,
    validationSchema: ValidateSchema,
    enableReinitialize: true,
  });
  return (
    <main className="w-100 clearfix socialMediaTheme">
      {/* login page Start*/}
      <div className="loginpage d-flex">
        <div className="loginForm_left loginForm_left_flex">
          <a href="/" className="loginLogo">
            <img src="/images/profile/logo_image-main.svg" className="img-fluid img-logo" />
          </a>
          <div className="loginFormLeftInner">
            {/* <div className="loginLogo">
              <img src="/images/profile/logo-white.png" className="img-fluid" />
            </div> */}
            <div className="login_heading">
              <h2>Reset Password</h2>
              <p>We have sent the OTP to the email provided if it’s associated with an account.</p>
              <p>
                Can’t find it? Check your junk folder or
                <a href="#"> contact us</a>
              </p>{" "}
            </div>
            <div className="logInform">
              <form onSubmit={formik.handleSubmit}>
                <div className="commonform">
                  <label htmlFor="passwordLogin" className="form-label">
                    OTP
                  </label>
                  <div className="position-relative">
                    {/* <input type="password" className="form-control" id="passwordLogin" defaultValue={123123123} /> */}
                    <input
                      className={"form-control" + (formik.touched.otp && formik.errors.otp ? " is-invalid" : "")}
                      type="text"
                      placeholder=""
                      name="otp"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.otp}
                    />
                    {formik.touched.otp && formik.errors.otp ? (
                      <div className="valid_feedbackMsg">{formik.errors.otp}</div>
                    ) : null}
                  </div>
                </div>
                <div className="commonform">
                  <label htmlFor="passwordLogin" className="form-label">
                    New Password
                  </label>
                  <div className="position-relative">
                    {/* <input type="password" className="form-control" id="passwordLogin" defaultValue={123123123} /> */}
                    <input
                      className={
                        "form-control" + (formik.touched.newPassword && formik.errors.newPassword ? " is-invalid" : "")
                      }
                      type={showPassword ? "text" : "password"}
                      placeholder=""
                      name="newPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.newPassword}
                    />
                    {formik.touched.newPassword && formik.errors.newPassword ? (
                      <div className="valid_feedbackMsg">{formik.errors.newPassword}</div>
                    ) : null}
                    <span className="showHidetoggle">
                      {!formik.errors.newPassword ? (
                        showPassword ? (
                          <img
                            src="/images/profile/show_pass.svg"
                            className="showLoginPass"
                            onClick={handleShowPassword}
                          />
                        ) : (
                          <img
                            src="/images/profile/Hide-pass.svg"
                            className="hideLoginPass"
                            onClick={handleShowPassword}
                          />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
                <div className="commonform">
                  <label htmlFor="passwordLogin" className="form-label">
                    Verify Password
                  </label>
                  <div className="position-relative">
                    {/* <input type="password" className="form-control" id="passwordLogin" defaultValue={123123123} /> */}
                    <input
                      className={
                        "form-control" +
                        (formik.touched.verifyPassword && formik.errors.verifyPassword ? " is-invalid" : "")
                      }
                      type={showPasswordVeri ? "text" : "password"}
                      placeholder=""
                      name="verifyPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.verifyPassword}
                    />
                    {formik.touched.verifyPassword && formik.errors.verifyPassword ? (
                      <div className="valid_feedbackMsg">{formik.errors.verifyPassword}</div>
                    ) : null}
                    <span className="showHidetoggle">
                      {!formik.errors.verifyPassword ? (
                        showPasswordVeri ? (
                          <img
                            src="/images/profile/show_pass.svg"
                            className="showLoginPass"
                            onClick={handleShowPasswordVeri}
                          />
                        ) : (
                          <img
                            src="/images/profile/Hide-pass.svg"
                            className="hideLoginPass"
                            onClick={handleShowPasswordVeri}
                          />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
                <a href="javascript:void(0)" className="forget_pass my-3" onClick={resendOtp}>
                  Resend OTP
                </a>
                {errorMsg && <div className="valid_feedbackMsg text-center">{errorMsg}</div>}
                <div className="loginBtn">
                  <button type="submit" href="javascript:void(0);" className="btn btnColor w-100">
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
            {/* <div className="notA_member d-flex align-items-center">
                            <span />
                            <p className="mb-0">SignIn</p>
                            <span />
                        </div> */}
            <div className="loginPara text-center mt-3">
              <p>
                <a href="javascript:void(0)" className="join" onClick={() => navigate("/login")}>
                  SIgn In
                </a>{" "}
                to unlock the best of Trading view.
              </p>
              {/* <p className="mt-3 mt-sm-4">By proceeding you agree to our <a href="javascript:void(0)" className="text-dark">Terms of Use</a> and confirm
                                you have read our <a href="javascript:void(0)" className="text-dark">Privacy and Cookie Statement</a>.</p> */}
            </div>
          </div>
        </div>
        <div className="loginRight_img">
          <img src="/images/profile/login-image.png" className="img-fluid" />
        </div>
      </div>
      {/* login page End */}
    </main>
  );
}
export default ResetPassword;
