import React from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Screen8 = () => {
    const navigate=useNavigate();

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
                    <div className='opt_div' style={{ maxWidth: "300px", width: "100%", margin: "auto" }}>
                        <img width={"100%"} height={"100%"} src={"http://localhost:8000/uploads/images/17030671135153075.png"} alt="logo" />
                    </div>
                    <div className='opt_div'>
                        <button className='signup_emailorphone next_btn' onClick={()=>navigate("/bio")}>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Screen8