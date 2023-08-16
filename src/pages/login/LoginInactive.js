import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import React, { useState, useEffect } from 'react';

const LoginInactive = () => {
    const serv = new UserService();
    const location = useLocation();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const handleResendLink = async () => {
        try {
            const resp = await serv.signinActivationLink(location.state.email);
            if (resp?.data) {
            } else {
                setErrorMsg(resp.error);
            }
        } catch (err) {
            err = JSON.parse(err.message);
            setErrorMsg(err.err);
        }
    }

    useEffect(() => {
        const handleBackButton = (event) => {
            event.preventDefault();
            navigate("/signin/inactive");
        };

        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [navigate]);

    return (
        <main className="w-100 clearfix socialMediaTheme bgColor">
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
                            Resend Activation Link
                        </a>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LoginInactive