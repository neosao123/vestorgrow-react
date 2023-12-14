import React from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import CameraInput from './cameraInput'
import "./screen6.css"
import "./file.css"
import SimpleSlider from './AvatarSlider/slider'

const Screen6 = () => {
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
                <form className='signup_form'>
                    <div className='formcontrol1'>
                        <div className='image_input'>
                            <input
                                type='file'
                                id="fileInput"
                                className="file-input"
                            />
                            <div class="camera-icon"></div>
                        </div>
                    </div>
                    <div className='avatar_div'>
                        <h1>Cryptocurrency</h1>
                        <div style={{ border: "1px solid red", maxWidth: "10em" }}>
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
        </>
    )
}

export default Screen6