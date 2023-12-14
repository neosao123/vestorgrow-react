import React from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import OnboardingHeader from './OnboardingHeader'
import "./screen4.css"
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom'

const validationSchema = Yup.object({
    password: Yup.string().required("Password is required").min(8, "Minimum 8 characters required.").max(20, "Maximum 20 characters allowed.").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one symbol, and one number'
    ),
    confirm_password: Yup.string().required("Confirm password is required").min(8, "Minimum 8 characters required.").max(20, "Maximum 20 characters allowed.").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one symbol, and one number'
    ).oneOf(["password"], "Confirm password must be same as password.")
})

const Screen4 = () => {
    const [initialValue, setInitialValue] = useState({ password: "", confirm_password: "" });
    const navigate = useNavigate()

    const onSubmit = async () => {

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
                    <p className='back_btn_screen4' onClick={() => navigate("/screen3")}><FaAngleLeft />Back</p>
                    <p className='create_account_text'>You’ll need a password</p>
                </div>
                <p className='create_account_description'>Make sure it’s 8 characters or more.</p>
            </div>
            <div className='signupformdiv'>
                <form className='signup_form' onSubmit={formik.handleSubmit}>
                    <div className='formcontrol'>
                        <label className='label'>Password*</label>
                        <input
                            className='form_input'
                            type='text'
                            name='password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? <div className='valid_feedbackMsg'>{formik.errors.password}</div> : null}
                    </div>
                    <div className='formcontrol'>
                        <label className='label'>Confirm Password*</label>
                        <input
                            className='form_input'
                            type='text'
                            name='confirm_password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirm_password}
                        />
                        {formik.touched.confirm_password && formik.errors.confirm_password ? <div className='valid_feedbackMsg'>{formik.errors.confirm_password}</div> : null}
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

export default Screen4