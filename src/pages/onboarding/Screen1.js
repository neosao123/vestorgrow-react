import React, { useContext } from 'react'
import "./screen1.css"
import OnboardingHeader from './OnboardingHeader'
import { GoPerson } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import GoogleLogo from "../../assets/images/google_icon.svg"
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import OnboardingService from '../../services/onBoardingService';
import GlobalContext from '../../context/GlobalContext';

const Screen1 = () => {
    const onBoardServ = new OnboardingService();
    const globalCtx = useContext(GlobalContext);
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const [user, setUser] = globalCtx.user;
    const navigate = useNavigate();

    const getUserData = async (accessToken) => {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                return userData;
            } else {
                console.error('Failed to fetch user data:', response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    const GoolgeAuthentication = useGoogleLogin({
        onSuccess: (codeResponse) => {
            getUserData(codeResponse.access_token)
                .then(async (res) => {
                    let obj = {
                        first_name: res.given_name,
                        last_name: res.family_name,
                        email: res.email,
                        date_of_birth: res.date_of_birth,
                        profile_img: res.picture,
                        isSocialLogin: true
                    }
                    onBoardServ.signupGmail(obj)
                        .then((res) => {
                            setTempUser(res.user);
                            setUser(res.user);
                            localStorage.setItem("user", JSON.stringify(res.user));
                            navigate("/signup_auth");
                        })
                        .catch((error) => {
                            console.log("error:", error)
                        })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    })

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
                <button className='signup_emailorphone' onClick={() => navigate("/create_account", { replace: true })}>
                    <GoPerson className='Person_icon' />Sign Up With Email or Phone
                </button>
                <div className='border_div'>
                    <div className='border_div_line' ></div>
                    <div >OR</div>
                    <div className='border_div_line' ></div>
                </div>
                <button className='signup_gmail_btn' onClick={() => GoolgeAuthentication()}>
                    <img src={GoogleLogo} alt="logo" />{"  "}Continue with Google
                </button>
                <p className='redirect_login_text'>Already have an account? <span className='redirect_login_text_singin' onClick={() => navigate("/login")}>Sign in</span></p>
            </div>
        </>
    )
}


export default Screen1