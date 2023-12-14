import React, { useEffect, useState } from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import "./describe.css"
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    bio: Yup.string().min(20, "Minimum 20 characters required.").max(160, "Maximum 160 characters allowed.")
})

const Describe = () => {
    const [initialValue, setInitialValue] = useState({ bio: "" });
    const navigate = useNavigate();


    const onSubmit = async (values) => {

    }

    const formik = useFormik({
        initialValues: initialValue,
        validateOnBlur: true,
        validationSchema: validationSchema,
        onSubmit,
        enableReinitialize: true
    })

    return (
        <div>
            <div>
                <OnboardingHeader />
            </div>
            <div className='main_div_describe'>
                <div className='description_div'>
                    <p className='description_title'>Describe yourself</p>
                    <p className='description_text'>What makes you special? Don’t think too hard, just have fun with it.</p>
                    <p className='back_btn' onClick={() => navigate("/screen5")}><FaAngleLeft />Back</p>
                </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className='bio_main_div'>
                    <div className='bio_div'>
                        <textarea
                            placeholder='Your bio'
                            onChange={formik.handleChange}
                            onBlur={formik.onBlur}
                            name='bio'
                            value={formik.values.bio}
                            className='textarea_bio'
                        />
                        <p className='bio_length'>{formik.values.bio.length}/160</p>
                        {formik.touched.bio && formik.errors.bio ? (
                            <div className="valid_feedbackMsg">{formik.errors.bio}</div>
                        ) : null}
                    </div>
                </div>
                <div className='btn_div'>
                    <div className='signup_form'>
                        <div className='opt_div'>
                            <button className='signup_emailorphone next_btn' type='submit'>
                                Next
                            </button>
                        </div>
                        <div className='opt_div' onClick={() => navigate("/screen5")}>
                            <button className='skip_btn'>
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Describe