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
                    setVerificationSuccessPopup(!verificationSuccessPopup)
                    if (user.ProfileUpdates === false) {
                        navigate(`/signup/active/${token
                            }`)
                    }
                    else if (user.UserSuggestions === false) {
                        navigate("/usersuggestion")
                    }
                    else if (user.groupSuggestion === false) {
                        navigate("/groupsuggestion")
                    }
                    else if (user.groupSuggestion === true && user.UserSuggestions === true && user.ProfileUpdates === true) {
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