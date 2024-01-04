import React from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import OnboardingHeader from './OnboardingHeader'
import "./screen4.css"
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom'
import OnboardingService from '../../services/onBoardingService';
import GlobalContext from '../../context/GlobalContext'
import { useContext } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from 'react-toastify'

const validationSchema = Yup.object({
    password: Yup.string().required("Password is required").min(8, "Minimum 8 characters required.").max(20, "Maximum 20 characters allowed.").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one symbol, and one number'
    ),
    confirm_password: Yup.string().required("Confirm password is required").min(8, "Minimum 8 characters required.").max(20, "Maximum 20 characters allowed.").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one symbol, and one number'
    ).oneOf([Yup.ref("password")], "Confirm password must be same as password.")
})

const Screen4 = () => {
    const onBoardServ = new OnboardingService();
    const globalCtx = useContext(GlobalContext);
    const [userEmail, setUserEmail] = globalCtx.UserEmail;
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const [user, setUser] = globalCtx.user;
    const [initialValue, setInitialValue] = useState({ password: "", confirm_password: "" });
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setConfirmPass] = useState(false);
    const navigate = useNavigate()

    const onSubmit = async () => {
        let obj = {
            email: tempUser.email,
            password: formik.values.password
        }
        onBoardServ.updatePassword(obj)
            .then((res) => {
                toast.success("Password updated successfully!")
                localStorage.setItem("user", JSON.stringify(res.user))
                setTempUser(res.user);
                setUser(res.user);
                navigate("/add_username", { replace: true })
            })
            .catch(err => console.log(err))
    }

    const formik = useFormik({
        initialValues: initialValue,
        validateOnBlur: true,
        onSubmit,
        validationSchema: validationSchema,
        enableReinitialize: true
    })


    return (
        <>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div'>
                <div className='text_div'>
                    <p className='create_account_text'>You’ll need a password</p>
                </div>
                <p className='create_account_description'>Make sure it’s 8 characters or more.</p>
            </div>
            <div className='signupformdiv'>
                <form className='signup_form' onSubmit={formik.handleSubmit}>
                    <div style={{ width: "100%" }} className='eye_div'>
                        <label className='label'>Password*</label>
                        <input
                            className='form_input'
                            type={showPass ? "text" : "password"}
                            name='password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            style={{ width: "100%" }}
                        />
                        <div className='eye_icon'>
                            {showPass && <IoEyeOffOutline onClick={() => setShowPass(false)} />}
                            {!showPass && <IoEyeOutline onClick={() => setShowPass(true)} />}
                        </div>
                        {formik.touched.password && formik.errors.password ? <div className='valid_feedbackMsg'>{formik.errors.password}</div> : null}
                    </div>
                    <div className='eye_div'>
                        <label className='label'>Confirm Password*</label>
                        <input
                            className='form_input'
                            type={showConfirmPass ? "text" : "password"}
                            name='confirm_password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirm_password}
                        />
                        <div className='eye_icon'>
                            {showConfirmPass && <IoEyeOffOutline onClick={() => setConfirmPass(false)} />}
                            {!showConfirmPass && <IoEyeOutline onClick={() => setConfirmPass(true)} />}
                        </div>
                        {formik.touched.confirm_password && formik.errors.confirm_password ? <div className='valid_feedbackMsg'>{formik.errors.confirm_password}</div> : null}
                    </div>
                    <div className='opt_div1'>
                        <button className='signup_emailorphone next_btn' type='submit'>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Screen4