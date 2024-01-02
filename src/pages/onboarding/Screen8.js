import React, { useContext } from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import GlobalContext from '../../context/GlobalContext';
import UserService from '../../services/UserService';
import { toast } from 'react-toastify';
import util from '../../util/util';

const Screen8 = () => {
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [tempUser, setTempUser] = globalCtx.user;
    const [user, setUser] = globalCtx.user;
    const [fileImage, setFileImage] = globalCtx.fileImage;
    const userServ = new UserService();


    const submitImage = async (file) => {
        let fileImage = file;
        try {
            const formData = new FormData();
            formData.append("_id", tempUser._id);
            formData.append("profile_img", fileImage);
            const resp = await userServ.editProfilePicture(formData);
            console.log("response:", resp)
            if (resp?.data) {
                toast.success("Profile picture updated successfully!")
                setUser(resp.data.data);
                setTempUser(resp.data.data);
                localStorage.setItem("user", JSON.stringify(resp.data.data));
                navigate("/bio", { replace: true })
            }
        } catch (error) {
            // onFail()
            console.log(error);
        }
    };



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
                        <img width={"100%"} height={"100%"} src={URL.createObjectURL(fileImage)} alt="logo" />
                    </div>
                    <div className='opt_div'>
                        <button className='signup_emailorphone next_btn' type='button' onClick={() => submitImage(fileImage)}>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Screen8