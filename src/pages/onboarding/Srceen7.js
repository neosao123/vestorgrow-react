import React, { useEffect } from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import { useContext } from 'react'
import GlobalContext from '../../context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Loader from '../../components/Loader'
import OnboardingService from '../../services/onBoardingService'
import { toast } from 'react-toastify';
import { IoChevronBackOutline } from "react-icons/io5";
import "./srceen7.css"

const Srceen7 = () => {
    const globalCtx = useContext(GlobalContext);
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const [user, setUser] = globalCtx.user;
    const navigate = useNavigate();
    const onBoardServ = new OnboardingService();

    const handleClick = async () => {

        let obj = {
            id: tempUser._id,
            profile_img: tempUser.profile_img
        }
        await onBoardServ.updateProfileImage(obj)
            .then((res) => {
                console.log("RES:", res)
                toast.success("Avatar updated successfully!")
                setTempUser(res.user);
                setUser(res.user);
                localStorage.setItem("user", JSON.stringify(res.user));
                navigate("/bio", { replace: true });
            })
            .catch((error) => console.log(error));


    }



    return (
        <>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div'>
                <div className='text_div' style={{ position: "relative", maxWidth: "650px", width: "100%", margin: "auto" }}>
                    <p onClick={() => navigate("/update_profile", { replace: true })} style={{ position: "absolute", top: 20, left: 0, fontSize: "16px", color: "#000000" }}><IoChevronBackOutline style={{ marginBottom: "4px" }} />Back</p>
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
                        <button className='signup_emailorphone next_btn' type='button' onClick={handleClick}>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Srceen7