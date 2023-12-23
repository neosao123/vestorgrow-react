import { useContext } from "react"
import GlobalContext from "../../context/GlobalContext"
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import AccountVerifiedSuccessfully from "../signup/AccountVerified";
import AccountVerificationFailed from "../signup/AccountVerificationFailed";
import UserService from "../../services/UserService";
import { useState } from "react";
const serv = new UserService();

function LoginSteps() {
    const globalCtx = useContext(GlobalContext)
    const location = useLocation()
    const [user, setUser] = globalCtx.user;
    const navigate = useNavigate()
    const [verificationSuccessPopup, setVerificationSuccessPopup] = useState(false)
    const [verificationFailedPopup, setVerificationFailedPopup] = useState(false)
    let pathName = location.pathname.split("/");

    const handlePostSuccessPopup = () => {
        setVerificationSuccessPopup(!verificationSuccessPopup);
    };

    const handlePostFailedPopup = () => {
        setVerificationFailedPopup(!verificationFailedPopup);
    };

    useEffect(() => {
        let token = pathName[pathName.length - 1];
        serv.updateAccountActivated(token)
            .then((res) => {
                if (res.status === true) {
                    console.log(res)
                    setVerificationSuccessPopup(!verificationSuccessPopup)
                    if (user.usernameUpdate === false) {
                        navigate("/add_username")
                    }
                    else if (user.profilepictureUpdate === false) {
                        navigate("/update_profile")
                    }
                    else if (user.bioUpdate === false) {
                        navigate("/bio")
                    }
                    else if (user.UserSuggestions === false) {
                        navigate("/usersuggestions1")
                    }
                    else if (user.groupSuggestion === false) {
                        navigate("/groupsuggestion1")
                    }
                    else if (user.usernameUpdate === true && user.profilepictureUpdate === true && user.bioUpdate === true && user.groupSuggestion === true && user.UserSuggestions === true && user.ProfileUpdates === true) {
                        navigate("/")
                    }
                }
                else {
                    navigate("/login/inactive")
                }
            })

    }, [])
    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><Loader /></div>
            {verificationSuccessPopup && <AccountVerifiedSuccessfully onClose={handlePostSuccessPopup} />}
            {verificationFailedPopup && <AccountVerificationFailed onClose={handlePostFailedPopup} />}F
        </>
    )
}
export default LoginSteps;