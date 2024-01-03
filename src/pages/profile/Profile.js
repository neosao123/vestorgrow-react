import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../context/GlobalContext";
import SuggestedService from "../../services/suggestedService";
import ProfileImage from "../../shared/ProfileImage";
import PostService from "../../services/postService";
import UserService from "../../services/UserService";
import UserFollowerService from "../../services/userFollowerService";
import HelperFunctions from "../../services/helperFunctions";
import EditProfile from "../../popups/profile/EditProfile";
import DetailAbout from "../../popups/about/DetailAbout";
import EditAbout from "../../popups/about/EditAbout";
import CreatePost from "../../popups/post/CreatePost";
import PostShareSuccess from "../../popups/post/PostSharedSuccess";
import PostShareFail from "../../popups/post/PostSharedFail";
import moment from "moment";
import FollowerFollowingList from "../../popups/followerFollowingList/FollowerFollowingList";
import VideoImageThumbnail from "react-video-thumbnail-image";
import EditCoverImage from "../../popups/profile/EditCoverImage";
import EditProfileImage from "../../popups/profile/EditProfileImage";
import DiscoverPost from "../../popups/discovery/DiscoverPost";
import MyGroupList from "./MyGroupList";
import LoadingSpin from "react-loading-spin";
import Playeryoutube from '../../components/Playeryoutube';
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserSharedPost from "../../popups/post/UserSharedPost";
import './profile.css';
import UserLikedPost from "../../popups/post/UserLikedPost";
import AllSuggestions from "./AllSuggestions";
import { toast } from 'react-toastify';

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];

const Profile = () => {
    const navigate = useNavigate();
    const suggestedServ = new SuggestedService();
    const userServ = new UserService();
    const postServ = new PostService();
    const helperServ = new HelperFunctions();
    const followerServ = new UserFollowerService();

    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;

    const [postList, setPostList] = useState([]);
    const [firstRowList, setFirstRowList] = useState([]);
    const [secondRowList, setSecondRowList] = useState([]);
    const [thirdRowList, setThirdRowList] = useState([]);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [showGroup, setShowGroup] = useState(false);
    const [showEditAbout, setShowEditAbout] = useState(false);
    const [createPostPopup, setCreatePostPopup] = useState(false);
    const [postSuccessPopup, setPostSuccessPopup] = useState(false);
    const [postFailPopup, setPostFailPopup] = useState(false);
    const [showUserLikedPost, setShowUserLikedPost] = useState(false);
    const [showUserList, setShowUserList] = useState(null);
    const [userData, setUserData] = useState(null);
    const [showEditCoverImg, setShowEditCoverImg] = useState(null);
    const [showEditProfileImg, setShowEditProfileImg] = useState(null);
    const [showPostId, setShowPostId] = useState("");
    const [postIdx, setPostIdx] = useState();
    const [showLoadingBar, setShowLoadingBar] = useState(false);
    const [partition, setPartition] = useState(1);
    const [showUserSharedPost, setShowUserSharedPost] = useState("");
    const [activeTab, setActiveTab] = useState("about");

    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [showSuggestedProfiles, setShowSuggestedProfiles] = useState(false);
    const [mousehover, setMouserHover] = useState(false);

    const getPostList = async () => {
        const obj = { filter: {} };
        obj.filter.is_active = true;
        obj.filter.createdBy = user._id;
        try {
            let resp = await postServ.postList(obj);
            if (resp.data) {
                let firstRow = [];
                let secondRow = [];
                let thirdRow = [];
                let partTemp = parseInt(resp.data.length / 3);
                setPartition(partTemp);
                resp.data.forEach((item, idx) => {
                    if (partTemp > idx) {
                        firstRow.push(item);
                    } else if (partTemp * 2 > idx) {
                        secondRow.push(item);
                    } else {
                        thirdRow.push(item);
                    }
                });
                setPostList(resp.data);
                setFirstRowList([...firstRow]);
                setSecondRowList([...secondRow]);
                setThirdRowList([...thirdRow]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getUserData = async () => {
        try {
            let resp = await userServ.getUser(user?._id);
            if (resp.data) {
                setUser(resp.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleEditProfile = (e) => {
        const element = e.target;
        setTimeout(() => {
            element.blur();
        }, 300);
        setShowEditProfile(!showEditProfile);
    }

    const handleEditAbout = (e) => {
        const element = e.target;
        setTimeout(() => {
            element.blur();
        }, 300);
        setShowEditAbout(!showEditAbout);
    };

    const handleCreatePostPopup = () => {
        setCreatePostPopup(!createPostPopup);
    };

    const handlePostSuccessPopup = () => {
        setPostSuccessPopup(!postSuccessPopup);
    };

    const handlePostFailPopup = () => {
        setPostFailPopup(!postFailPopup);
    };

    const deletePost = async (postId) => {
        try {
            let resp = await postServ.deletePost(postId);
            if (resp.message) {
                getPostList();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handlePostPopup = (postId, idx) => {
        if (showPostId === postId) {
            setShowPostId("");
        } else {
            setShowPostId(postId);
            setPostIdx(idx);
        }
    };

    const changePostIdx = (idx) => {
        let newPostIdx = postIdx + idx;
        setPostIdx(newPostIdx);
        setShowPostId(postList[newPostIdx]._id);
    };

    const dislikePost = async (postId) => {
        try {
            let resp = await postServ.dislikePost(postId);
            if (resp.message) {
                // getPostList();
                let _postList = postList;
                let _postListIdx = _postList.findIndex((i) => i._id === postId);
                _postList[_postListIdx].isLiked = false;
                _postList[_postListIdx].likeCount = _postList[_postListIdx].likeCount - 1;
                setPostList([..._postList]);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const likePost = async (postId) => {
        try {
            let resp = await postServ.likePost({ postId: postId });
            if (resp.data) {
                let _postList = postList;
                let _postListIdx = _postList.findIndex((i) => i._id === postId);
                _postList[_postListIdx].isLiked = true;
                _postList[_postListIdx].likeCount = _postList[_postListIdx].likeCount + 1;
                setPostList([..._postList]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleShowComment = (id) => {
    };

    const handleShowShared = (id) => {
        setShowUserSharedPost(id)
    }

    const handleCoverImage = (img) => {
        setShowEditCoverImg(null);
    };

    const handleProfileImage = (img) => {
        setShowEditProfileImg(null);
    };

    const getSuggestedUsers = async () => {
        try {
            try {
                let res = await suggestedServ.suggestListHome();
                setSuggestedUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleActiveTab = (activetab) => {
        setTimeout(async () => {
            setActiveTab(activetab);
            if (activeTab !== "posts") {
                getSuggestedUsers();
            }
        }, 200);
    }

    const onClose = () => {
        setShowPostId("");
        document.body.style.overflow = "";
        document.body.style.marginRight = "";
    };

    const matchYoutubeUrl = (url) => {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? true : false;
    }

    const handleFollowReq = async (id, user_name, isRequested) => {
        try {
            let resp = await followerServ.sendFollowReq({ followingId: id });
            if (resp.data) {
                getSuggestedUsers();
                getUserData();
                const message = isRequested ? `You have requested to follow ${user_name}` : `You are now following ${user_name}`;
                toast.success(message, {
                    position: "top-center",
                    closeOnClick: true,
                    pauseOnHover: true
                });
            }
        } catch (err) {
            console.log("Failed");
        }
    };

    let twitterurl = "http://twitter.com/share?text=vestorgrow home page&url=";
    let facebookurl = "https://www.facebook.com/sharer/sharer.php?t=vestorgrow home page&u=";
    let mailto = `mailto:${user?.email}?subject=Vestorgrow!!!&body=`;

    const countFormator = (counter) => {
        if (counter >= 1000000000) {
            return (counter / 1000000000).toFixed(1) + "B";
        } else if (counter >= 1000000) {
            return (counter / 1000000).toFixed(1) + "M";
        } else if (counter >= 1000) {
            return (counter / 1000).toFixed(1) + "K";
        } else {
            return counter.toString();
        }
    }

    const closeSuggestionModal = () => {
        setShowSuggestedProfiles(!showSuggestedProfiles);
    }

    useEffect(() => {
        getPostList();
        getUserData();
        getSuggestedUsers();
    }, []);

    const handlemouseHover = () => {
        setMouserHover(true);
    }

    const handlemouseOut = () => {
        setMouserHover(false);
    }

    const handleShowImage = (img) => {
        setShowEditProfileImg(img)
    }

    return (
        <div>
            <div className="socialContant profileContent main_container">
                <div className="myProfile_sec">
                    <div className="about_profile">
                        <div
                            className="profileCoverPic mx-0"
                            style={
                                user?.cover_img
                                    ? { backgroundImage: `url(${user?.cover_img})`, backgroundColor: "grey", display: "flex" }
                                    : { backgroundImage: "url(/images/profile/image_cover_profile.png)", backgroundColor: "grey" }

                            }
                        >
                            <div className="profile_image_pic position-relative profile_image_top_margin image_div" style={{ borderRadius: "50%" }}
                                onMouseOver={handlemouseHover}
                                onMouseOut={handlemouseOut}
                            >
                                <div className={`profile_pic_image profile_pic_image  ${mousehover ? "profile_image_pic_actual1" : "profile_image_pic_actual"}`} id="profile_image"
                                >
                                    <ProfileImage url={user?.profile_img} style={{ height: "100%", width: "100%", borderRadius: "80px" }} />
                                </div>
                                <div
                                    className={`edit_btnImg edit_btnImg-customMobile ${mousehover ? "edit_image_btn1" : "edit_image_btn"}`}
                                    id="edit_button"
                                    onClick={() => handleShowImage(user.profile_img ? user.profile_img : "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg")}
                                >
                                    <div style={{ margin: "auto" }}>
                                        <a href="javascript:void(0)" >
                                            <label htmlFor="profile_image">
                                                <img src="/images/profile/Edit.svg" alt="Edit Icon" />
                                            </label>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="edit_btn" onClick={() => setShowEditCoverImg(user?.cover_img)}>
                                <a href="javascript:void(0)">
                                    <label htmlFor="cover_image">
                                        <img src="/images/profile/Edit.svg" alt="Edit Icon" />
                                    </label>
                                </a>
                            </div>
                        </div>
                        {/* <div className="profilePic position-relative" style={{ border: "1px solid blue" }}>
                            <ProfileImage url={user?.profile_img} style={{ borderRadius: "80px" }} />
                            <div
                                className="edit_btnImg edit_btnImg-customMobile"
                                onClick={() => setShowEditProfileImg(user?.profile_img)}
                            >
                                <a href="javascript:void(0)">
                                    <label htmlFor="profile_image">
                                        <img src="/images/profile/Edit.svg" alt="Edit Icon" />
                                    </label>
                                </a>
                            </div>
                        </div> */}
                        {!user?.cover_img && (
                            <input
                                style={{ display: "none" }}
                                type="file"
                                name="cover_image"
                                id="cover_image"
                                accept="image/*"
                                onChange={(event) => {
                                    setShowEditCoverImg(event.currentTarget.files[0]);
                                    event.target.value = null;
                                }}
                            />
                        )}
                        {!user.profile_img && (
                            <input
                                style={{ display: "none" }}
                                type="file"
                                name="profile_image"
                                id="profile_image"
                                accept="image/*"
                                onChange={(event) => {
                                    setShowEditProfileImg(event.currentTarget.files[0]);
                                    event.target.value = null;
                                }}
                            />
                        )}
                    </div>
                    <div className="usercontentBox d-flex align-items-end justify-content-between">
                        <div className="user_data">
                            <div className="user_profileTxt user_profileTxt-custom-flex">
                                <h4 className="mb-1" title={user?.user_name}>
                                    {user?.user_name.length > 27 ? user?.user_name.slice(0, 27) + "..." : user?.user_name}{" "}
                                    {user.role.includes("userPaid") ? <img src="/images/icons/green-tick.svg" /> : ""}{" "}
                                </h4>
                                <p className="txtOne mb-0">
                                    {user?.first_name} {user?.last_name}
                                </p>
                                <p className="txtOne mb-0">
                                    {user?.title?.length > 400 ? user?.title?.slice(0, 400) + "..." : user?.title}
                                </p>
                                {user?.location && <p className="txtTwo mb-0">
                                    <img src="/images/profile/location.svg" alt="location-tag" />
                                    {user?.location}
                                </p>}
                            </div>
                            <div className="followers d-flex" style={{ color: "#06897E", fontWeight: "600" }}>
                                <div onClick={() => setShowUserList("follower")} >
                                    <span className="me-2">{user?.followers}</span><span>Followers</span>
                                </div>
                                <div onClick={() => setShowUserList("following")} className="ms-4">
                                    <span className="me-2">{user?.following}</span><span>Following</span>
                                </div>
                            </div>
                        </div>
                        <div className="userprof_btns userprof_btns_custom">
                            <div className="btn btnColor d-none d-md-block" onClick={handleCreatePostPopup}>
                                Create a post <img src="/images/profile/plus.svg" alt="create-post-icon" />
                            </div>
                            <div className="editComm_btn editComm_btnCustom" onClick={handleEditProfile}>
                                <img src="/images/profile/editIcon.svg" alt="edit-icon" /> Edit Profile
                            </div>
                        </div>
                    </div>
                    <div className="page_link ">
                        <ul className="nav nav-pills">
                            <li className="nav-item">
                                <div className={activeTab === "about" ? "nav-link active" : "nav-link"} onClick={() => {
                                    handleActiveTab("about");
                                }}>
                                    <span>About</span>
                                </div>
                            </li>
                            <li className="nav-item">
                                <div className={activeTab === "posts" ? "nav-link active" : "nav-link"} onClick={() => {
                                    handleActiveTab("posts");
                                }}>
                                    <span> Posts </span>
                                </div>
                            </li>
                            <li className="nav-item">
                                <div className={activeTab === "groups" ? "nav-link active" : "nav-link "} onClick={() => {
                                    handleActiveTab("groups");
                                }}>
                                    <span> Groups </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="tab-content mt-2">
                    <div className={activeTab === "about" ? "tab-pane active" : "tab-pane"} id="about">
                        <div className="row g-2">
                            <div className="col-sm-12 col-md-7 col-lg-8">
                                <div className="card border-0">
                                    <div className="card-body">
                                        {showEditAbout === true ?
                                            (
                                                <div style={{ paddingRight: "24px", paddingLeft: "24px" }}>
                                                    <div>
                                                        <h6 className="card-section-title">
                                                            <span className="me-2">Edit About</span>
                                                            <span style={{ fontWeight: "400" }}>(This information will be publicly displayed and visible for al users)</span>
                                                        </h6>
                                                    </div>
                                                    <EditAbout onClose={() => setShowEditAbout(false)} />
                                                </div>
                                            ) : (
                                                <div style={{ paddingLeft: "24px", paddingRight: "24px" }}>
                                                    <h6 className="card-section-title">About</h6>
                                                    <div className="row about_profile">
                                                        {user?.bio && <div className="col-12 mb-3">
                                                            <div className="abt-title">Bio</div>
                                                            <p dangerouslySetInnerHTML={{ __html: user.bio }} />
                                                        </div>}
                                                        {user?.investmentInterests?.length > 0 && <div className="col-12 mb-4">
                                                            <div className="abt-title">Personal Development Interests</div>
                                                            <div className="investment-keywords">
                                                                {user?.investmentInterests && user?.investmentInterests.map((item, idx) => {
                                                                    return (
                                                                        <div className="keyword">
                                                                            {item}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>}
                                                        {user?.websiteUrl && <div className="col-12 mb-4">
                                                            <img src="/images/icons/globe.svg" alt="globe" className="me-2" />
                                                            <span dangerouslySetInnerHTML={{ __html: user.websiteUrl }} />
                                                        </div>}
                                                        <div className="col-12 text-center">
                                                            <div className="editComm_btn editComm_btnCustom" onClick={handleEditAbout}>
                                                                <img src="/images/profile/editIcon.svg" alt="edit-icon" />
                                                                <span className="edit_btn_gap">Edit About</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-5 col-lg-4">
                                <div className="card border-0">
                                    <div className="card-body" id="card_body" >
                                        <div className="suggested-header">
                                            <h6 className="card-title">Suggested for you</h6>
                                            <div className="see-all-link" onClick={() => setShowSuggestedProfiles(!showSuggestedProfiles)}>See All</div>
                                        </div>
                                        <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                                            {
                                                suggestedUsers && suggestedUsers?.map((suggestedUser, index) => {
                                                    const privateUser = suggestedUser?.setting?.private ? suggestedUser?.setting?.private : false;
                                                    if (index < 5) {
                                                        return (
                                                            <div key={"abt-sgu-" + index} className="pfrx-sgx-bx">
                                                                <div onClick={() => navigate("/userprofile/" + suggestedUser._id)}>
                                                                    <ProfileImage url={suggestedUser.profile_img} style={{ borderRadius: "50%", width: "48px", height: "48px" }} />
                                                                </div>
                                                                <div className="ms-3">
                                                                    <NavLink to={"/userprofile/" + suggestedUser._id} style={{ color: "#000000", fontSize: "1.0rem", fontWeight: "600" }}>
                                                                        {suggestedUser?.user_name.length > 27 ? suggestedUser?.user_name.slice(0, 27) + "..." : suggestedUser?.user_name}
                                                                    </NavLink>
                                                                    <div className="suggestion_title">{suggestedUser?.title !== undefined ? suggestedUser?.title.length > 27 ? suggestedUser?.title.slice(0, 27) + "..." : suggestedUser?.title : "Vestorgrow User"}</div>
                                                                    <div>
                                                                        <button
                                                                            className={`btn btnColor1 btnFollow`}
                                                                            onClick={() => handleFollowReq(suggestedUser._id, suggestedUser.user_name, privateUser)}
                                                                        >
                                                                            {privateUser ? "Request" : "Follow"}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    } else {
                                                        return <></>
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={activeTab === "posts" ? "tab-pane active" : "tab-pane"} id="posts">
                        <div className="row mt-3">
                            {
                                postList.length > 0 && postList.map((item, idx) => {

                                    const postReactions = item.postReactions ?? [];
                                    const youtubeUrl = helperServ.extractYouTubeURL(item?.message);

                                    return (
                                        <div key={idx} className="col-sm-4 col-lg-4 dynamic-width-custom mb-2 profile_post_padding">
                                            <div className="bgWhiteCard feedBox post_box" style={{ maxHeight: "99.5%", minHeight: "99.5%" }}>
                                                <div className="feedBoxInner">
                                                    <div className="feedBoxHead d-flex align-items-center">
                                                        <div className="feedBoxHeadLeft">
                                                            <div className="feedBoxHeadName">
                                                                <h4 dangerouslySetInnerHTML={{ __html: item?.message }} />
                                                                <p>
                                                                    <span>{moment(item.createdAt).format("DD MMM YYYY")}</span>
                                                                    <i className="fa fa-circle" aria-hidden="true" />
                                                                    <span>{item?.shareType}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="feedBoxHeadRight ms-auto">
                                                            <div className="feedBoxHeadDropDown">
                                                                <Link className="nav-link" data-bs-toggle="dropdown">
                                                                    <img src="/images/icons/dots.svg" alt="dots" className="img-fluid" />
                                                                </Link>
                                                                <ul className="dropdown-menu">
                                                                    <li>
                                                                        <Link className="dropdown-item" href="#">
                                                                            <img src="/images/icons/hide-icon.svg" alt="hide-icon" className="img-fluid me-1" />{" "}
                                                                            Hide Post
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <Link className="dropdown-item" href="#">
                                                                            <img
                                                                                src="/images/icons/report-post.svg"
                                                                                alt="report-post"
                                                                                className="img-fluid me-1"
                                                                            />{" "}
                                                                            Report Post
                                                                        </Link>
                                                                    </li>
                                                                    {item.createdBy._id === user._id && (
                                                                        <li>
                                                                            <Link
                                                                                onClick={() => deletePost(item._id)}
                                                                                className="dropdown-item"
                                                                            >
                                                                                <img src="/images/icons/delete.svg" alt="hide-icon" className="img-fluid me-1" />
                                                                                Delete
                                                                            </Link>
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {item?.mediaFiles.length > 0 ? (
                                                        <div
                                                            className="postImg mx_minus postImg-custom-profile"
                                                            onClick={() => handlePostPopup(item?._id, idx)}
                                                        >
                                                            {
                                                                isImage.includes(item?.mediaFiles[0].split(".").pop()) ? (
                                                                    <img
                                                                        src={item?.mediaFiles[0]}
                                                                        alt="lesson-banner-img"
                                                                        className="img-fluid postImg-custom-profile-image"
                                                                    />
                                                                ) : (
                                                                    <div className="position-relative video-thumbnailCustom-profile">
                                                                        <VideoImageThumbnail videoUrl={item?.mediaFiles[0]} alt="video" />
                                                                        <div className="overLay">
                                                                            <span className="overLayCustom">
                                                                                <i className="fa-solid fa-film"></i>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    ) : (
                                                        <div className="postImg mx_minus postImg-custom-profile">
                                                            {
                                                                youtubeUrl ? (
                                                                    <div style={{ width: "100%" }}>
                                                                        <Playeryoutube url={youtubeUrl} height={"260px"} corners={false} />
                                                                    </div>
                                                                ) : (
                                                                    <div className="profile-post-image-text" style={{ padding: '25px' }}>
                                                                        <div className="mb-0 profile-post-image-inner-text" dangerouslySetInnerHTML={{ __html: item.message.length > 320 ? item.message.slice(0, 320) + "..." : item.message }} />
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                    <div className="postTxt" onClick={() => handlePostPopup(item._id, idx)}>
                                                        {item?.message && <p className="mb-0 postcontent postcontent-custom" dangerouslySetInnerHTML={{ __html: item.message.slice(0, 85) }} />}
                                                        {!item?.message && <p><br /></p>}
                                                    </div>
                                                    <div className="likeShareIconCounter">
                                                        <ul className="nav">
                                                            <li className="nav-item" style={{ cursor: "pointer" }}>
                                                                {
                                                                    item.likeCount > 0 ? (
                                                                        <div className={"d-flex align-items-center"} onClick={() => setShowUserLikedPost(item._id)}>
                                                                            <div className="floating-reactions-container">
                                                                                {
                                                                                    postReactions.includes("like") && <span><img src="/images/icons/filled-thumbs-up.svg" alt="filled-thumbs-up" /></span>
                                                                                }
                                                                                {
                                                                                    postReactions.includes("love") && <span><img src="/images/icons/filled-heart.svg" alt="filled-heart" /></span>
                                                                                }
                                                                                {
                                                                                    postReactions.includes("insight") && <span><img src="/images/icons/filled-insightfull.svg" alt="filled-insightfull" /></span>
                                                                                }
                                                                            </div>
                                                                            <span className="mx-2">{countFormator(item?.likeCount)}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <Link
                                                                            className="nav-link feedUnlike feedCustom"
                                                                            onClick={() => setShowUserLikedPost(item._id)}
                                                                        >
                                                                            <img src="/images/icons/like.svg" alt="like" className="img-fluid" />
                                                                            <span className="mx-2">{item?.likeCount}</span>
                                                                        </Link>
                                                                    )
                                                                }
                                                            </li>
                                                            <li className="nav-item">
                                                                <Link className="nav-link" onClick={() => handlePostPopup(item._id, idx)}>
                                                                    <img src="/images/icons/comment.svg" alt="comment" className="img-fluid" />
                                                                    <span className="mx-2">{item?.commentCount}</span>
                                                                </Link>
                                                            </li>
                                                            <li className="nav-item">
                                                                <Link
                                                                    className="nav-link feedShare feedCustom"
                                                                    onClick={(e) => handleShowShared(item._id)}
                                                                >
                                                                    <img src="/images/icons/share.svg" alt="share" className="img-fluid" />
                                                                    <span className="mx-2">{item?.shareCount}</span>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className={activeTab === "groups" ? "tab-pane active" : "tab-pane"} id="groups">
                        <div className="row g-2">
                            <div className="col-sm-12 col-md-8 col-lg-8" >
                                <div className="card border-0" style={{ paddingLeft: "24px", paddingRight: "24px" }}>
                                    <div className="card-body">
                                        <h6 className="card-section-title">Groups</h6>
                                        <div>
                                            <MyGroupList
                                                userData={user}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4">
                                <div className="card border-0">
                                    <div className="card-body">
                                        <div className="suggested-header">
                                            <h6 className="card-title">Suggested for you</h6>
                                            <div className="see-all-link" onClick={() => setShowSuggestedProfiles(!showSuggestedProfiles)}>See All</div>
                                        </div>
                                        <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                                            {
                                                suggestedUsers && suggestedUsers.map((suggestedUser, index) => {
                                                    const privateUser = suggestedUser?.setting?.private ? suggestedUser?.setting?.private : false;
                                                    if (index < 5) {
                                                        return (
                                                            <div key={"abt-sgu-" + index} className="pfrx-sgx-bx">
                                                                <ProfileImage url={suggestedUser.profile_img} style={{ borderRadius: "50%", width: "48px", height: "48px" }} />
                                                                <div className="ms-3">
                                                                    <div style={{ fontWeight: "600" }}>
                                                                        <NavLink to={"/userprofile/" + suggestedUser._id} style={{ color: "#000000", fontSize: "1.0rem", fontWeight: "600" }}>
                                                                            {suggestedUser?.user_name.length > 27 ? suggestedUser?.user_name.slice(0, 27) + "..." : suggestedUser?.user_name}
                                                                        </NavLink>
                                                                    </div>
                                                                    {/* <div >{suggestedUser?.first_name || " "} {suggestedUser?.last_name || " "}</div> */}
                                                                    <div className="suggestion_title">{suggestedUser?.title !== undefined ? suggestedUser?.title.length > 27 ? suggestedUser?.title.slice(0, 27) + "..." : suggestedUser?.title : "Vestorgrow User"}</div>
                                                                    <div>
                                                                        <button
                                                                            className={`btn btnColor1 btnFollow`}
                                                                            onClick={() => handleFollowReq(suggestedUser._id, suggestedUser.user_name, privateUser)}
                                                                        >
                                                                            {privateUser ? "Request" : "Follow"}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    } else {
                                                        return <></>
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditProfile && <EditProfile onClose={handleEditProfile} />}

            {showUserList && (
                <FollowerFollowingList type={showUserList} onClose={() => setShowUserList(null)} />
            )}

            {showEditCoverImg && (
                <EditCoverImage
                    file={showEditCoverImg}
                    onClose={() => setShowEditCoverImg(null)}
                    onComplete={handleCoverImage}
                />
            )}
            {showEditProfileImg && (
                <EditProfileImage
                    file={showEditProfileImg}
                    onClose={() => setShowEditProfileImg(null)}
                    onComplete={handleProfileImage}
                />
            )}

            {createPostPopup && (
                <CreatePost
                    onClose={handleCreatePostPopup}
                    onSuccess={() => {
                        handleCreatePostPopup();
                        handlePostSuccessPopup();
                        getPostList();
                        setShowLoadingBar(false);
                    }}
                    onFail={() => {
                        handleCreatePostPopup();
                        handlePostFailPopup();
                        setShowLoadingBar(false);
                    }}
                    onShowLoadingBar={() => {
                        setShowLoadingBar(true);
                    }}
                />
            )}

            {showPostId && (
                <DiscoverPost
                    onClose={onClose}
                    postId={showPostId}
                    slideLeft={postIdx > 0}
                    slideRight={postIdx < postList.length - 1}
                    changePostIdx={changePostIdx}
                />
            )}

            {showUserSharedPost && (
                <UserSharedPost
                    onClose={() => {
                        setShowUserSharedPost(false);
                    }}
                    postId={showUserSharedPost}
                />
            )}

            {showUserLikedPost && (
                <UserLikedPost
                    onClose={() => {
                        setShowUserLikedPost(false);
                    }}
                    postId={showUserLikedPost}
                />
            )}

            {
                showSuggestedProfiles && (
                    <AllSuggestions showModal={true} closeSuggestionModal={closeSuggestionModal} />
                )
            }
        </div>
    )
}

export default Profile