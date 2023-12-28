import React, { useContext } from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import CameraInput from './cameraInput'
import "./screen6.css"
import "./file.css"
import SimpleSlider from './AvatarSlider/slider'
import { useState } from 'react';
import GlobalContext from '../../context/GlobalContext'
import { useEffect } from 'react'
import EditProfileImage from "../../popups/profile/EditProfileImage";
import { useNavigate } from 'react-router-dom'
import OnboardingService from '../../services/onBoardingService'

const sliderImages = [
    {
        text: "Cryptocurrency"
    },
    {
        text: "Meditation"
    },
    {
        text: "Commodities"
    },
    {
        text: "Fitness"
    },
    {
        text: "Art"
    },
    {
        text: "Cars"
    },
    {
        text: "Forex"
    },
    {
        text: "Goal Setting"
    },
    {
        text: "Healthy Food"
    },
    {
        text: "Property"
    },
    {
        text: "Watches"
    },
    {
        text: "Wine"
    },
    {
        text: "Self Help"
    },
    {
        text: "Stocks Shares"
    }
];

const Screen6 = () => {
    const onBoardServ = new OnboardingService();
    const globalCtx = useContext(GlobalContext);
    const [editprofileImg, setEditProfileImg] = useState(null);
    const [SliderHeaderTextIndex, setSliderHeaderTextIndex] = globalCtx.SliderHeaderTextIndex;
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const [user, setUser] = globalCtx.user;
    const [slideHeader, setSliderHeader] = globalCtx.slideHeader;
    const [currentSlide, setCurrentSlide] = globalCtx.currentSlide;
    const navigate = useNavigate();


    const handleSkip = () => {
        let obj = {
            profilepictureUpdate: true
        }
        onBoardServ.skioOnboarding(tempUser._id, obj)
            .then((res) => {
            })
            .catch((error) => {
                console.log(error)
            })
        navigate("/bio", { replace: true })
    }

    const handleUpload = () => {
        setUser(tempUser);
        setEditProfileImg("http://localhost:3000/images/profile/default-profile.png")
    }




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
            <div className=''>
                <form className='signup_form1'>
                    <div className='formcontrol1'>
                        <div className='image_input' onClick={handleUpload}>
                            <div
                                type='file'
                                id="fileInput"
                                className="file-input"
                            />
                            <div className="camera-icon"></div>
                        </div>
                    </div>
                    <div className='avatar_div'>
                        <h1>{sliderImages[currentSlide].text}</h1>
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
                        <button className='skip_btn mb-4' onClick={handleSkip}>
                            Skip
                        </button>
                    </div>
                </form>
            </div>

            {editprofileImg !== null && <EditProfileImage
                file={editprofileImg}
                onClose={() => { setEditProfileImg(null) }}
                onComplete={() => navigate("/profile_picture", { replace: true })}
            />}

        </>
    )
}

export default Screen6