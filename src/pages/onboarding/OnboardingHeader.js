import React from 'react'
import "./onboardingheader.css"
import LOGO from "../../assets/images/logo-2.svg"

const OnboardingHeader = () => {
    return (
        <div>
            <div className='logo'>
                <img src={LOGO} alt='LOGO' className='logo_img' />
                <p className="logo_text">VestorGrow</p>
            </div>
            <div>
                
            </div>
        </div>
    )
}

export default OnboardingHeader