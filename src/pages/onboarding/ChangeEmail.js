import React from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import "./changeemail.css"
import { useFormik } from 'formik'
import * as Yup from "yup"
import { useState } from 'react'
import GlobalContext from '../../context/GlobalContext'
import { useContext } from 'react'
import OnboardingService from '../../services/onBoardingService';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useEffect } from 'react'


const validationSchema = Yup.object({
    email: Yup.string().required("Email required.").matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, "Invalid email")
})

const ChangeEmail = () => {
    const onBoardServ = new OnboardingService();
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [error, setError] = useState("");
    const [initialValues, setInitialValues] = useState({
        email: ""
    });
    const [tempUser, setTempUser] = globalCtx.tempUser;

    const onSubmit = () => {
        setError("")
        let obj = {
            id: tempUser._id,
            email: formik.values.email
        }
        onBoardServ.changeEmail(obj)
            .then((res) => {
                console.log(res)
                if (res.message === "Email already exists.") {
                    setError(res.message)
                }
                else {
                    localStorage.setItem("user", JSON.stringify(res.user));
                    setTempUser(res.user);
                    navigate("/create_account")
                }
            })
            .catch(error => console.log(error))

    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        onSubmit,
        enableReinitialize: true
    })

    useEffect(() => {
        setError("");
    }, [formik.values.email])

    return (
        <>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div'>
                <div className='text_div'>
                    <p className='back_btn'><FaAngleLeft />Back</p>
                    <p className='create_account_text'>Change Email</p>
                </div>
                <p className='create_account_description'>Please enter your email address to verify your account</p>
            </div>
            <div className='signupformdiv' >
                <form className='signup_form1' onSubmit={formik.handleSubmit}>
                    <div className='email_div'>
                        <label className='label'>Email*</label>
                        <input
                            className='form_input'
                            type='text'
                            name='email'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? <div>
                            {<div className='valid_feedbackMsg'>{formik.errors.email}</div>}
                        </div> : null}
                        {!formik.errors.email && error !== "" && <div className='valid_feedbackMsg'>{error}</div>}
                    </div>
                    <div className='opt_div'>
                        <button className='signup_emailorphone next_btn' type='submit'>
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ChangeEmail