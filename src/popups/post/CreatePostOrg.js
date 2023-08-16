import React, { useState, useEffect, useContext, useRef } from "react";
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
import axios from "axios";

const serv = new UserService();

const ValidateSchema = Yup.object().shape({
    // message: Yup.string().required("Required"),
    shareType: Yup.string().required("Required"),
});
const userFollowerServ = new UserFollowerService();

function fetchUsers(query, callback) {
    if (!query) return
    let obj = { searchText: query };

    serv.getMentionUsers(obj).then((res) => {
        if (res.data?.length > 0)
            return res.data.map(user => ({ display: user.user_name, id: user._id, img: user.profile_img }))
    }).then(callback);
}


export default function CreatePost({ onClose, onSuccess, onFail }) {

    const source = axios.CancelToken.source();

    const postServ = new PostService();
    const notificationServ = new NotificationService();
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [userList, setUserList] = useState([]);
    const [searchText, setSearchText] = useState("");
    // const [mentionableUserList, setMentionableUserList] = useState([]);
    const [mentionedUserList, setMentionedUserList] = useState([]);
    const [mentionedUser, setMentionedUser] = useState({});
    const [inputPost, setInputPost] = useState("");
    // const [inputPostShow, setInputPostShow] = useState("");

    const [initialValue, setInitialValue] = useState({
        message: "",
        mediaFiles: "",
        shareType: "Friends",
    });
    const [value, setValue] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        getFollowerList();
        // getUserDataMention(); 

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

    // const getUserDataMention = () => {
    //   const MentionableUser = [];
    //   userList.forEach((item) => MentionableUser.push({ id: item.userId._id, display: item.userId.user_name }));
    //   setMentionableUserList(MentionableUser);
    // };

    const onSubmit = async (values) => {

        setIsSubmit(true);

        let str = inputPost;
        // for (const item in mentionedUserList) {
        //     if (!str.includes(`@${mentionedUserList[item].user_name}`)) {
        //         let newStr = str.replace(
        //             `${mentionedUserList[item].user_name}`,
        //             `@${mentionedUserList[item].user_name}`
        //             // `<a target="_blank" rel="noopener noreferrer" href="http://localhost:3000/userprofile/${mentionedUserList[item]._id}">${mentionedUserList[item].user_name}</a>`
        //         );
        //         str = newStr;
        //     }
        // }
        try {
            let userPostMessage = "";
            str = str.split("@@@__").join('<a href="/userprofile/');
            str = str.split("^^").join('">@');
            str = str.split("@@@").join("</a>");
            if (str !== "") {
                userPostMessage = str.trim();
            }
            //console.log("User posts now as ", userPostMessage);
            const formData = new FormData();

            formData.append("message", userPostMessage);
            formData.append("shareType", values.shareType);
            formData.append("createdBy", user._id);
            if (Array.isArray(values.mediaFiles)) {
                values.mediaFiles.forEach((element) => {
                    formData.append("mediaFiles", element);
                });
            }
            await postServ.sendPost(formData).then((resp) => {
                if (resp.data) {
                    //   console.log("resp", resp.data);
                    //   parsedPostMessage.forEach((item) => {
                    //     let notificationData = {
                    //       postId: resp.data._id,
                    //       title: "tagged you in a post",
                    //       type: "Tagged",
                    //       createdBy: user._id,
                    //       createdFor: item.id,
                    //     };
                    //     const response = notificationServ.sendNotification(notificationData);
                    //   });
                    onSuccess();
                    setIsSubmit(false);
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
    };

    const handleCompUserList = (item, type) => {
        if (type === "add") {
            setMentionedUser(item);
            setMentionedUserList([...mentionedUserList, item]);
            setInputPost((inputPost) => inputPost.substring(0, inputPost.indexOf("@")) + item.user_name);
            // setInputPostShow((inputPost) => inputPost.substring(0, inputPost.indexOf("@")) + item.user_name);
            setSearchText("");
        } else {
            setMentionedUserList([]);
        }
        document.getElementById("message").autofocus = true;
    };

    const CustomSuggestion = ({ suggestion, ...props }) => (
        <div {...props} style={{ padding: "5px", display: "flex", alignItems: "center" }}>
            <img src={props.img !== "" ? props.img : "/images/user.png"} alt={props.display} style={{ width: "32px", height: "32px", borderRadius: "16px", marginRight: "5px" }} />
            <div style={{ fontSize: "1.0rem" }}>{props.display}</div>
        </div>
    );


    return (
        <>
            {
                /* 
                {
                    showLoadingBar ? (
                        <div className="loader-container">
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
                        </div>
                    ) : ( 
                */
            }
            <div className="modal" style={{ display: "block" }}>
                <div className="vertical-alignment-helper">
                    <div className="vertical-align-center">
                        <div className="createPostModel modal-dialog modal-lg">
                            <div className="modal-content">
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
                                                            <span>{formik.values.shareType}</span>{" "}
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
                                                            {
                                                                /* 
                                                                    <li>
                                                                        <div className="form-group">
                                                                            <label className="radioLabel">
                                                                                <input type="radio" id="shareType" name="shareType" value="Only me" onChange={formik.handleChange} className="d-none" />
                                                                                <span className="selectedRadio" />
                                                                                Only me
                                                                            </label>
                                                                        </div>
                                                                    </li> 
                                                                */
                                                            }
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
                                                    <div className="createPostMind d-flex">
                                                        <div className="createPostProf">
                                                            <ProfileImage url={user?.profile_img} style={{ borderRadius: "80px" }} />
                                                        </div>
                                                        <div className="createPostTextarea">
                                                            {/* <textarea className="form-control" rows={6} id name placeholder="What's on your mind?" defaultValue={""} /> */}
                                                            {
                                                                /* 
                                                                <textarea
                                                                    className="form-control"
                                                                    rows={formik.values.message.length > 180 ? "12" : "6"}
                                                                    id="message"
                                                                    name="message"
                                                                    placeholder="What's on your mind?"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    value={formik.values.message}
                                                                    /> 
                                                                */
                                                            }
                                                            {
                                                                /*  
                                                                    * conmented as new mention user in post is introduced on dt. 10-may-2023
                                                                    <textarea
                                                                        className="form-control"
                                                                        rows={inputPost.length > 180 ? "12" : "6"}
                                                                        id="message"
                                                                        name="message"
                                                                        placeholder="What's on your mind?"
                                                                        onChange={handleChangeInput}
                                                                        onBlur={formik.handleBlur}
                                                                        value={inputPost}
                                                                    />
                                                                */
                                                            }

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

                                                            {searchText && (
                                                                <div className="searchListFlow">
                                                                    <div className="search_dataList search_dataList-custom">
                                                                        <div className="overflow_searchList followListsInner">
                                                                            {userList.filter((i) => {
                                                                                return (
                                                                                    // i.userId?.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
                                                                                    i.userId?.user_name?.toLowerCase().includes(searchText.toLowerCase())
                                                                                );
                                                                            }).length > 0 ? (
                                                                                userList
                                                                                    .filter((i) => {
                                                                                        return (
                                                                                            // i.userId?.userId.toLowerCase().includes(searchText.toLowerCase()) ||
                                                                                            i.userId?.user_name?.toLowerCase().includes(searchText.toLowerCase())
                                                                                        );
                                                                                    })
                                                                                    .map((item) => {
                                                                                        return (
                                                                                            <div className="search_userCompose">
                                                                                                <Link
                                                                                                    onClick={() => handleCompUserList(item.userId, "add")}
                                                                                                >
                                                                                                    <div className="followOtherUser">
                                                                                                        <div className="followOtherUserName">
                                                                                                            <h5 className="mb-0">{item.userId?.user_name}</h5>
                                                                                                            <p className="mb-0">{item.userId?.title}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </Link>
                                                                                            </div>
                                                                                        );
                                                                                    })
                                                                            ) : (
                                                                                <p class="px-3 noData_found">Sorry, no user found with this name</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {formik.touched.message && formik.errors.message ? (
                                                                <div className="formik-errors bg-error">{formik.errors.message}</div>
                                                            ) : null}
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
                                                                {/* <div className="addVideo">
                                                                <input
                                                                    style={{ display: "none" }}
                                                                    type="file"
                                                                    name="mediaFiles"
                                                                    id="mediaFilesVideo"
                                                                    accept="video/mp4,video/x-m4v,video/*"
                                                                    multiple={true}
                                                                    onChange={(event) => formik.setFieldValue(
                                                                        "mediaFiles",
                                                                        [...formik.values.mediaFiles, ...event.currentTarget.files]
                                                                    )}
                                                                />
                                                                <label htmlFor="mediaFilesVideo" className="btn">
                                                                    <img src="/images/icons/video.svg" alt="img-icon" className="img-fluid" />
                                                                    <span>Add Video</span>
                                                                </label>
                                                            </div> */}
                                                                <div className="postBtn ms-auto">
                                                                    <button className="btn btnColor" type="submit">Post</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : formik.values.mediaFiles.length === 1 ? (
                                        <div className="modal-body">
                                            <div className="tabSendContent">
                                                <div className="followersList">
                                                    <div className="createPostMind d-flex">
                                                        <div className="createPostProf">
                                                            <ProfileImage url={user?.profile_img} style={{ borderRadius: "80px" }} />
                                                        </div>
                                                        <div className="createPostTxt createPostTextarea">

                                                            <textarea
                                                                className="form-control border-0"
                                                                rows="3"
                                                                id="message"
                                                                name="message"
                                                                placeholder="What's on your mind?"
                                                                onChange={handleChangeInput}
                                                                onBlur={formik.handleBlur}
                                                                value={inputPost}
                                                            />
                                                            {searchText && (
                                                                <div className="searchListFlow">
                                                                    <div className="search_dataList search_dataList-custom">
                                                                        <div className="overflow_searchList followListsInner">
                                                                            {userList.filter((i) => {
                                                                                return (
                                                                                    // i.userId?.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
                                                                                    i.userId?.user_name?.toLowerCase().includes(searchText.toLowerCase())
                                                                                );
                                                                            }).length > 0 ? (
                                                                                userList
                                                                                    .filter((i) => {
                                                                                        return (
                                                                                            // i.userId?.userId.toLowerCase().includes(searchText.toLowerCase()) ||
                                                                                            i.userId?.user_name?.toLowerCase().includes(searchText.toLowerCase())
                                                                                        );
                                                                                    })
                                                                                    .map((item) => {
                                                                                        return (
                                                                                            <div className="search_userCompose">
                                                                                                <Link onClick={() => handleCompUserList(item.userId, "add")}>
                                                                                                    <div className="followOtherUser">
                                                                                                        <div className="followOtherUserName">
                                                                                                            <h5 className="mb-0">{item.userId?.user_name}</h5>
                                                                                                            <p className="mb-0">{item.userId?.title}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </Link>
                                                                                            </div>
                                                                                        );
                                                                                    })
                                                                            ) : (
                                                                                <p class="px-3 noData_found">Sorry, no user found with this name</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {formik.touched.message && formik.errors.message ? (
                                                                <div className="formik-errors bg-error">{formik.errors.message}</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="gallery position-relative">
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
                                                                                    // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                                                                    // width={120}
                                                                                    // height={80}
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
                                                        {/* <div className="addVideo">
                                                                <input
                                                                    style={{ display: "none" }}
                                                                    type="file"
                                                                    name="mediaFiles"
                                                                    id="mediaFilesVideo"
                                                                    accept="video/mp4,video/x-m4v,video/*"
                                                                    multiple={true}
                                                                    onChange={(event) => formik.setFieldValue(
                                                                        "mediaFiles",
                                                                        [...formik.values.mediaFiles, ...event.currentTarget.files]
                                                                    )}
                                                                />
                                                                <label htmlFor="mediaFilesVideo" className="btn">
                                                                    <img src="/images/icons/video.svg" alt="img-icon" className="img-fluid" />
                                                                    <span>Add Video</span>
                                                                </label>
                                                            </div> */}
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
                                                    <div className="createPostMind d-flex">
                                                        <div className="createPostProf">
                                                            <ProfileImage url={user?.profile_img} style={{ borderRadius: "80px" }} />
                                                        </div>
                                                        <div className="createPostTxt createPostTextarea">
                                                            {/* <p>{formik.values.message}</p> */}
                                                            {/* <textarea
                                  className="form-control border-0"
                                  rows="3"
                                  id="message"
                                  name="message"
                                  placeholder="What's on your mind?"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.message}
                                /> */}
                                                            <textarea
                                                                className="form-control border-0"
                                                                rows="3"
                                                                id="message"
                                                                name="message"
                                                                placeholder="What's on your mind?"
                                                                onChange={handleChangeInput}
                                                                onBlur={formik.handleBlur}
                                                                value={inputPost}
                                                            />
                                                            {searchText && (
                                                                <div className="searchListFlow">
                                                                    <div className="search_dataList search_dataList-custom">
                                                                        <div className="overflow_searchList followListsInner">
                                                                            {userList.filter((i) => {
                                                                                return (
                                                                                    // i.userId?.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
                                                                                    i.userId?.user_name?.toLowerCase().includes(searchText.toLowerCase())
                                                                                );
                                                                            }).length > 0 ? (
                                                                                userList
                                                                                    .filter((i) => {
                                                                                        return (
                                                                                            // i.userId?.userId.toLowerCase().includes(searchText.toLowerCase()) ||
                                                                                            i.userId?.user_name?.toLowerCase().includes(searchText.toLowerCase())
                                                                                        );
                                                                                    })
                                                                                    .map((item) => {
                                                                                        return (
                                                                                            <div className="search_userCompose">
                                                                                                <Link onClick={() => handleCompUserList(item.userId, "add")}>
                                                                                                    <div className="followOtherUser">
                                                                                                        <div className="followOtherUserName">
                                                                                                            <h5 className="mb-0">{item.userId?.user_name}</h5>
                                                                                                            <p className="mb-0">{item.userId?.title}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </Link>
                                                                                            </div>
                                                                                        );
                                                                                    })
                                                                            ) : (
                                                                                <p class="px-3 noData_found">Sorry, no user found with this name</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {formik.touched.message && formik.errors.message ? (
                                                                <div className="formik-errors bg-error">{formik.errors.message}</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="gallery position-relative">
                                                        <div className="gallerySlider">
                                                            {/* <div className="owl-carousel owl-theme gallerySlider"> */}
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
                                                    <div className="gridGallery">
                                                        <div className="gridGalleryImg">
                                                            {/* <img src={URL.createObjectURL(formik.values.mediaFiles[1])} alt="gallery" className="img-fluid" /> */}
                                                            {formik.values.mediaFiles[1].type.includes("image") ? (
                                                                <img
                                                                    src={URL.createObjectURL(formik.values.mediaFiles[1])}
                                                                    alt="gallery"
                                                                    className="img-fluid galleryImg-image-custom"
                                                                />
                                                            ) : (
                                                                <>
                                                                    <VideoImageThumbnail
                                                                        videoUrl={URL.createObjectURL(formik.values.mediaFiles[1])}
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
                                                                    {formik.values.mediaFiles[3].type.includes("image") ? (
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
                                                        {/* <div className="addVideo">
                                                                <input
                                                                    style={{ display: "none" }}
                                                                    type="file"
                                                                    name="mediaFiles"
                                                                    id="mediaFilesVideo"
                                                                    accept="video/mp4,video/x-m4v,video/*"
                                                                    multiple={true}
                                                                    onChange={(event) => formik.setFieldValue(
                                                                        "mediaFiles",
                                                                        [...formik.values.mediaFiles, ...event.currentTarget.files]
                                                                    )}
                                                                />
                                                                <label htmlFor="mediaFilesVideo" className="btn">
                                                                    <img src="/images/icons/video.svg" alt="img-icon" className="img-fluid" />
                                                                    <span>Add Video</span>
                                                                </label>
                                                            </div> */}
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
                </div >
            </div >
            {/* )} */}
            <div className="modal-backdrop show" ></div>
            {isSubmit && (
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
            )}
        </>
    );
}
