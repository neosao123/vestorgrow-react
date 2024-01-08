import React, { useEffect } from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import { IoCheckmark } from "react-icons/io5";
import "./screen5.css"
import { useFormik } from 'formik'
import { useState } from 'react';
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom'
import GlobalContext from '../../context/GlobalContext';
import OnboardingService from '../../services/onBoardingService'
import { useContext } from 'react'
import { toast } from 'react-toastify'

const validationSchema = Yup.object({
    username: Yup.string().required("Username is required.").matches(/^\S*$/, 'Username cannot contain spaces').min(4, "Minimum 4 characters required.").max(20, "Maximum 20 characters allowed.")
});

const Screen5 = () => {
    const [initialValue, setInitialValue] = useState({ username: "" });
    const onBoardServ = new OnboardingService();
    const globalCtx = useContext(GlobalContext);
    const [userEmail, setUserEmail] = globalCtx.UserEmail;
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const [user, setUser] = globalCtx.user;
    const [showusername, setShowusername] = useState(false);
    const [userNames, setusernames] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [clicked, setClicked] = useState(false);
    const location = useLocation();


    const navigate = useNavigate();

    const onSubmit = async () => {
        let obj = {
            id: tempUser._id,
            user_name: formik.values.username
        }
        onBoardServ.updateUsername(obj)
            .then((res) => {
                if (res.message === "Success") {
                    toast.success("Username updated successfully!")
                    localStorage.setItem("user", JSON.stringify(res.user))
                    setTempUser(res.user)
                    setUser(res.user)
                    if (res.user.isSocialLogin) {
                        navigate("/bio", { replace: true })
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


    const getUsernameSuggestions = async () => {
        try {
            let response = await onBoardServ.usernameSuggestions(formik.values.username);
            console.log("response:", response.userNameSuggestionArr)
            setSuggestions(response.userNameSuggestionArr)
        }
        catch (error) {
            console.log(error);
        }
    }

    const formik = useFormik({
        initialValues: initialValue,
        validateOnBlur: true,
        validationSchema: validationSchema,
        onSubmit,
        enableReinitialize: true
    })

    useEffect(() => {
        setShowusername(false);
        getUsernameSuggestions();
    }, [formik.values.username]);


    const handleUsernameSuggestion = (el) => {
        formik.setValues({
            username: el
        });
        setClicked(true)
        setTimeout(() => {
            setClicked(false)
            setSuggestions([]);
        }, 500);
    }




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
                    <div style={{ margin: "0px 10px", position: "relative" }}>
                        <label className='label'>Username*</label>
                        <input
                            className={`form_input ${showusername ? "username_input_color" : "username_input_color1"} ${!showusername && formik.touched.username && !formik.errors.username ? "valid_color" : ""}`}
                            type='text'
                            name='username'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                        />
                        {!showusername && formik.touched.username && !formik.errors.username && <div style={{ position: "absolute", top: 35, right: 20, color: "green" }}><IoCheckmark /></div>}
                        {formik.touched.username && formik.errors.username ? <div className='valid_feedbackMsg'>
                            {formik.errors.username}
                        </div> : null}
                    </div>
                    {showusername && <div style={{ fontSize: "14px", color: "red", lineHeight: "10px", marginLeft: "10px" }}>
                        <p style={{ fontSize: "14px", lineHeight: "21px", fontFamily: "poppins", marginTop: "-20px" }}><span style={{ fontWeight: "600" }}>Sorry!</span><span> this username is already taken</span></p>
                        <p style={{ color: "black", fontSize: "16px", fontFamily: "poppins", marginTop: "-5px" }}>You can use this instead.</p>
                    </div>}
                    <div style={{ marginTop: "-20px", marginLeft: "10px" }}>
                        {
                            showusername && userNames?.map((el) => {
                                return <p onClick={() => handleUsernameSuggestion(el)} style={{ color: "#00808B", fontSize: "16px", fontWeight: "400", fontFamily: "poppins", lineHeight: "8px" }}>{el}</p>
                            })
                        }
                    </div>
                    <div style={{ marginTop: "-10px", marginLeft: "10px" }}>
                        {
                            !clicked && !showusername && suggestions?.map((el) => {
                                return <p onClick={() => handleUsernameSuggestion(el)} style={{ color: "#00808B", fontSize: "16px", fontWeight: "400", fontFamily: "poppins", lineHeight: "8px" }}>{el}</p>
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