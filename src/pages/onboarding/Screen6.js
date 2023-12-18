import React from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import CameraInput from './cameraInput'
import "./screen6.css"
import "./file.css"
import SimpleSlider from './AvatarSlider/slider'
import { useState } from 'react'

const Screen6 = () => {
    const [EditprofileImg, setEditProfileImg] = useState(null);

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
                    <div className='formcontrol1'>
                        <div className='image_input' onClick={() => setEditProfileImg("https://static.vecteezy.com/system/resources/previews/000/566/995/original/vector-person-icon.jpg")}>
                            <div
                                type='file'
                                id="fileInput"
                                className="file-input"
                            />
                            <div class="camera-icon"></div>
                        </div>
                    </div>
                    <div className='avatar_div'>
                        <h1>Cryptocurrency</h1>
                        <div style={{ maxWidth: "30em", width: "100%" }}>
                            <SimpleSlider />
                        </div>
                    </div>
                    <div className='opt_div'>
                        <button className='signup_emailorphone next_btn'>
                            Next
                        </button>
                    </div>
                    <div className='opt_div'>
                        <button className='skip_btn'>
                            Skip
                        </button>
                    </div>
                </form>
            </div>
            {
                EditprofileImg !== null && <EditprofileImg file={"https://static.vecteezy.com/system/resources/previews/000/566/995/original/vector-person-icon.jpg"} onClose={() => setEditProfileImg(null)} />
            }
        </>
        // /images/profile/default-profile.png
    )
}

export default Screen6