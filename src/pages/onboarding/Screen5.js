import React from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import "./screen5.css"
import { useFormik } from 'formik'
import { useState } from 'react';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom'

const validationSchema = Yup.object({
    username: Yup.string().required("Username is required.").min(4, "Minimum 4 characters required.").max(20, "Maximum 20 characters allowed.")
})

const Screen5 = () => {
    const [initialValue, setInitialValue] = useState({ username: "" });
    const navigate = useNavigate();

    const onSubmit = async () => {

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
                    <p className='back_btn_screen5' onClick={()=>navigate("/screen4")}><FaAngleLeft />Back</p>
                    <p className='create_account_text'>What should we call you?</p> 
                </div>
                <p className='create_account_description'>Your @username is unique. You can always change it later</p>
            </div>
            <div className='signupformdiv'>
                <form className='signup_form' onSubmit={formik.handleSubmit}>
                    <div className='formcontrol'>
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
                    <div className='opt_div'>
                        <button className='signup_emailorphone next_btn' type='submit'>
                            Next
                        </button>
                    </div>
                    <div className='opt_div'>
                        <button className='skip_btn' onClick={()=>navigate("/screen4")}>
                            Skip
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Screen5