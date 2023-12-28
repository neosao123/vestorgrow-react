import React from 'react'
import "./onboardingheader.css"
import LOGO from "../../assets/images/logo-2.svg"
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import GlobalContext from '../../context/GlobalContext'

const OnboardingHeader = () => {
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [isAuthentiCated, setIsAuthentiCated] = globalCtx.auth;
    const [user, setUser] = globalCtx.user;

    return (
        <div>
            <div className='logo' onClick={() => { return isAuthentiCated ? navigate("/") : navigate("/login") }}>
                <img src={LOGO} alt='LOGO' className='logo_img' />
                <p className="logo_text">VestorGrow</p>
            </div>
            <div>

            </div>
        </div>
    )
}

export default OnboardingHeader