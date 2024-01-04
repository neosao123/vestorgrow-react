import React, { useContext } from 'react'
import "./screen2.css"
import OnboardingHeader from './OnboardingHeader'
import { GoPerson } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from "yup";
import GlobalContext from '../../context/GlobalContext';
import OnboardingService from '../../services/onBoardingService';
import { useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";


const validationSchema = Yup.object({
    first_name: Yup.string()
        .required('First name is required')
        .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Invalid first name.')
        .min(2, 'First name should contain at least two characters'),
    last_name: Yup.string()
        .required('Surname is required')
        .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Invalid surname.')
        .min(2, 'Surname should contain at least two characters'),
    email: Yup.string().required("Email is required.").email("Invalid email.").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
    date_of_birth: Yup.date().required("Date of birth is required.").max(new Date(), 'Date must be less than today'),
    terms_and_condition: Yup.boolean().oneOf([true], "You must agree to the terms and service."),
    password: Yup.string().required("Password is required").min(8, "Minimum 8 characters required.").max(20, "Maximum 20 characters allowed.").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one symbol, and one number'
    ),
    confirm_password: Yup.string().required("Confirm password is required").min(8, "Minimum 8 characters required.").max(20, "Maximum 20 characters allowed.").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one symbol, and one number'
    ).oneOf([Yup.ref("password")], "Confirm password must be same as password.")
})

const Screen2 = () => {
    const onBoardServ = new OnboardingService();
    const globalCtx = useContext(GlobalContext);
    const [userEmail, setUserEmail] = globalCtx.UserEmail;
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const [user, setUser] = globalCtx.user;
    const [date, setDate] = useState("");
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [emailPopup, setShowEmailPopup] = globalCtx.emailPopup;
    const [emailError, setEmailError] = useState("");
    const [initialValue, setInitialValue] = useState({
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        password: "",
        confirm_password: "",
        terms_and_condition: false
    });
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setConfirmPass] = useState(false);


    const onSubmit = async (values) => {
        setEmailError("")
        let obj = {
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            date_of_birth: new Date(values.date_of_birth).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }),
            password: values.password
        }

        await onBoardServ.signingUp(obj)
            .then((res) => {
                if (res.message === "This email is already registered.") {
                    setEmailError(res.message)
                }
                else {
                    setEmailError("")
                    localStorage.setItem("user", JSON.stringify(res.user))
                    setTempUser(res.user);
                    setUser(res.user);
                    navigate("/email_verification", { replace: true })
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }


    const formik = useFormik({
        initialValues: initialValue,
        validationSchema: validationSchema,
        validateOnBlur: true,
        onSubmit,
        enableReinitialize: true
    })

    useEffect(() => {
        setEmailError("")
    }, [formik.values.email]);


    return (
        <div style={{ zIndex: "9000" }}>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div'>
                <p className='create_account_text' style={{ marginBottom: "0px" }}>Create your account</p>
                <p className='create_account_description'>Track where you see VestorGrow content across the web</p>
            </div>
            <div className='signupformdiv'>
                <form className='signup_form gap-2' onSubmit={formik.handleSubmit}>
                    <div className='formcontrol'>
                        <label className='label'>First name*</label>
                        <input
                            className='form_input'
                            type='text'
                            name='first_name'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.first_name}
                        />
                        {formik.touched.first_name && formik.errors.first_name ? <div>
                            {<div className='valid_feedbackMsg'>{formik.errors.first_name}</div>}
                        </div> : null}
                    </div>
                    <div className='formcontrol'>
                        <label className='label'>Surname*</label>
                        <input
                            className='form_input'
                            type='text'
                            name='last_name'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.last_name}
                        />
                        {formik.touched.last_name && formik.errors.last_name ? <div>
                            {<div className='valid_feedbackMsg'>{formik.errors.last_name}</div>}
                        </div> : null}
                    </div>
                    <div className='formcontrol'>
                        <label className='label'>Email*</label>
                        <input
                            className='form_input'
                            type='text'
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? <div>
                            {<div className='valid_feedbackMsg'>{formik.errors.email}</div>}
                        </div> : null}
                        {!formik.errors.email && emailError !== "" && <div className='valid_feedbackMsg'>{emailError}</div>}
                    </div>
                    <div className='formcontrol'>
                        <label className='label'>Date of birth*</label>
                        <Flatpickr
                            className='form_input'
                            name="date_of_birth"
                            value={formik.values.date_of_birth}
                            onBlur={formik.handleBlur}
                            onChange={(date) => formik.setFieldValue("date_of_birth", date)}
                            options={{
                                dateFormat: 'd F Y',
                                // position: 'auto',
                                maxDate: new Date(),
                                // position: "auto",
                                // positionElement: formik.touched.date_of_birth,
                                appendTo: formik.touched.date_of_birth,
                                static: true
                            }}
                        />
                        {formik.touched.date_of_birth && formik.errors.date_of_birth ? <div>
                            {<div className='valid_feedbackMsg'>{formik.errors.date_of_birth}</div>}
                        </div> : null}
                    </div>
                    <div className='formcontrol eye_icon_div'>
                        <label className='label'>Password*</label>
                        <input
                            className='form_input'
                            type={!showPass ? "password" : "text"}
                            name='password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        <div className='eye_icon'>
                            {showPass && <IoEyeOffOutline onClick={() => setShowPass(false)} />}
                            {!showPass && <IoEyeOutline onClick={() => setShowPass(true)} />}
                        </div>
                        {formik.touched.password && formik.errors.password ? <div>
                            {<div className='valid_feedbackMsg'>{formik.errors.password}</div>}
                        </div> : null}
                    </div>
                    <div className='formcontrol eye_icon_div'>
                        <label className='label'>Confirm Password*</label>
                        <input
                            className='form_input'
                            type={!showConfirmPass ? "password" : "text"}
                            name='confirm_password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirm_password}
                        />
                        <div className='eye_icon'>
                            {showConfirmPass && <IoEyeOffOutline onClick={() => setConfirmPass(false)} />}
                            {!showConfirmPass && <IoEyeOutline onClick={() => setConfirmPass(true)} />}
                        </div>
                        {formik.touched.confirm_password && formik.errors.confirm_password ? <div>
                            {<div className='valid_feedbackMsg'>{formik.errors.confirm_password}</div>}
                        </div> : null}
                    </div>
                    {/* <div className='formcontrol_checkbox'>
                        <input
                            className='signupcheckbox checkbox-round'
                            type='checkbox'
                            name="terms_and_condition"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.terms_and_condition}
                        />
                        <span className='signupcheckbox_text'> By signing up, you agree to the <span className='checkbox_term'> Terms of Service</span></span>
                    </div> */}
                    <div className="custom-checkbox formcontrol_checkbox">
                        <input
                            type="checkbox"
                            id="myCheckbox"
                            className="hidden-checkbox"
                            name="terms_and_condition"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.terms_and_condition}
                        />
                        <label for="myCheckbox" className="custom-checkbox-label"></label>
                        <span className="custom-checkbox-text"><span className='signupcheckbox_text'> By signing up, you agree to the <span className='checkbox_term'> Terms of Service</span></span></span>
                    </div>
                    {formik.touched.terms_and_condition && formik.errors.terms_and_condition ? <div>
                        {<div className='valid_feedbackMsg' style={{ marginTop: "-5px" }} >{formik.errors.terms_and_condition}</div>}
                    </div> : null}
                    <div className='formcontrol'>
                        <button className='signup_emailorphone' type='submit'>
                            Create Account
                        </button>
                    </div>
                    <div className='formcontrol formcontrol_text'>
                        <p>Already have an account ?<span className='checkbox_term' onClick={() => navigate("/login")}> Sign In</span></p>
                    </div>
                </form >
            </div >
        </div>
    )
}


export default Screen2