import React, { useEffect } from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import { useContext } from 'react'
import GlobalContext from '../../context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Loader from '../../components/Loader'

const Srceen7 = () => {
    const globalCtx = useContext(GlobalContext);
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const navigate = useNavigate();



    return (
        <>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div'>
                <div className='text_div'>
                    <p className='back_btn'><FaAngleLeft />Back</p>
                    <p className='create_account_text'>Pick a profile picture</p>
                </div>
                <p className='create_account_description'>Upload your own photo or choose an avatar below? </p>
            </div>
            <div className='signupformdiv'>
                <form className='signup_form1' style={{ width: "30em" }}>
                    <div className='opt_div' style={{ maxWidth: "250px", width: "100%", margin: "auto" }}>
                        <img src={tempUser?.profile_img ? tempUser?.profile_img : "/images/profile/default-profile.png"} width={"100%"} alt="/images/profile/default-profile.png" />
                    </div>
                    <div className='opt_div'>
                        <button className='signup_emailorphone next_btn' onClick={() => navigate("/bio", { replace: true })}>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Srceen7