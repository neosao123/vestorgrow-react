import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import { useFormik } from "formik";
import * as Yup from "yup";
import getGoogleOAuthURL from "../../util/getGoogleOAuthURL";

const serv = new UserService();

const ValidateSchema = Yup.object({
  email: Yup.string().required("Email is a required field").email(),
  password: Yup.string().required("Password is a required field"),
  user_name: Yup.string().required("User Name is a required field"),
});
function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loginObj, setLoginObj] = new useState({
    email: "",
    password: "",
    user_name: "",
  });

  const onSubmit = async (values) => {
    let obj = { ...values };
    try {
      const resp = await serv.signup(obj);
      if (resp?.data) {
        localStorage.setItem("user", JSON.stringify(resp.data));
        navigate("/signup/inactive", { state: { email: obj.email } });
      } else {
        setErrorMsg(resp.err);
      }
    } catch (err) {
      err = JSON.parse(err.message);
      setErrorMsg(err.err);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const formik = useFormik({
    initialValues: loginObj,
    validateOnBlur: true,
    onSubmit,
    validationSchema: ValidateSchema,
    enableReinitialize: true,
  });

  const googleSignUpHandler = () => {
    getGoogleOAuthURL();
  };

  return (
    <main className="w-100 clearfix socialMediaTheme bgColor">
      {/* login page Start*/}
      <div className="signupLogo signupLogo_div">
        <a href="/" alt="logo" className="img-fluid signupLogo_a">
          <img src="/images/profile/logo_image-main.svg" className="img-fluid img-logo" alt="" />
        </a>
      </div>
      <div className="main_container position-relative">
        <div className="sigUpSection sigUpSection-customPadding">
          <div className="signUphead text-center signUpheadCustom">
            <h3>Join VestorGrow</h3>
            <p className="pb-2 pb-sm-4">Create an account to continue.</p>
          </div>
          <div className="signUpform signUpform-paddingCustom">
            <div className="signUpWith_google text-center" id="signUpDiv">
              <a href={getGoogleOAuthURL()} className="goggleBtn_link" onClick={googleSignUpHandler}>
                <img src="/images/profile/google.svg" alt="google-icon" />
                Sign up with Google
              </a>
            </div>
            <div className="notA_member OR_text d-flex align-items-center justify-content-center-Custom">
              <span />
              <h5>OR</h5>
              <span />
            </div>
            <div className="signUpInnerForm">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3 mb-sm-4 commonform">
                  <label htmlFor="username" className="form-label">
                    Username*
                  </label>
                  {/* <input type="text" className="form-control" id="username" defaultValue="Michael42" /> */}
                  <input
                    className={
                      "form-control" + (formik.touched.user_name && formik.errors.user_name ? " is-invalid" : "")
                    }
                    placeholder=""
                    name="user_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.user_name}
                  />
                  {formik.touched.user_name && formik.errors.user_name ? (
                    <div className="valid_feedbackMsg">{formik.errors.user_name}</div>
                  ) : null}
                </div>
                <div className="mb-3 mb-sm-4 commonform">
                  <label htmlFor="userEmail" className="form-label">
                    Email*
                  </label>
                  {/* <input type="text" className="form-control" id="userEmail" defaultValue="michaelphilip@gmail.com" /> */}
                  <input
                    className={"form-control" + (formik.touched.email && formik.errors.email ? " is-invalid" : "")}
                    placeholder=""
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="valid_feedbackMsg">{formik.errors.email}</div>
                  ) : null}
                </div>
                <div className="commonform">
                  <label htmlFor="passwordLogin" className="form-label">
                    Create Password*
                  </label>
                  <div className="position-relative">
                    <input
                      className={
                        "form-control" + (formik.touched.password && formik.errors.password ? " is-invalid" : "")
                      }
                      type={showPassword ? "text" : "password"}
                      placeholder=""
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="valid_feedbackMsg">{formik.errors.password}</div>
                    ) : null}
                    <span className="showHidetoggle">
                      {!formik.errors.password ? (
                        showPassword ? (
                          <img
                            src="/images/profile/show_pass.svg"
                            className="showLoginPass"
                            onClick={handleShowPassword}
                            alt=""
                          />
                        ) : (
                          <img
                            src="/images/profile/Hide-pass.svg"
                            className="showLoginPass"
                            onClick={handleShowPassword}
                            alt=""
                          />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
                {errorMsg && <div className="valid_feedbackMsg text-center">{errorMsg}</div>}
                <div className="loginBtn  btn-signup">
                  <button type="submit" className="btn btnColor w-100">
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="signInLink signInLink-custom">
            <p>
              Already have account ?
              <a href="javascript:void(0)" className="ms-2" onClick={() => navigate("/login")}>
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* login page End */}
    </main>
  );
}
export default Signup;
