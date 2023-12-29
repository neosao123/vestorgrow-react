import React, { useContext, useEffect } from 'react'
import OnboardingHeader from './OnboardingHeader'
import "./screen3.css"
import { FaAngleLeft } from "react-icons/fa";
import PinInput from './PinInput';
import { FaArrowLeftLong } from "react-icons/fa6";
import GlobalContext from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import OnboardingService from '../../services/onBoardingService';
import EmailVerification from '../../popups/EmailVerification/EmailVerification';
import { useState } from 'react';
import { MdOutlineMarkEmailUnread } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Screen3 = () => {
    const globalCtx = useContext(GlobalContext);
    const onboardServ = new OnboardingService();
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = globalCtx.UserEmail;
    const [otp, setOtp] = globalCtx.emailverificationOTP;
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const [user, setUser] = globalCtx.user;
    const [emailPopup, setShowEmailPopup] = globalCtx.emailPopup;
    const [popups, setPopup] = useState(false);
    const [time, setTime] = useState(60);
    const [showTimer, setShowTimer] = useState(false);
    const [error, setError] = useState("");


    const Timer = () => {
        const IntervalId = setInterval(() => {
            setTime((time) => {
                let newTime = time - 1;
                if (newTime === 0) {
                    clearInterval(IntervalId);
                    setShowTimer(false);
                }
                return newTime
            });
        }, 1000);
        return () => clearInterval(IntervalId)
    }


    const handleSubmit = async () => {
        let obj = {
            email: tempUser.email,
            otp: otp
        }
        await onboardServ.emailVerification(obj)
            .then((res) => {
                toast.success(res.message);
                localStorage.setItem("user", JSON.stringify(res.user))
                setTempUser(res.user);
                setUser(res.user);
                navigate("/update_password", { replace: true })
            })
            .catch(error => setError("Invalid OTP."))
    }


    useEffect(() => {
        if (emailPopup === true) {
            Timer();
        }
    }, [emailPopup]);


    useEffect(() => {
        setError("");
    }, [otp.length])

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = time % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };



    const ResendOTP = async () => {
        let obj = {
            email: tempUser.email
        }
        await onboardServ.resendemailVerification(obj)
            .then((res) => {
                setError("");
                setTime(60);
                setShowEmailPopup(true);
                setShowTimer(true)
                Timer();
            })
            .catch(error => console.log(error))
    }


    return (
        <>
            <>
                <div>
                    <OnboardingHeader />
                </div>
                <div className='main_div'>
                    <div className='text_div'>
                        <p className='create_account_text'>We sent a code to your email</p>
                    </div>
                    <p className='create_account_description'>Enter it below to verify <span className='description_email'>{userEmail}</span></p>
                </div>
                <div className='otp_div'>
                    <div className='otp_input_div'>
                        <div className='input_div'>
                            <PinInput />
                        </div>
                        {error !== "" && <p className='error_msg'>{error}</p>}
                        <div className='otp_text_resend_otp'>
                            <div className='text-code'>
                                <p><button className='text_code_color bg-white border border-white pointe-cursor' onClick={() => ResendOTP()}>Didn’t receive the OTP code?</button></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='opt_div'>
                    <button disabled={otp.length !== 4} className={`signup_emailorphone next_btn ${otp.length !== 4 ? "otp_verification_btn_color1" : "otp_verification_btn_color"}`} onClick={handleSubmit}>
                        Next
                    </button>
                    <button className='chage_details_btn' onClick={() => { setShowEmailPopup(false); navigate("/changeemail", { replace: true }) }}>
                        <FaArrowLeftLong />
                        Change Details
                    </button>
                </div>
                {emailPopup && <>
                    <div className="modal" style={{ display: "block" }} >
                        <div className="vertical-alignment-helper">
                            <div className="vertical-align-center">
                                <div className="delete_message modal-dialog modal-sm">
                                    <div className="modal-content" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                                        {/* Modal Header */}
                                        <div className="modal-header border-bottom-0 pb-0">
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => { setShowEmailPopup(false); setShowTimer(false) }} />
                                        </div>
                                        {/* Modal body */}
                                        <div className="modal-body" >
                                            <div className="postShared text-center" >
                                                <MdOutlineMarkEmailUnread fontSize={"50px"} color={"#00808b"} />
                                            </div>
                                            <div className="postShared text-center">
                                                <h2 style={{ fontWeight: "600" }}>Didn’t receive the OTP code</h2>
                                                <p>We have sent another code to activate your email account. If you don’t have it in your inbox please check spam/junk folder or make sure your email address is correct.</p>
                                            </div>
                                            {showTimer && <div style={{ display: "flex", justifyContent: "center" }}>
                                                <button style={{ fontSize: "18px", border: "1px solid #00808b", fontWeight: 500, maxWidth: "320px", width: "100%", padding: "5px 20px", backgroundColor: "white", borderRadius: "20px" }}>Request new code in <span style={{ fontWeight: 600 }}>{time}</span> secs.</button>
                                            </div>}
                                            {!showTimer && <div style={{ display: "flex", justifyContent: "center" }}>
                                                <button style={{ fontSize: "18px", color: "white", border: "none", maxWidth: "320px", width: "100%", fontWeight: 500, padding: "5px 20px", backgroundColor: "#00808b", borderRadius: "20px" }} onClick={() => ResendOTP()}>Resend code</button>
                                            </div>}
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "15px" }}>
                                                <div style={{ height: "1px", width: "40%", backgroundColor: "#D1D1D1" }}></div>
                                                <div>OR</div>
                                                <div style={{ height: "1px", width: "40%", backgroundColor: "#D1D1D1" }}></div>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <button style={{ fontSize: "18px", border: "1px solid #00808b", color: "#00808b", marginTop: "15px", fontWeight: 600, maxWidth: "320px", width: "100%", padding: "5px 20px", backgroundColor: "white", borderRadius: "20px" }} onClick={() => { setShowEmailPopup(false); navigate("/changeemail", { replace: true }) }}>Change email</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            </>
            {/* <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            /> */}

        </>
    )
}

export default Screen3