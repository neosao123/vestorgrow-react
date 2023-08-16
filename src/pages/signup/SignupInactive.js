import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import UserService from "../../services/UserService";

const serv = new UserService();
function SignupInactiveLink() {
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState("");
  const handleResendLink = async () => {
    try {
      const resp = await serv.signupActivationLink(location.state.email);
      if (resp?.data) {
      } else {
        setErrorMsg(resp.error);
      }
    } catch (err) {
      err = JSON.parse(err.message);
      setErrorMsg(err.err);
    }
  };
  return (
    <main className="w-100 clearfix socialMediaTheme bgColor">
      {/* login page Start*/}
      <div className="signupLogo signupLogo_div">
        <a href="/" alt="logo" className="img-fluid signupLogo_a">
          <img src="/images/profile/logo_image-main.svg" className="img-fluid img-logo" alt="" />
        </a>
      </div>
      <div className="main_container">
        <div className="sigUpSection2">
          <div className="signUphead text-center">
            <h3>We have sent you a confirmation email</h3>
            <p>
              Click on the link we have sent you to activate your account.
              <br />
              If you don’t have it in your inbox please check spam/junk folder.
            </p>
          </div>
          <div className="notA_member OR_text d-flex align-items-center or-text-line">
            <span />
            <h5>OR</h5>
            <span />
          </div>
          <div className="resendActiation_link text-center">
            <a href="javasript:void(0);" className="btn btn-1" onClick={handleResendLink}>
              Resend Activation Link{" "}
            </a>
          </div>
        </div>
      </div>
      {/* login page End */}
    </main>
  );
}
export default SignupInactiveLink;
