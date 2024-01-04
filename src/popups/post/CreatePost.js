import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import GlobalContext from "../../context/GlobalContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import PostService from "../../services/postService";
import NotificationService from "../../services/notificationService";
import OwlCarousel from "react-owl-carousel";
import VideoImageThumbnail from "react-video-thumbnail-image";
import ProfileImage from "../../shared/ProfileImage";
import LoadingSpin from "react-loading-spin";
import UserService from "../../services/UserService";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "./defaultStyle";
import defaultMention from "./defaultMention";
import UserFollowerService from "../../services/userFollowerService";
import HelperFunctions from "../../services/helperFunctions";
import axios from "axios";
import { toast } from "react-toastify";
import "./postcategory.css"
import Form from 'react-bootstrap/Form';
import "./radiocustomstyle.css"

const serv = new UserService();
const userFollowerServ = new UserFollowerService();
const helperFunctions = new HelperFunctions();

const ValidateSchema = Yup.object().shape({
    // message: Yup.string().required("Required"),
    shareType: Yup.string().required("Required"),
    category: Yup.string().required("Category is required.")
});

function fetchUsers(query, callback) {
    if (!query) return
    let obj = { searchText: query };

    serv.getMentionUsers(obj).then((res) => {
        if (res.data?.length > 0)
            return res.data.map(user => (
                {
                    display: user.user_name, id: user._id, img: user.profile_img, firstName: user.first_name ?? "", lastName: user.last_name ?? ""
                }
            ))
    }).then(callback);
}

export default function CreatePost({ onClose, onSuccess, onFail, getposts }) {

    const source = axios.CancelToken.source();

    const postServ = new PostService();
    const notificationServ = new NotificationService();
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [userList, setUserList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [mentionedUserList, setMentionedUserList] = useState([]);
    const [mentionedUser, setMentionedUser] = useState({});
    const [inputPost, setInputPost] = useState("");
    const [mentionedUserIds, setMentionedUserIds] = useState([]);
    const [value, setValue] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    const [tempKeyword, setTempKeyword] = useState("");

    const [initialValue, setInitialValue] = useState({
        message: "",
        mediaFiles: "",
        shareType: "Friends",
        postKeywords: [],
        category: "financial"
    });

    useEffect(() => {
        getFollowerList();
        return () => {
            source.cancel('Form submission canceled due to component unmount');
        };
    }, []);

    const getFollowerList = async () => {
        try {
            let obj = {
                // filter: {
                //     listType: "follower",
                //     searchText: searchText
                // }
            };
            let resp = await userFollowerServ.listFriends(obj);
            if (resp.data) {
                setUserList([...resp.data]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (values) => {
        if (inputPost !== "" || values.mediaFiles.length > 0) {
            try {
                setIsSubmit(true);
                const dirtyHtmlPostMessage = helperFunctions.mentionedUserLinkGenerator(inputPost);
                const mentionedUsers = helperFunctions.idExtractor(inputPost);
                //console.log("Dirty HTML =>", dirtyHtmlPostMessage, "Ids=>", mentionedUsers);

                const formData = new FormData();
                formData.append("message", dirtyHtmlPostMessage);
                formData.append("shareType", values.shareType);
                formData.append("createdBy", user._id);
                formData.append("mentionedUsers", mentionedUsers);
                formData.append("postKeywords", values.postKeywords);
                formData.append("category", values.category);
                if (Array.isArray(values.mediaFiles)) {
                    values.mediaFiles.forEach((element) => {
                        formData.append("mediaFiles", element);
                    });
                }

                await postServ.sendPost(formData).then((resp) => {
                    if (resp.data) {
                        onSuccess();
                        setIsSubmit(false);
                        getposts()
                    } else {
                        onFail();
                        setIsSubmit(false);
                    }
                }).catch(error => {
                    if (axios.isCancel(error)) {
                        console.log('Request canceled:', error.message);
                        setIsSubmit(false);
                    } else {
                        console.log('Error:', error.message);
                        setIsSubmit(false);
                    }
                });
            } catch (error) {
                onFail();
                console.log(error);
                setIsSubmit(false);
            }
        } else {
            toast.info(`Please add something into input.`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            })
            return
        }


    };

    const cancelFormSubmit = () => {
        source.cancel('Form submission canceled by user');
        setIsSubmit(false);
    };

    const handleRemoveFile = (idx) => {
        let arr = formik.values.mediaFiles.filter((item, index) => index !== idx);
        formik.setFieldValue("mediaFiles", arr);
    };

    const formik = useFormik({
        initialValues: initialValue,
        validateOnBlur: true,
        onSubmit,
        validationSchema: ValidateSchema,
        enableReinitialize: true,
    });

    const handleChangeInput = (e, newInputValue) => {
        if (e.target.value.includes(" @")) {
            const strAfter = e.target.value.substring(e.target.value.indexOf("@") + 1);
            if (strAfter.includes(" ")) {
                setSearchText("");
            } else {
                setSearchText(strAfter);
            }
        }
        setValue(newInputValue);
        setInputPost(e.target.value);
    };

    const handleChange = (e, newValue) => {
        setValue(newValue);
        setInputPost(e.target.value);
        if (newValue === "") {
            setMentionedUserIds([]);
        }
    };


    const CustomSuggestion = ({ suggestion, ...props }) => (
        <div {...props} style={{ padding: "5px", display: "flex", alignItems: "center" }}>
            <img src={props.img !== "" ? props.img : "/images/user.png"} alt={props.display} style={{ width: "32px", height: "32px", borderRadius: "16px", marginRight: "5px" }} />
            <div>
                <div style={{ fontSize: "1.0rem" }}>{props.display}</div>
                <div style={{ fontSize: "0.8rem" }}>{props.firstName + " " + props.lastName}</div>
            </div>
        </div>
    );


    return (
        <>
            <div className="modal" style={{ display: "block" }}>
                <div className="vertical-alignment-helper">
                    <div className="vertical-align-center">
                        <div className="createPostModel modal-dialog modal-lg">
                            <div className="modal-content" style={{ overflowY: "auto", maxHeight: "750px" }}>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="modal-header">
                                        <div className="followesNav">
                                            <h4>Create a post </h4>
                                        </div>
                                        <div className="createPostRight d-flex align-items-center">
                                            <div className="createPostDropDown d-flex align-items-center">
                                                <div className="createPostlabel">
                                                    <h6>Visible for</h6>
                                                </div>
                                                <div className="selectWhoSeePost">
                                                    <div className="dropdown">
                                                        <button type="button" className="btn btn-primary" data-bs-toggle="dropdown">
                                                            <span className="me-2">{formik.values.shareType}</span>
                                                            <img src="/images/icons/down-arrow-white.svg" alt="downarrow" className="img-fluid" />
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <div className="form-group">
                                                                    <label className="radioLabel">
                                                                        <input
                                                                            type="radio"
                                                                            id="shareType"
                                                                            name="shareType"
                                                                            value="Friends"
                                                                            onChange={formik.handleChange}
                                                                            className="d-none"
                                                                        />
                                                                        <span className="selectedRadio" />
                                                                        Friends
                                                                    </label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="form-group">
                                                                    <label className="radioLabel">
                                                                        <input
                                                                            type="radio"
                                                                            id="shareType"
                                                                            name="shareType"
                                                                            value="Public"
                                                                            onChange={formik.handleChange}
                                                                            className="d-none"
                                                                        />
                                                                        <span className="selectedRadio" />
                                                                        Public
                                                                    </label>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="button" className="btn-close" onClick={onClose} />
                                        </div>
                                    </div>
                                    {/* Modal body */}
                                    {formik.values.mediaFiles === "" ? (
                                        <div className="modal-body">
                                            <div className="tabSendContent">
                                                <div className="followersList">
                                                    <div className="createPostMind d-flex mb-3">
                                                        <div className="createPostProf">
                                                            <ProfileImage url={user?.profile_img} style={{ borderRadius: "80px" }} />
                                                        </div>
                                                        <div className="createPostTextarea">
                                                            <MentionsInput
                                                                value={value}
                                                                onChange={handleChange}
                                                                style={defaultStyle}
                                                                id="postText"
                                                                className="controlMention"
                                                                placeholder="What's on your mind?"
                                                            >
                                                                <Mention
                                                                    trigger="@"
                                                                    id="message"
                                                                    name="message"
                                                                    onChange={handleChangeInput}
                                                                    markup="@@@____id__^^__display__@@@"
                                                                    data={fetchUsers}
                                                                    style={defaultMention}
                                                                    renderSuggestion={CustomSuggestion}
                                                                    appendSpaceOnAdd={true}
                                                                />
                                                            </MentionsInput>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "25px", marginTop: "10px", marginBottom: "5px" }}>
                                                        <div className="post_category">Category:</div>
                                                        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                                                            <Form.Check
                                                                inline
                                                                label="Financial"
                                                                value="financial"
                                                                name="category"
                                                                type="radio"
                                                                checked={formik.values.category === "financial"}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                            <Form.Check
                                                                inline
                                                                label="Mental"
                                                                value="mental"
                                                                name="category"
                                                                checked={formik.values.category === "mental"}
                                                                type="radio"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="post-tag-parent">
                                                        <label htmlFor="tempKeyword">Post Tags (keywords)</label>
                                                        <div class="input-group mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                style={{ borderRadius: "12px 0 0 12px" }}
                                                                placeholder="Enter your tag or keyword"
                                                                value={tempKeyword}
                                                                id="tempKeyword"
                                                                onChange={(e) => setTempKeyword(e.target.value)}
                                                            />
                                                            <button className="btn btn-outline-secondary"
                                                                style={{
                                                                    borderRadius: "0 12px 12px 0",
                                                                    color: "#ffffff",
                                                                    background: "#00808b"
                                                                }}
                                                                type="button"
                                                                id="button-addon2"
                                                                onClick={(e) => {
                                                                    if (tempKeyword !== "") {
                                                                        formik.setFieldValue("postKeywords", [...formik.values.postKeywords, tempKeyword]);
                                                                        setTempKeyword("");
                                                                    }
                                                                }}
                                                                disabled={((tempKeyword !== "" && tempKeyword.length < 2) || (tempKeyword !== "" && tempKeyword.length > 25) || formik.values.postKeywords.length >= 20) ? true : false}
                                                            >
                                                                <i className="fa fa-plus-circle"></i>
                                                            </button>
                                                        </div>
                                                        {
                                                            (tempKeyword !== "" && tempKeyword.length > 25) && <div className="formik-errors bg-error" style={{ color: "red", marginTop: "-10px", fontSize: "14px" }}>Maximum 25 characters allowed.</div>
                                                        }
                                                        {
                                                            (tempKeyword !== "" && tempKeyword.length < 2) && <div className="formik-errors bg-error" style={{ color: "red", marginTop: "-10px", fontSize: "14px" }}>Minimum 2 characters required.</div>
                                                        }
                                                        {
                                                            formik.values.postKeywords.length >= 20 && <div className="formik-errors bg-error" style={{ color: "red", marginTop: "-10px", fontSize: "14px" }}>Maximum 20 keyWords allowed.</div>
                                                        }
                                                        <div className="post-keyword-container d-flex flex-wrap gap-2">
                                                            {
                                                                formik.values.postKeywords.map((item, idx) => {
                                                                    return (
                                                                        <span className="keywordListItem">
                                                                            <p>{formik.values.postKeywords[idx]}</p>
                                                                            <img
                                                                                src="/images/icons/white-cross.svg"
                                                                                alt="compose-button"
                                                                                classNames="img-fluid composeButton"
                                                                                style={{ height: "12px", width: "12px" }}
                                                                                onClick={() => {
                                                                                    let temp = formik.values.postKeywords;
                                                                                    temp.splice(idx, 1);
                                                                                    formik.setFieldValue("postKeywords", temp);
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="postFile mt-3">
                                                        <div className="addPhoto">
                                                            <input
                                                                style={{ display: "none" }}
                                                                type="file"
                                                                name="mediaFiles"
                                                                id="mediaFiles"
                                                                accept="image/*,video/mp4,video/x-m4v,video/*"
                                                                multiple={true}
                                                                onChange={(event) =>
                                                                    formik.setFieldValue("mediaFiles", [
                                                                        ...formik.values.mediaFiles,
                                                                        ...event.currentTarget.files,
                                                                    ])
                                                                }
                                                            />
                                                            <label htmlFor="mediaFiles" className="btn">
                                                                <img src="/images/icons/image.svg" alt="img-icon" className="img-fluid" />
                                                                <span>Add Photo/Video</span>
                                                            </label>
                                                        </div>
                                                        <div className="postBtn ms-auto">
                                                            <button className="btn btnColor" type="submit">Post</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : formik.values.mediaFiles.length === 1 ? (
                                        <div className="modal-body">
                                            <div className="tabSendContent">
                                                <div className="followersList" style={{ height: "auto" }}>
                                                    <div className="createPostMind d-flex mb-3">
                                                        <div className="createPostProf">
                                                            <ProfileImage url={user?.profile_img} style={{ borderRadius: "80px" }} />
                                                        </div>
                                                        <div className="createPostTxt createPostTextarea">
                                                            <MentionsInput
                                                                value={value}
                                                                onChange={handleChange}
                                                                style={defaultStyle}
                                                                className="controlMention"
                                                                placeholder="What's on your mind?"
                                                            >
                                                                <Mention
                                                                    trigger="@"
                                                                    id="message"
                                                                    name="message"
                                                                    onChange={handleChangeInput}
                                                                    markup="@@@____id__^^__display__@@@"
                                                                    data={fetchUsers}
                                                                    style={defaultMention}
                                                                    renderSuggestion={CustomSuggestion}
                                                                    appendSpaceOnAdd={true}
                                                                />
                                                            </MentionsInput>
                                                            {formik.touched.message && formik.errors.message ? (
                                                                <div className="formik-errors bg-error">{formik.errors.message}</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="post-tag-parent">
                                                        <label htmlFor="tempKeyword">Post Tags (keywords)</label>
                                                        <div class="input-group mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                style={{ borderRadius: "12px 0 0 12px" }}
                                                                placeholder="Enter your tag or keyword"
                                                                value={tempKeyword}
                                                                id="tempKeyword"
                                                                onChange={(e) => setTempKeyword(e.target.value)}
                                                            />
                                                            <button className="btn btn-outline-secondary"
                                                                style={{
                                                                    borderRadius: "0 12px 12px 0",
                                                                    color: "#ffffff",
                                                                    background: "#00808b"
                                                                }}
                                                                type="button"
                                                                id="button-addon2"
                                                                onClick={(e) => {
                                                                    formik.setFieldValue("postKeywords", [...formik.values.postKeywords, tempKeyword]);
                                                                    setTempKeyword("");
                                                                }}
                                                                disabled={((tempKeyword !== "" && tempKeyword.length < 2) || (tempKeyword !== "" && tempKeyword.length > 25) || formik.values.postKeywords.length >= 20) ? true : false}
                                                            >
                                                                <i className="fa fa-plus-circle"></i>
                                                            </button>
                                                        </div>
                                                        {
                                                            (tempKeyword !== "" && tempKeyword.length > 25) && <div className="formik-errors bg-error" style={{ color: "red", marginTop: "-10px", fontSize: "14px" }}>Maximum 25 characters allowed.</div>
                                                        }
                                                        {
                                                            (tempKeyword !== "" && tempKeyword.length < 2) && <div className="formik-errors bg-error" style={{ color: "red", marginTop: "-10px", fontSize: "14px" }}>Minimum 2 characters required.</div>
                                                        }
                                                        {
                                                            formik.values.postKeywords.length >= 20 && <div className="formik-errors bg-error" style={{ color: "red", marginTop: "-10px", fontSize: "14px" }}>Maximum 20 keyWords allowed.</div>
                                                        }
                                                        <div className="post-keyword-container d-flex flex-wrap gap-2">
                                                            {
                                                                formik.values.postKeywords.map((item, idx) => {
                                                                    return (
                                                                        <span className="keywordListItem">
                                                                            <p>{formik.values.postKeywords[idx]}</p>
                                                                            <img
                                                                                src="/images/icons/white-cross.svg"
                                                                                alt="compose-button"
                                                                                classNames="img-fluid composeButton"
                                                                                style={{ height: "12px", width: "12px" }}
                                                                                onClick={() => {
                                                                                    let temp = formik.values.postKeywords;
                                                                                    temp.splice(idx, 1);
                                                                                    formik.setFieldValue("postKeywords", temp);
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="gallery position-relative mt-3">
                                                        <div className="gallerySlider">
                                                            <OwlCarousel
                                                                className="owl-carousel owl-theme gallerySlider"
                                                                loop={false}
                                                                margin={10}
                                                                dots={false}
                                                                nav={true}
                                                                responsive={{
                                                                    0: {
                                                                        items: 1,
                                                                    },
                                                                    600: {
                                                                        items: 1,
                                                                    },
                                                                    1000: {
                                                                        items: 1,
                                                                    },
                                                                }}
                                                            >
                                                                <div className="item">
                                                                    <div className="galleryImg">
                                                                        {/* <a href="javascript:void(0);" onClick={() => handleRemoveFile(0)} className="galleryCloseIcon position-absolute"><img src="/images/icons/close.svg" alt="close" className="img-fluid" /></a> */}
                                                                        <button
                                                                            type="button"
                                                                            className="btn-close galleryCloseIcon position-absolute"
                                                                            onClick={() => handleRemoveFile(0)}
                                                                        />
                                                                        {formik.values.mediaFiles[0].type.includes("image") ? (
                                                                            <img
                                                                                src={URL.createObjectURL(formik.values.mediaFiles[0])}
                                                                                alt="gallery"
                                                                                className="img-fluid galleryImg-image-custom"
                                                                            />
                                                                        ) : (
                                                                            <>
                                                                                <VideoImageThumbnail
                                                                                    videoUrl={URL.createObjectURL(formik.values.mediaFiles[0])}
                                                                                    alt="video"
                                                                                />
                                                                                <div className="overLay">
                                                                                    <span>
                                                                                        <i className="fa-sharp fa-solid fa-play"></i>
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </OwlCarousel>
                                                        </div>
                                                    </div>
                                                    <div className="postFile galleryPostFile mt-3">
                                                        <div className="addPhoto">
                                                            <input
                                                                style={{ display: "none" }}
                                                                type="file"
                                                                name="mediaFiles"
                                                                id="mediaFiles"
                                                                accept="image/*,video/mp4,video/x-m4v,video/*"
                                                                multiple={true}
                                                                onChange={(event) =>
                                                                    formik.setFieldValue("mediaFiles", [
                                                                        ...formik.values.mediaFiles,
                                                                        ...event.currentTarget.files,
                                                                    ])
                                                                }
                                                            />
                                                            <label htmlFor="mediaFiles" className="btn">
                                                                <img src="/images/icons/image.svg" alt="img-icon" className="img-fluid" />
                                                                <span>Add Photo/Video</span>
                                                            </label>
                                                        </div>
                                                        <div className="postBtn ms-auto">
                                                            <button className="btn btnColor" type="submit">Post</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="modal-body">
                                            <div className="tabSendContent">
                                                <div className="followersList">
                                                    <div className="createPostMind d-flex mb-3">
                                                        <div className="createPostProf">
                                                            <ProfileImage url={user?.profile_img} style={{ borderRadius: "80px" }} />
                                                        </div>
                                                        <div className="createPostTxt createPostTextarea">
                                                            <MentionsInput
                                                                value={value}
                                                                onChange={handleChange}
                                                                style={defaultStyle}
                                                                className="controlMention"
                                                                placeholder="What's on your mind?"
                                                            >
                                                                <Mention
                                                                    trigger="@"
                                                                    id="message"
                                                                    name="message"
                                                                    onChange={handleChangeInput}
                                                                    markup="@@@____id__^^__display__@@@"
                                                                    data={fetchUsers}
                                                                    style={defaultMention}
                                                                    renderSuggestion={CustomSuggestion}
                                                                    appendSpaceOnAdd={true}
                                                                />
                                                            </MentionsInput>
                                                            {formik.touched.message && formik.errors.message ? (
                                                                <div className="formik-errors bg-error">{formik.errors.message}</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="post-tag-parent">
                                                        <label htmlFor="tempKeyword">Post Tags (keywords)</label>
                                                        <div class="input-group mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                style={{ borderRadius: "12px 0 0 12px" }}
                                                                placeholder="Enter your tag or keyword"
                                                                value={tempKeyword}
                                                                id="tempKeyword"
                                                                onChange={(e) => setTempKeyword(e.target.value)}
                                                            />
                                                            <button className="btn btn-outline-secondary"
                                                                style={{
                                                                    borderRadius: "0 12px 12px 0",
                                                                    color: "#ffffff",
                                                                    background: "#00808b"
                                                                }}
                                                                type="button"
                                                                id="button-addon2"
                                                                onClick={(e) => {
                                                                    formik.setFieldValue("postKeywords", [...formik.values.postKeywords, tempKeyword]);
                                                                    setTempKeyword("");
                                                                }}
                                                                disabled={((tempKeyword !== "" && tempKeyword.length < 2) || (tempKeyword !== "" && tempKeyword.length > 25) || formik.values.postKeywords.length >= 20) ? true : false}
                                                            >
                                                                <i className="fa fa-plus-circle"></i>
                                                            </button>
                                                        </div>
                                                        {
                                                            (tempKeyword !== "" && tempKeyword.length > 25) && <div className="formik-errors bg-error" style={{ color: "red", marginTop: "-10px", fontSize: "14px" }}>Maximum 25 characters allowed.</div>
                                                        }
                                                        {
                                                            (tempKeyword !== "" && tempKeyword.length < 2) && <div className="formik-errors bg-error" style={{ color: "red", marginTop: "-10px", fontSize: "14px" }}>Minimum 2 characters required.</div>
                                                        }
                                                        {
                                                            formik.values.postKeywords.length >= 20 && <div className="formik-errors bg-error" style={{ color: "red", marginTop: "-10px", fontSize: "14px" }}>Maximum 20 keyWords allowed.</div>
                                                        }
                                                        <div className="post-keyword-container d-flex flex-wrap gap-2">
                                                            {
                                                                formik.values.postKeywords.map((item, idx) => {
                                                                    return (
                                                                        <span className="keywordListItem">
                                                                            <p>{formik.values.postKeywords[idx]}</p>
                                                                            <img
                                                                                src="/images/icons/white-cross.svg"
                                                                                alt="compose-button"
                                                                                classNames="img-fluid composeButton"
                                                                                style={{ height: "12px", width: "12px" }}
                                                                                onClick={() => {
                                                                                    let temp = formik.values.postKeywords;
                                                                                    temp.splice(idx, 1);
                                                                                    formik.setFieldValue("postKeywords", temp);
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="gallery position-relative mt-3">
                                                        <div className="gallerySlider">
                                                            <OwlCarousel
                                                                className="owl-carousel owl-theme gallerySlider"
                                                                loop={false}
                                                                margin={10}
                                                                dots={false}
                                                                nav={true}
                                                                responsive={{
                                                                    0: {
                                                                        items: 1,
                                                                    },
                                                                    600: {
                                                                        items: 1,
                                                                    },
                                                                    1000: {
                                                                        items: 1,
                                                                    },
                                                                }}
                                                            >
                                                                {formik.values.mediaFiles.map((item, idx) => {
                                                                    return (
                                                                        <div className="item">
                                                                            <div className="galleryImg">
                                                                                {/* <a href="javascript:void(0);" onClick={() => handleRemoveFile(idx)} className="galleryCloseIcon position-absolute"><img src="/images/icons/close.svg" alt="close" className="img-fluid" /></a> */}
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn-close galleryCloseIcon position-absolute"
                                                                                    onClick={() => handleRemoveFile(idx)}
                                                                                />
                                                                                {/* <img src={URL.createObjectURL(item)} alt="gallery" className="img-fluid" /> */}
                                                                                {item.type.includes("image") ? (
                                                                                    <img
                                                                                        src={URL.createObjectURL(item)}
                                                                                        alt="gallery"
                                                                                        className="img-fluid galleryImg-image-custom"
                                                                                    />
                                                                                ) : (
                                                                                    <>
                                                                                        <VideoImageThumbnail
                                                                                            videoUrl={URL.createObjectURL(item)}
                                                                                            // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                                                                            // width={120}
                                                                                            // height={80}
                                                                                            alt="video"
                                                                                        />
                                                                                        <div className="overLay">
                                                                                            <span className="fa-sharp fa-solid fa-play"></span>
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </OwlCarousel>
                                                        </div>
                                                    </div>
                                                    {
                                                        formik.values.mediaFiles.length > 0 ? (
                                                            <div className="gridGallery">
                                                                {
                                                                    formik.values.mediaFiles[1].type.includes("image") ? (
                                                                        <div className="gridGalleryImg">
                                                                            <img
                                                                                src={URL.createObjectURL(formik.values.mediaFiles[1])}
                                                                                alt="gallery"
                                                                                className="img-fluid galleryImg-image-custom"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <VideoImageThumbnail
                                                                                videoUrl={URL.createObjectURL(formik.values.mediaFiles[1])}
                                                                                alt="video"
                                                                            />
                                                                            <div className="overLay">
                                                                                <span className="fa-sharp fa-solid fa-play"></span>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                }
                                                                {formik.values.mediaFiles.length > 2 && (
                                                                    <div className="gridGalleryImg">
                                                                        {/* <img src={URL.createObjectURL(formik.values.mediaFiles[2])} alt="gallery" className="img-fluid" /> */}
                                                                        {formik.values.mediaFiles[2].type.includes("image") ? (
                                                                            <img
                                                                                src={URL.createObjectURL(formik.values.mediaFiles[2])}
                                                                                alt="gallery"
                                                                                className="img-fluid galleryImg-image-custom"
                                                                            />
                                                                        ) : (
                                                                            <>
                                                                                <VideoImageThumbnail
                                                                                    videoUrl={URL.createObjectURL(formik.values.mediaFiles[2])}
                                                                                    // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                                                                    // width={120}
                                                                                    // height={80}
                                                                                    alt="video"
                                                                                />
                                                                                <div className="overLay">
                                                                                    <span className="fa-sharp fa-solid fa-play"></span>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {formik.values.mediaFiles.length > 3 && (
                                                                    <div className="gridGalleryImg overlayMoreImg">
                                                                        <Link>
                                                                            {/* <img src={URL.createObjectURL(formik.values.mediaFiles[3])} alt="gallery" className="img-fluid" /> */}
                                                                            {formik.values.mediaFiles[3]?.type.includes("image") ? (
                                                                                <img
                                                                                    src={URL.createObjectURL(formik.values.mediaFiles[3])}
                                                                                    alt="gallery"
                                                                                    className="img-fluid galleryImg-image-custom"
                                                                                />
                                                                            ) : (
                                                                                <VideoImageThumbnail
                                                                                    videoUrl={URL.createObjectURL(formik.values.mediaFiles[3])}
                                                                                    // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                                                                    // width={120}
                                                                                    // height={80}
                                                                                    alt="video"
                                                                                />
                                                                            )}
                                                                            {formik.values.mediaFiles.length - 4 > 0 && (
                                                                                <div className="overLay">
                                                                                    <span>+{formik.values.mediaFiles.length - 4}</span>
                                                                                </div>
                                                                            )}
                                                                        </Link>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )
                                                    }
                                                    <div className="postFile galleryPostFile mt-3">
                                                        <div className="addPhoto">
                                                            <input
                                                                style={{ display: "none" }}
                                                                type="file"
                                                                name="mediaFiles"
                                                                id="mediaFiles"
                                                                accept="image/*,video/mp4,video/x-m4v,video/*"
                                                                multiple={true}
                                                                onChange={(event) =>
                                                                    formik.setFieldValue("mediaFiles", [
                                                                        ...formik.values.mediaFiles,
                                                                        ...event.currentTarget.files,
                                                                    ])
                                                                }
                                                            />
                                                            <label htmlFor="mediaFiles" className="btn">
                                                                <img src="/images/icons/image.svg" alt="img-icon" className="img-fluid" />
                                                                <span>Add Photo/Video</span>
                                                            </label>
                                                        </div>
                                                        <div className="postBtn ms-auto">
                                                            <button className="btn btnColor" type="submit">Post</button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
            {
                isSubmit && (
                    <>
                        <div className="loader-container d-flex flex-column align-items-center">
                            <LoadingSpin
                                duration="2s"
                                width="4px"
                                timingFunction="ease-in-out"
                                direction="alternate"
                                size="45px"
                                primaryColor="#00808B"
                                secondaryColor="#212529"
                                numberOfRotationsInAnimation={2}
                            />
                            <span style={{ color: "#ffffff", margin: "1.0rem 0" }}>Uploading your post...</span>
                            <button type="button" onClick={cancelFormSubmit} style={{ background: "#000000", color: "#ffffff", borderRadius: "15px", padding: "5px 10px", border: "1px solid #ffffff" }}>Cancel</button>
                        </div>
                        <div className="modal-backdrop modal-backdrop-CustomLoading show" style={{ background: "#000000", opacity: "0.67" }}></div>
                    </>
                )
            }
        </>
    );
}
