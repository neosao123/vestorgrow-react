import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import { useFormik } from "formik";
import * as Yup from "yup";
import GlobalContext from "../../context/GlobalContext";
import Loader from "../../components/Loader";

const serv = new UserService();

const ValidateSchema = Yup.object({
  email: Yup.string().required("Email is a required field"),
  password: Yup.string().required("Password is a required field"),
});

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const globalCtx = useContext(GlobalContext);
  const [isAuthentiCated, setIsAuthentiCated] = globalCtx.auth;
  const [user, setUser] = globalCtx.user;
  const [tempUser, setTempUser] = globalCtx.tempUser;
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState();
  const [loginObj, setLoginObj] = new useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setLoading(true)
    let obj = { ...values };
    try {
      const resp = await serv.login(obj);
      if (resp?.token) {
        const loginUser = resp.data;
        setIsAuthentiCated(true);
        localStorage.setItem("user", JSON.stringify(resp.data))
        setUser(resp.data);
        setTempUser(resp?.data)
        if (loginUser.accountVerified === true) {
          var hasGroupInvite = localStorage.getItem("group_invite");
          if (hasGroupInvite !== null && hasGroupInvite !== "") {
            localStorage.removeItem('group_invite');
            setLoading(false)
            navigate(hasGroupInvite);
          } else {
            setLoading(false)
            if (user.usernameUpdate === false) {
              navigate("/add_username", { replace: true })
            }
            else if (user.profilepictureUpdate === false) {
              navigate("/update_profile", { replace: true })
            }
            else if (user.bioUpdate === false) {
              navigate("/bio", { replace: true })
            }
            else if (user.UserSuggestions === false) {
              navigate("/usersuggestions1", { replace: true })
            }
            else if (user.groupSuggestion === false) {
              navigate("/groupsuggestion1", { replace: true })
            }
            else if (user.usernameUpdate === true && user.profilepictureUpdate === true && user.bioUpdate === true && user.groupSuggestion === true && user.UserSuggestions === true && user.ProfileUpdates === true) {
              navigate("/", { replace: true })
            }

          }
        } else {
          const resp = await serv.signinActivationLink(loginUser.email);
          if (resp?.result) {
            setLoading(false)
            navigate("/signin/inactive", { state: { email: loginUser.email } });

          } else {
            setLoading(false)
            setErrorMsg(resp.error);
          }
        }
      } else if (resp.message) {
        setLoading(false)
        setShowOtp(true);
      } else {
        setLoading(false)
        setErrorMsg(resp);
      }
    } catch (err) {
      setLoading(false)
      err = JSON.parse(err.message);
      setErrorMsg(err.err);
    }
  };

  const handleSubmitOtp = async () => {
    try {
      let obj = {
        ...formik.values,
        otp: otp,
      };
      const resp = await serv.otpLogin(obj);
      if (resp?.token) {
        setIsAuthentiCated(true);
        setUser(resp.data);
        const loginUser = resp.data;
        if (loginUser.accountVerified === true) {
          var hasGroupInvite = localStorage.getItem("group_invite");
          if (hasGroupInvite !== null && hasGroupInvite !== "") {
            navigate(hasGroupInvite);
          } else {
            if (user.usernameUpdate === false) {
              navigate("/add_username", { replace: true })
            }
            else if (user.profilepictureUpdate === false) {
              navigate("/update_profile", { replace: true })
            }
            else if (user.bioUpdate === false) {
              navigate("/bio", { replace: true })
            }
            else if (user.UserSuggestions === false) {
              navigate("/usersuggestions1", { replace: true })
            }
            else if (user.groupSuggestion === false) {
              navigate("/groupsuggestion1", { replace: true })
            }
            else if (user.usernameUpdate === true && user.profilepictureUpdate === true && user.bioUpdate === true && user.groupSuggestion === true && user.UserSuggestions === true && user.ProfileUpdates === true) {
              navigate("/", { replace: true })
            }
          }
        } else {
          const resp = await serv.signinActivationLink(loginUser.email);
          if (resp?.result) {
            navigate("/signin/inactive", { state: { email: loginUser.email } });
          } else {
            setErrorMsg(resp.error);
          }
        }
      } else if (resp.message) {
        setShowOtp(true);
      } else {
        setErrorMsg(resp);
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

  return loading ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", maxHeight: "100vh" }}><Loader /></div> : (
    <main className="w-100 clearfix socialMediaTheme" style={{ height: "100vh", marginTop: "-32px" }}>
      {/* login page Start*/}
      <div className="loginpage d-flex">
        <div className="loginForm_left loginForm_left_flex">
          <div className="loginLogo">
            <a href="/">
              <img src="/images/profile/logo_image-main.svg" className="img-fluid img-logo" alt="logo" />
            </a>
          </div>
          <div className="loginFormLeftInner">
            <div className="login_heading">
              <h2>Log in</h2>
              <p>Welcome back</p>
            </div>
            <div className="logInform">
              {showOtp ? (
                <div>
                  <div className="mb-3 mb-sm-4 commonform">
                    <label htmlFor="username" className="form-label">
                      OTP
                    </label>
                    {/* <input type="text" className="form-control" id="username" defaultValue="michaelphilip@gmail.com" required /> */}
                    <input
                      className={"form-control" + (otp ? "" : "")}
                      placeholder="123456"
                      name="otp"
                      onChange={(e) => setOtp(e.target.value)}
                      value={otp}
                    />
                    {/* {formik.touched.email && formik.errors.email ? (
                                        <div className="valid_feedbackMsg">
                                            {formik.errors.email}
                                        </div>
                                    ) : null} */}
                  </div>
                  {errorMsg && <div className="valid_feedbackMsg text-center">{errorMsg}</div>}
                  <div className="loginBtn">
                    <button onClick={handleSubmitOtp} className="btn btnColor w-100">
                      Log In
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3 mb-sm-4 commonform">
                    <label htmlFor="username" className="form-label">
                      Username or Email*
                    </label>
                    {/* <input type="text" className="form-control" id="username" defaultValue="michaelphilip@gmail.com" required /> */}
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
                      Password*
                    </label>
                    <div className="position-relative">
                      {/* <input type="password" className="form-control" id="passwordLogin" defaultValue={123123123} /> */}
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
                          !showPassword ? (
                            <img
                              src="/images/profile/show_pass.svg"
                              className="showLoginPass"
                              onClick={handleShowPassword}
                              alt=""
                            />
                          ) : (
                            <img
                              src="/images/profile/Hide-pass.svg"
                              className="hideLoginPass"
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
                  <a href="javascript:void(0)" className="forget_pass my-3" onClick={() => navigate("/forgotpassword")}>
                    Forgot Password?
                  </a>
                  {errorMsg && <div className="valid_feedbackMsg text-center">{errorMsg}</div>}
                  <div className="loginBtn">
                    <button type="submit" className="btn btnColor w-100">
                      Log In
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div className="notA_member d-flex align-items-center">
              <span />
              <p className="mb-0">Not a member?</p>
              <span />
            </div>
            <div className="loginPara text-center mt-3">
              <p>
                <a href="javascript:void(0)" className="join" onClick={() => navigate("/join")}>
                  <span className="underline_span-text">Join</span>
                </a>{" "}
                to unlock the best of VestorGrow.
              </p>
              <p className="mt-3 mt-sm-4">
                By proceeding you agree to our{" "}
                <a href="javascript:void(0)" className="text-dark">
                  <span className="underline_span-text">Terms of Use</span>
                </a>{" "}
                and confirm you have read our{" "}
                <a href="javascript:void(0)" className="text-dark">
                  <span className="underline_span-text">Privacy and Cookie Statement</span>
                </a>
                .
              </p>
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
export default Login;
