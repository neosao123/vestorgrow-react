import React, { useContext } from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import GlobalContext from '../../context/GlobalContext';

const Screen8 = () => {
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [tempUser, setTempUser] = globalCtx.user;

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
                    <div className='opt_div' style={{ maxWidth: "300px", width: "100%", margin: "auto", borderRadius: "50%" }}>
                        <img width={"100%"} height={"100%"} src={tempUser.profile_img} alt="logo" />
                    </div>
                    <div className='opt_div'>
                        <button className='signup_emailorphone next_btn' onClick={() => navigate("/bio")}>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Screen8