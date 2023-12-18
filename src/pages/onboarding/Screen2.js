import React from 'react'
import "./screen2.css"
import OnboardingHeader from './OnboardingHeader'
import { GoPerson } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from "yup";

const validationSchema = Yup.object({
    full_name: Yup.string().required("Fullname is required."),
    email: Yup.string().required("Email is required.").email("Invalid email.").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
    date_of_birth: Yup.string().required("Date of birth is required."),
    terms_and_condition: Yup.boolean().oneOf([true], "You must agree to the term and conditions"),
})

const Screen2 = () => {
    const navigate = useNavigate();
    const [initialValue, setInitialValue] = useState({
        full_name: "",
        email: "",
        date_of_birth: "",
        terms_and_condition: false

    })

    const onSubmit = async () => {

    }

    const formik = useFormik({
        initialValues: initialValue,
        validationSchema: validationSchema,
        validateOnBlur: true,
        onSubmit,
        enableReinitialize: true
    })

    return (
        <>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div'>
                <p className='create_account_text'>Create your account</p>
                <p className='create_account_description'>Track where you see VestorGrow content across the web</p>
            </div>
            <div className='signupformdiv'>
                <form className='signup_form' onSubmit={formik.handleSubmit}>
                    <div className='formcontrol'>
                        <label className='label'>Fullname*</label>
                        <input
                            className='form_input'
                            type='text'
                            name='full_name'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.full_name}
                        />
                        {formik.touched.full_name && formik.errors.full_name ? <div>
                            {<div className='valid_feedbackMsg'>{formik.errors.full_name}</div>}
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
                    </div>
                    <div className='formcontrol'>
                        <label className='label'>Date of birth*</label>
                        <input
                            className='form_input'
                            type='date'
                            placeholder=''
                            name="date_of_birth"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.date_of_birth}
                        />
                        {formik.touched.date_of_birth && formik.errors.date_of_birth ? <div>
                            {<div className='valid_feedbackMsg'>{formik.errors.date_of_birth}</div>}
                        </div> : null}
                    </div>
                    <div className='formcontrol_checkbox'>
                        <input
                            className='signupcheckbox checkbox-round'
                            type='checkbox'
                            name="terms_and_condition"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.terms_and_condition}
                        />
                        <span className='signupcheckbox_text'> By signing up, you agree to the <span className='checkbox_term'> Terms of Service</span></span>
                    </div>
                    {formik.touched.terms_and_condition && formik.errors.terms_and_condition ? <div>
                        {<div className='valid_feedbackMsg'>{formik.errors.terms_and_condition}</div>}
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
        </>
    )
}


export default Screen2