import React, { useContext } from 'react'
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

const Screen3 = () => {
    const globalCtx = useContext(GlobalContext);
    const onboardServ = new OnboardingService();
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = globalCtx.UserEmail;
    const [otp, setOtp] = globalCtx.emailverificationOTP;
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const [emailPopup, setShowEmailPopup] = globalCtx.emailPopup;


    const handleSubmit = async () => {
        let obj = {
            email: tempUser.email,
            otp: otp
        }
        await onboardServ.emailVerification(obj)
            .then((res) => {
                localStorage.setItem("user", JSON.stringify(res.user))
                setTempUser(res.user);
                navigate("/update_password", { replace: true })
            })
            .catch(error => console.log(error))
    }


    const ResendOTP = async () => {
        let obj = {
            email: tempUser.email
        }
        await onboardServ.resendemailVerification(obj)
            .then((res) => {
                setShowEmailPopup(true);
            })
            .catch(error => console.log(error))
    }


    return (
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
                    <div className='otp_text_resend_otp'>
                        <div className='text-code'>
                            <p>Didn’t receive the code? <span className='text_code_color' onClick={() => ResendOTP()}>Resend OTP</span></p>
                        </div>
                        <div className='email_text'>Didn’t receive email?</div>
                    </div>
                </div>
            </div>
            <div className='opt_div'>
                <button className='signup_emailorphone next_btn' onClick={handleSubmit}>
                    Next
                </button>
                <button className='chage_details_btn' onClick={() => navigate("/changeemail", { replace: true })}>
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
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setShowEmailPopup(false)} />
                                    </div>
                                    {/* Modal body */}
                                    <div className="modal-body" >
                                        <div className="postShared text-center" >
                                            <MdOutlineMarkEmailUnread fontSize={"50px"} color={"#00808b"} />
                                        </div>
                                        <div className="postShared text-center">
                                            <h2 style={{ fontWeight: "600" }}>We have sent you a confirmation email</h2>
                                            <p>Click on the link we have sent you to activate your account. If you don’t have it in your inbox please check spam/junk folder.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </>
    )
}

export default Screen3