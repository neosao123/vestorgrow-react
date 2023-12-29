import React, { useEffect, useState } from 'react'
import OnboardingHeader from './OnboardingHeader'
import { FaAngleLeft } from 'react-icons/fa'
import "./describe.css"
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import OnboardingService from '../../services/onBoardingService';
import { useContext } from 'react';
import GlobalContext from '../../context/GlobalContext';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
    bio: Yup.string().min(20, "Minimum 20 characters required.").max(160, "Maximum 160 characters allowed.")
})

const Describe = () => {
    const onBoardServ = new OnboardingService();
    const globalCtx = useContext(GlobalContext);
    const [initialValue, setInitialValue] = useState({ bio: "" });
    const [tempUser, setTempUser] = globalCtx.tempUser;
    const [user, setUser] = globalCtx.user;
    const navigate = useNavigate();


    const onSubmit = async (values) => {
        let obj = {
            id: tempUser._id,
            bio: formik.values.bio
        }
        onBoardServ.updateBio(obj)
            .then((res) => {
                toast.success("Bio updated successfully!")
                setTempUser(res.user);
                setUser(res.user)
                localStorage.setItem("user", JSON.stringify(res.user));
                navigate("/usersuggestions1")
            })
            .catch(error => console.log(error))
    }

    const formik = useFormik({
        initialValues: initialValue,
        validateOnBlur: true,
        validationSchema: validationSchema,
        onSubmit,
        enableReinitialize: true
    })


    const handleSkip = () => {
        let obj = {
            bioUpdate: true
        }
        onBoardServ.skioOnboarding(tempUser._id, obj)
            .then((res) => {
            })
            .catch((error) => {
                console.log(error)
            })
        navigate("/usersuggestions1", { replace: true })
    }

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
                            <div className="valid_feedbackMsg" style={{ marginTop: "-5px" }}>{formik.errors.bio}</div>
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
                        <div className='opt_div' onClick={handleSkip}>
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