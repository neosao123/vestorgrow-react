import React, { useContext } from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import CameraInput from './cameraInput'
import "./screen6.css"
import "./file.css"
import SimpleSlider from './AvatarSlider/slider'
import { useState } from 'react';
import GlobalContext from '../../context/GlobalContext'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import OnboardingService from '../../services/onBoardingService'
import { toast } from 'react-toastify'
import EditProfileImage1 from '../../popups/profile/EditProfileImage1';

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
    const [fileImage, setFileImage] = globalCtx.fileImage;
    const [slideHeader, setSliderHeader] = globalCtx.slideHeader;
    const [currentSlide, setCurrentSlide] = globalCtx.currentSlide;
    const [Imagesrc, setImageSrc] = globalCtx.Imagesrc;
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

    const handleUpload = (image) => {
        setUser(tempUser);
        setEditProfileImg(image)
    }

    const handleNext = () => {
        let user = tempUser;
        console.log("user:", user);
        console.log("image:", Imagesrc)
        user.profile_img = Imagesrc;
        setTempUser(user);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/avatar")
    }




    return (
        <>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div'>
                <div className='text_div'>
                    <p className='create_account_text'>Pick a profile picture</p>
                </div>
                <p className='create_account_description'>Upload your own photo or choose an avatar below? </p>
            </div>
            <div className='mb-4'>
                <form className='signup_form1'>
                    <div className='formcontrol1' style={{ marginTop: "37px" }}>
                        <div className='image_input'>
                            <input
                                type='file'
                                id="fileInput"
                                accept="image/*"
                                className="file-input"
                                onChange={(e) => handleUpload(e.target.files[0])}
                            />
                            <div className="camera-icon"></div>
                        </div>
                    </div>
                    <div className='avatar_div'>
                        <h1 className='avatar_text'>{sliderImages[currentSlide].text}</h1>
                        <div style={{ maxWidth: "30em", width: "100%" }}>
                            <SimpleSlider />
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#465D61" }}>{currentSlide + 1}{" "}/{" "}{sliderImages.length}</div>
                    </div>
                    <div className='opt_div'>
                        <button type='button' onClick={handleNext} className='signup_emailorphone next_btn'>
                            Next
                        </button>
                    </div>
                    <div className='opt_div'>
                        <button className='skip_btn mb-2' onClick={handleSkip}>
                            Skip
                        </button>
                    </div>
                </form>
            </div>

            {editprofileImg !== null && <EditProfileImage1
                file={editprofileImg}
                onClose={() => { setEditProfileImg(null) }}
                onComplete={(file) => { setFileImage(file); navigate("/profile_picture", { replace: true }) }}
            />}

        </>
    )
}

export default Screen6