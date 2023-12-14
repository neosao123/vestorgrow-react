import React from 'react'
import OnboardingHeader from './OnboardingHeader'
import "./screen3.css"
import { FaAngleLeft } from "react-icons/fa";
import PinInput from './PinInput';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const Screen3 = () => {
    const navigate = useNavigate()



    return (
        <>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div'>
                <div className='text_div'>
                    <p className='back_btn_screen3' onClick={() => navigate("/screen2")}><FaAngleLeft />Back</p>
                    <p className='create_account_text'>We sent a code to your email</p>
                </div>
                <p className='create_account_description'>Enter it below to verify <span className='description_email'>hamzakervan@gmail.com</span></p>
            </div>
            <div className='otp_div'>
                <div className='otp_input_div'>
                    <div className='input_div'>
                        <PinInput />
                    </div>
                    <div className='otp_text_resend_otp'>
                        <div className='text-code'>
                            <p>Didn’t receive the code? <span className='text_code_color'>Resend OTP</span></p>
                        </div>
                        <div className='email_text'>Didn’t receive email?</div>
                    </div>
                </div>
            </div>
            <div className='opt_div'>
                <button className='signup_emailorphone next_btn' onClick={() => navigate("/screen4")}>
                    Next
                </button>
                <button className='chage_details_btn' onClick={() => navigate("/screen2")}>
                    <FaArrowLeftLong />
                    Change Details
                </button>
            </div>
        </>
    )
}

export default Screen3