import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import { useFormik } from "formik";
import * as Yup from "yup";

const serv = new UserService();
const ValidateSchema = Yup.object({
  email: Yup.string().required("Email is a required field").email(),
});
function ForgotPassword() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loginObj, setLoginObj] = new useState({
    email: "",
  });

  const onSubmit = async (values) => {
    let obj = { ...values };
    try {
      const resp = await serv.sendOtp(obj);
      if (resp?.result) {
        navigate("/resetpassword", { state: { email: obj.email } });
      } else {
        setErrorMsg(resp);
      }
    } catch (err) {
      err = JSON.parse(err);
      setErrorMsg(err.err);
    }
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
          <div className="loginFormLeftInner loginFormLeftInner-custom">
            {/* <div className="loginLogo">
              <img src="/images/profile/logo-white.png" className="img-fluid" />
            </div> */}
            <div className="login_heading">
              <h2>Forgot Password</h2>
              {/* <p>Please enter your Username or Email below and we will send you a OTP for your password recovery</p> */}
              <p>Please enter your Email below and we will send you a OTP for your password recovery</p>
            </div>
            <div className="logInform">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3 mb-sm-4 commonform">
                  <label htmlFor="username" className="form-label">
                    {/*  Username or Email* */}
                    Email
                  </label>
                  {/* <input type="text" className="form-control" id="username" defaultValue="michaelphilip@gmail.com" required /> */}
                  <input
                    className={"form-control" + (formik.touched.email && formik.errors.email ? " is-invalid" : "")}
                    // placeholder="john@mavefi.com"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="valid_feedbackMsg">{formik.errors.email}</div>
                  ) : null}
                </div>
                {errorMsg && <div className="valid_feedbackMsg text-center">{errorMsg}</div>}
                <div className="loginBtn">
                  <button type="submit" href="javascript:void(0);" className="btn btnColor w-100">
                    Send OTP
                  </button>
                </div>
              </form>
              <div className="loginPara text-center">
                <p>
                  <a href="javascript:void(0)" className="join" onClick={() => navigate("/login")}>
                    SIgn In
                  </a>{" "}
                  to unlock the best of VestorGrow
                </p>
                {/* <p className="mt-3 mt-sm-4">By proceeding you agree to our <a href="javascript:void(0)" className="text-dark">Terms of Use</a> and confirm
                                you have read our <a href="javascript:void(0)" className="text-dark">Privacy and Cookie Statement</a>.</p> */}
              </div>
            </div>
            {/* <div className="notA_member d-flex align-items-center">
                            <span />
                            <p className="mb-0">SignIn</p>
                            <span />
                        </div> */}
            {/* <div className="loginPara text-center mt-3">
              <p>
                <a href="javascript:void(0)" className="join" onClick={() => navigate("/login")}>
                  SIgn In
                </a>{" "}
                to unlock the best of VestorGrow
              </p>
              // <p className="mt-3 mt-sm-4">By proceeding you agree to our <a href="javascript:void(0)" className="text-dark">Terms of Use</a> and confirm
              //                   you have read our <a href="javascript:void(0)" className="text-dark">Privacy and Cookie Statement</a>.</p> 
            </div> */}
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
export default ForgotPassword;
