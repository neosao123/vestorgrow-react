import React from 'react'
import "./screen1.css"
import OnboardingHeader from './OnboardingHeader'
import { GoPerson } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import GoogleLogo from "../../assets/images/google_icon.svg"

const Screen1 = () => {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div'>
                <p className='create_account_text'>Create your account</p>
                <p className='create_account_description'>Track where you see VestorGrow content across the web</p>
            </div>
            <div className='form_div'>
                <button className='signup_emailorphone' onClick={() => navigate("/screen2")}>
                    <GoPerson className='Person_icon' />Sign Up With Email or Phone
                </button>
                <div className='border_div'>
                    <div className='border_div_line' ></div>
                    <div >OR</div>
                    <div className='border_div_line' ></div>
                </div>
                <button className='signup_gmail_btn'>
                    <img src={GoogleLogo} alt="logo" />{"  "}Continue with Google
                </button>
                <p className='redirect_login_text'>Already have an account? <span className='redirect_login_text_singin' onClick={() => navigate("/login")}>Sign in</span></p>
            </div>
        </>
    )
}


export default Screen1