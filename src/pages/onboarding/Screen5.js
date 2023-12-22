import React from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import "./screen5.css"
import { useFormik } from 'formik'
import { useState } from 'react';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom'
import GlobalContext from '../../context/GlobalContext';
import OnboardingService from '../../services/onBoardingService'
import { useContext } from 'react'

const validationSchema = Yup.object({
    username: Yup.string().required("Username is required.").min(4, "Minimum 4 characters required.").max(20, "Maximum 20 characters allowed.")
})

const Screen5 = () => {
    const [initialValue, setInitialValue] = useState({ username: "" });
    const onBoardServ = new OnboardingService();
    const globalCtx = useContext(GlobalContext);
    const [userEmail, setUserEmail] = globalCtx.UserEmail;
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const [showusername, setShowusername] = useState(false);
    const [userNames, setusernames] = useState([]);

    const navigate = useNavigate();

    const onSubmit = async () => {
        let obj = {
            id: tempUser._id,
            user_name: formik.values.username
        }
        onBoardServ.updateUsername(obj)
            .then((res) => {
                if (res.message === "Success") {
                    localStorage.setItem("user", JSON.stringify(res.user))
                    setTempUser(res.user)
                    if (res.user.isSocialLogin) {
                        navigate("/bio")
                    }
                    else {
                        navigate("/update_profile", { replace: true });
                    }
                }
                if (res.message === "Username already exist!") {
                    setShowusername(true);
                    setusernames(res.userNameSuggestionArr);
                }
            })
            .catch(err => console.log(err))
    }

    const formik = useFormik({
        initialValues: initialValue,
        validateOnBlur: true,
        validationSchema: validationSchema,
        onSubmit,
        enableReinitialize: true
    })



    return (
        <>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div'>
                <div className='text_div'>
                    <p className='create_account_text'>What should we call you?</p>
                </div>
                <p className='create_account_description'>Your @username is unique. You can always change it later</p>
            </div>
            <div className='signupformdiv'>
                <form className='signup_form' onSubmit={formik.handleSubmit} >
                    <div style={{ margin: "0px 10px" }}>
                        <label className='label'>Username*</label>
                        <input
                            className='form_input'
                            type='text'
                            name='username'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                        />
                        {formik.touched.username && formik.errors.username ? <div className='valid_feedbackMsg'>
                            {formik.errors.username}
                        </div> : null}
                    </div>
                    <div>
                        {
                            setShowusername && userNames?.map((el) => {
                                return <p style={{ color: "green", fontSize: "10px", lineHeight: "1px" }}>{el}</p>
                            })
                        }
                    </div>
                    <div className='opt_div'>
                        <button className='signup_emailorphone next_btn' type='submit'>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Screen5