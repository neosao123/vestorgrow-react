import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import UserService from "../../services/UserService";
import { toast } from 'react-toastify';

const ValidateSchema = Yup.object().shape({
    bio: Yup.string().required("Bio is required").transform((value, originalValue) => {
        if (typeof originalValue === 'string') {
            return originalValue.trim();
        }
        return originalValue;
    }).min(10, "Min 10 characters required.").transform((value, originalValue) => {
        if (typeof originalValue === 'string') {
            return originalValue.trim();
        }
        return originalValue;
    }).max(500, "Maximum 500 characters allowed."),
    gender: Yup.string().required("Gender is required.").transform((value, originalValue) => {
        if (typeof originalValue === 'string') {
            return originalValue.trim();
        }
        return originalValue;
    }).matches(/^[A-Za-z]+$/, 'Only alphabetic characters are allowed in the gender.'),
    //email: Yup.string(),
    websiteUrl: Yup.string().url('Invalid URL format'),
    investmentInterests: Yup.array()
});

export default function EditAbout({ onClose }) {
    const userServ = new UserService();
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [tempKeyword, setTempKeyword] = useState("");
    //alert(user.websiteUrl)
    const [initialValue, setInitialValue] = useState({
        bio: user.bio || "",
        gender: user.gender || "",
        //email: user.email || "",
        investmentInterests: user.investmentInterests || [],
        websiteUrl: user.websiteUrl || ""
    });

    const onSubmit = async (values) => {
        try {
            const formData = { ...values };
            formData._id = user._id;
            const resp = await userServ.updateAbout(formData);
            if (resp.data) {
                toast.success('About bio is updated successfully', {
                    position: "top-center",
                    closeOnClick: true,
                    pauseOnHover: true
                });
                setUser(resp.data);
                localStorage.setItem("user", JSON.stringify(resp.data));
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const formik = useFormik({
        initialValues: initialValue,
        validateOnBlur: true,
        onSubmit,
        validationSchema: ValidateSchema,
        enableReinitialize: true,
    });

    return (
        <>
            <div className="edit_profile ">
                <div className="aboutboi_modaldata">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-3 mb-sm-4 commonform commonformBioCustom">
                            <label htmlFor="useBio" className="form-label">
                                Bio
                            </label>
                            <textarea
                                className={
                                    "form-control allFeedUser" +
                                    (formik.touched.bio && formik.errors.bio ? " is-invalid" : "")
                                }
                                placeholder="Tell something about you"
                                name="bio"
                                rows={10}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.bio}
                            />
                            {formik.touched.bio && formik.errors.bio ? (
                                <div className="valid_feedbackMsg">{formik.errors.bio}</div>
                            ) : null}
                        </div>
                        <div className="mb-3 mb-sm-4 commonform">
                            <label htmlFor="userGender" className="form-label">
                                Gender
                            </label>
                            <input
                                className={
                                    "form-control" + (formik.touched.gender && formik.errors.gender ? " is-invalid" : "")
                                }
                                name="gender"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.gender}
                            />
                            {
                                formik.touched.gender && formik.errors.gender ? (
                                    <div className="valid_feedbackMsg">{formik.errors.gender}</div>
                                ) : null
                            }
                        </div>
                        <div className="mb-3 mb-sm-4 commonform">
                            <label htmlFor="invtInt" className="form-label">
                            Personal Development Interests
                            </label>
                            <div className="d-flex align-items-center">
                                <input
                                    type={"text"}
                                    placeholder="Type keyword"
                                    className=""
                                    id="invtInt"
                                    value={tempKeyword}
                                    onChange={(e) => setTempKeyword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className={
                                        "add-key-design ms-2 " +
                                        (tempKeyword !== "" && formik.values.investmentInterests.length < 20 && tempKeyword.length < 20
                                            ? "active"
                                            : "disabled")
                                    }
                                    disabled={!(tempKeyword !== "" && formik.values.investmentInterests.length < 20 && tempKeyword.length < 20)}
                                    onClick={(e) => {
                                        formik.setFieldValue("investmentInterests", [...formik.values.investmentInterests, tempKeyword]);
                                        setTempKeyword("");
                                    }}
                                >
                                    <img
                                        src="/images/icons/plus-sign.svg"
                                        alt="compose-button"
                                        className="img-fluid composeButton"
                                    />
                                </button>
                            </div>
                            {
                                (tempKeyword !== "" && tempKeyword.length > 20) ? (
                                    <div className="valid_feedbackMsg">Maximum 20 characters allowed.</div>
                                ) : null
                            }
                            {
                                (tempKeyword.length < 2 && tempKeyword !== "") ? (
                                    <div className="valid_feedbackMsg">Minimum 2 characters required.</div>
                                ) : null
                            }
                            <div className="investment-keywords mt-3">
                                {formik.values.investmentInterests.map((item, idx) => {
                                    return (
                                        <span className="keywordListItem">
                                            <p>{formik.values.investmentInterests[idx]}</p>
                                            <img
                                                src="/images/icons/white-cross.svg"
                                                alt="compose-button"
                                                classNames="img-fluid composeButton"
                                                style={{ height: "12px", width: "12px" }}
                                                onClick={() => {
                                                    let temp = formik.values.investmentInterests;
                                                    temp.splice(idx, 1);
                                                    formik.setFieldValue("investmentInterests", temp);
                                                }}
                                            />
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mb-3 mb-sm-4 commonform">
                            <div class="input-group mb-3 input-group-sm" style={{ border: "1px solid #d1d1d1", borderRadius: "50px" }}>
                                <span class="input-group-text" style={{ background: "transparent", border: "none" }}><img src="./images/icons/globe.svg" alt="website" /></span>
                                <input
                                    style={{ border: "none", background: "transparent" }}
                                    className={
                                        "form-control" + (formik.touched.websiteUrl && formik.errors.websiteUrl ? " is-invalid" : "")
                                    }
                                    placeholder="https://your-website-url.com"
                                    name="websiteUrl"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.websiteUrl}
                                />
                            </div>
                            {
                                formik.touched.websiteUrl && formik.errors.websiteUrl ? (
                                    <div className="valid_feedbackMsg">{formik.errors.websiteUrl}</div>
                                ) : null
                            }
                        </div>
                        <div className="profileform_btn py-2 text-center">
                            <div
                                className="editComm_btn me-3"
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                Cancel
                            </div>
                            <button type="submit" className="btn btnColor">
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
