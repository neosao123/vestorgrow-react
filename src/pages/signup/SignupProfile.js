import { useState, useContext, useEffect } from "react";
import UserService from "../../services/UserService";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import EditProfileImage from "../../popups/profile/EditProfileImage";
import ProfileImgEdit from "./ProfileImgEdit";
import AccountVerifiedSuccessfully from "./AccountVerified";
import AccountVerificationFailed from "./AccountVerificationFailed";

const serv = new UserService();

const ValidateSchema = Yup.object({
  first_name: Yup.string().required("First Name is a required field").min(2, "Minimum two characters required.").notOneOf(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '<', ',', '>', '.', '?', '/', '{', '}', '[', ']', '|'], 'Invalid first name.'),
  last_name: Yup.string().required("Last Name is a required field").min(2, "Minimum two characters required.").notOneOf(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '<', ',', '>', '.', '?', '/', '{', '}', '[', ']', '|'], 'Invalid first name.'),
  profile_img: Yup.string(),
});

function SignupProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const globalCtx = useContext(GlobalContext);
  const [isAuthentiCated, setIsAuthentiCated] = globalCtx.auth;
  const [user, setUser] = globalCtx.user;
  const [errorMsg, setErrorMsg] = useState("");
  const [prevImg, setPrevImg] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropedImg, setcropedImg] = useState(null);
  const [verificationSuccessPopup, setVerificationSuccessPopup] = useState(false)
  const [verificationFailedPopup, setVerificationFailedPopup] = useState(false)

  const [loginObj, setLoginObj] = new useState({
    first_name: "",
    last_name: "",
    profile_img: "",
  });
  let pathName = location.pathname.split("/");

  useEffect(() => {
    let token = pathName[pathName.length - 1];
    serv.updateAccountActivated(token)
      .then((res) => {
        if (res.status === true) {
          setVerificationSuccessPopup(!verificationSuccessPopup)
        }
      })
  }, [])

  const handlePostSuccessPopup = () => {
    setVerificationSuccessPopup(!verificationSuccessPopup);
  };

  const handlePostFailedPopup = () => {
    setVerificationFailedPopup(!verificationFailedPopup);
  };

  const handleProfileImage = (img) => {
    formik.setFieldValue("profile_img", img);
    setPrevImg(img);
    setShowCropper(false);
    setcropedImg(null);
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("profile_img", values.profile_img);
    formData.append("active_token", pathName[pathName.length - 1]);
    try {
      const resp = await serv.addProfile(formData);
      if (resp?.data) {
        setIsAuthentiCated(true);
        setUser(resp.data.result);
        navigate("/usersuggestion");
      } else {
        setErrorMsg(resp.err);
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
    <>
      <main className="w-100 clearfix socialMediaTheme bgColor">
        {/* login page Start*/}
        <div className="signupLogo signupLogo_div signupLogo_div-addprofile">
          <a href="#" alt="logo" className="img-fluid signupLogo_a">
            <img src="/images/profile/logo_image-main.svg" className="img-fluid img-logo" />
          </a>
        </div>
        {/* <div className="signUplogo paddingbottom">
        <img src="/images/profile/logo-icon-main.svg" className="img-fluid" />
        <img
          src="/images/profile/logo-icon-name.svg"
          className="img-fluid-texta"
        />
      </div> */}
        <div className="main_container">
          <div className="sigUpSection2">
            <div className="signUphead text-center mt-0">
              <h3>Profile </h3>
              <p>Add a profile image</p>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="SignupProfile_data">
                <label for="fileInput" className="choose_photo" id="chooseFilebtn" onClick={() => setShowCropper(true)}>
                  {prevImg ? (
                    <img className="mb-0 profile_image" src={window.URL.createObjectURL(prevImg)} alt="profile-pic" />
                  ) : (
                    <p className="mb-0">Choose photo</p>
                  )}
                  {/* <input id="fileInput" type="file" hidden /> */}
                  <input
                    type="file"
                    className="form-control"
                    id="fileInput"
                    hidden
                    onChange={(event) => {
                      // formik.setFieldValue("profile_img", event.currentTarget.files[0]);
                      setPrevImg(event.currentTarget.files[0]);
                      setcropedImg(event.currentTarget.files[0]);
                    }}
                  />
                </label>
                <div className="mb-3 mb-sm-4 commonform">
                  <label htmlFor="userfname" className="form-label">
                    First Name
                  </label>
                  {/* <input type="text" className="form-control" id="userfname" defaultValue="Hamza" /> */}
                  <input
                    className={
                      "form-control" + (formik.touched.first_name && formik.errors.first_name ? " is-invalid" : "")
                    }
                    placeholder=""
                    name="first_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.first_name}
                  />
                  {formik.touched.first_name && formik.errors.first_name ? (
                    <div className="valid_feedbackMsg">{formik.errors.first_name}</div>
                  ) : null}
                </div>
                <div className="mb-3 mb-sm-4 commonform">
                  <label htmlFor="userlname" className="form-label">
                    Last Name
                  </label>
                  {/* <input type="text" className="form-control" id="userlname" defaultValue="Anjum" /> */}
                  <input
                    className={
                      "form-control" + (formik.touched.last_name && formik.errors.last_name ? " is-invalid" : "")
                    }
                    placeholder=""
                    name="last_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.last_name}
                  />
                  {formik.touched.last_name && formik.errors.last_name ? (
                    <div className="valid_feedbackMsg">{formik.errors.last_name}</div>
                  ) : null}
                </div>
                <div className="userprof_btns justify-content-end">
                  <button className="btn btnColor"> Continue </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {cropedImg && (
          <ProfileImgEdit file={prevImg} onClose={() => setcropedImg(null)} onComplete={handleProfileImage} />
        )}
      </main>
      {verificationSuccessPopup && <AccountVerifiedSuccessfully onClose={handlePostSuccessPopup} />}
      {verificationFailedPopup && <AccountVerificationFailed onClose={handlePostFailedPopup} />}
    </>
  );
}
export default SignupProfile;
