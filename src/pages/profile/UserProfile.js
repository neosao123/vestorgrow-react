import React, { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate, NavLink } from "react-router-dom";
import ProfileImage from "../../shared/ProfileImage";
import PostService from "../../services/postService";
import DetailAbout from "../../popups/about/DetailAbout";
import SuggestedService from "../../services/suggestedService";
import UserService from "../../services/UserService";
import UserFollower from "../../services/userFollowerService";
import HelperFunctions from "../../services/helperFunctions";
import moment from "moment";
import VideoImageThumbnail from "react-video-thumbnail-image";
import Unfollow from "../../popups/unfollow/Unfollow";
import DiscoverPost from "../../popups/discovery/DiscoverPost";
import Report from "../../popups/report/Report";
import GroupList from "../../popups/groupChat/GroupList";
import FollowerFollowingOtherList from "../../popups/followerFollowingList/FollowerFollowingOtherList";
import Playeryoutube from "../../components/Playeryoutube";
import EnlargeImage from "../../popups/userprofile/EnlargeImage";
import UserLikedPost from "../../popups/post/UserLikedPost";
import "./userprofile.css";
import MyGroupList from "./MyGroupList";
import AllSuggestions from "./AllSuggestions";
import { toast } from 'react-toastify';

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];

const UserProfile = () => {
    const params = useParams();
    const navigate = useNavigate();

    const suggestedServ = new SuggestedService();
    const postServ = new PostService();
    const userServ = new UserService();
    const followerServ = new UserFollower();
    const helperServ = new HelperFunctions();

    const [user, setUser] = useState();
    const [postList, setPostList] = useState([]);
    const [firstRowList, setFirstRowList] = useState([]);
    const [secondRowList, setSecondRowList] = useState([]);
    const [thirdRowList, setThirdRowList] = useState([]);
    const [showAbout, setShowAbout] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showUserLikedPost, setShowUserLikedPost] = useState(false);
    const [showUnfollowPopup, setShowUnfollowPopup] = useState(false);
    const [unfollowUserData, setUnfollowUserData] = useState(null);
    const [showPostId, setShowPostId] = useState("");
    const [postIdx, setPostIdx] = useState();
    const [partition, setPartition] = useState(1);
    const [showReportPopup, setShowReportPopup] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [showGroup, setShowGroup] = useState(false);
    const [showUserList, setShowUserList] = useState(null);
    const [showEnlarge, setShowEnlarge] = useState(false);
    const [privateAccount, setPrivateAccount] = useState(0);
    const [sessionUserId, setSessionUserId] = useState("");
    const [activeTab, setActiveTab] = useState("about");
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [showSuggestedProfiles, setShowSuggestedProfiles] = useState(false);
    const getUser = async (id) => {
        let currUser = JSON.parse(localStorage.getItem("user"));
        setSessionUserId(currUser._id);

        if (currUser._id === id) {
            navigate("/profile");
        }
        try {
            let resp = await userServ.getUser(id);
            if (resp.data) {
                setUser(resp.data);
                const profileSettings = resp.data.setting;
                if (profileSettings === true) {
                    setPrivateAccount(1);
                }
            }
        } catch (err) {
            console.log(err);
        }
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

    const handleFollowReq = async (id, user_name, isRequested) => {
        try {
            let resp = await followerServ.sendFollowReq({ followingId: id });
            if (resp.data) {
                getSuggestedUsers();
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

    const getFollowingStatus = async (id) => {
        try {
            let resp = await followerServ.isFollowing({ followingId: id });
            // if (resp.data) {
            setIsFollowing(resp.data);
            // }
        } catch (err) {
            console.log(err);
        }
    };

    const getPostList = async (id) => {
        const obj = { filter: {} };
        obj.filter.is_active = true;
        obj.filter.createdBy = id;
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

    const handleFollowRequest = async () => {
        try {
            let resp = await followerServ.sendFollowReq({ followingId: params.id });
            if (resp.data) {
                getUser(params.id);
                getFollowingStatus(params.id);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnFollowRequest = async () => {
        setUnfollowUserData({ id: params.id, userName: user.user_name });
        setShowUnfollowPopup(true);
    };

    const handleRejectRequest = async () => {
        try {
            let curUser = JSON.parse(localStorage.getItem("user"));

            let res = await followerServ.deleteFollowReq({
                userId: curUser._id,
                followingId: params.id,
            });

            if (res.message === "Request Deleted successfully") {
                setIsFollowing(false);
            }
        } catch (error) {
            console.log(error);
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

    const handleReportRequest = async (postId) => {
        let obj = {
            postId: postId,
            userId: user._id,
        };
        setReportData(obj);
        setShowReportPopup(true);
    };

    const onClose = () => {
        setShowPostId("");
        document.body.style.overflow = "";
        document.body.style.marginRight = "";
    };

    //check item message is video url...
    const matchYoutubeUrl = (url) => {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? true : false;
    }

    const handleShowEnlarge = () => {
        setShowEnlarge(!showEnlarge);
    };

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

    const handleActiveTab = (activetab) => {
        setTimeout(async () => {
            setActiveTab(activetab);
            if (activeTab !== "posts") {
                getSuggestedUsers();
            }
        }, 200);
    }

    const closeSuggestionModal = () => {
        setShowSuggestedProfiles(!showSuggestedProfiles);
    }

    useEffect(() => {
        getUser(params.id);
        getPostList(params.id);
        getFollowingStatus(params.id);
        getSuggestedUsers();
    }, [params.id]);

    return (
        <div>
            <div className="socialContant profileContent main_container">
                <div className="myProfile_sec">
                    <div className="about_profile">
                        <div
                            className="profileCoverPic mx-0"
                            style={
                                user?.cover_img
                                    ? { backgroundImage: `url(${user?.cover_img})` }
                                    : { backgroundImage: "url(/images/profile/image_cover_profile.png)" }
                            }
                        >
                        </div>
                    </div>
                    <div className="profilePic position-relative">
                        <div className="prf-img-container new_profile_pic" style={{ backgroundColor: "gray", borderRadius: "50%", marginLeft: "20px" }}>
                            <img className="prf-img" src={user?.profile_img !== "" ? user?.profile_img : "/images/profile/default-profile.png"} alt={user?.user_name} width={"90%"} height={"90%"} />
                            <div className="middle" onClick={handleShowEnlarge}>
                                <div className="text"><i className="fa fa-external-link fa-2x text-primary"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className="usercontentBox d-flex align-items-end justify-content-between mt-0">
                        <div className="user_data">
                            <div className="user_profileTxt user_profileTxt-custom-flex">
                                <h4 className="mb-1">
                                    {user?.user_name.length > 24 ? user?.user_name.slice(0, 27) + "..." : user?.user_name}
                                    {user?.role.includes("userPaid") ? <img src="/images/icons/green-tick.svg" alt="green-tick" /> : ""}
                                </h4>
                                <div>{user?.title !== undefined ? user?.title.length > 27 ? user?.title.slice(0, 27) + "..." : user?.title : "Vestorgrow User"}</div>
                                <p className="txtTwo mb-0">
                                    <img src="/images/profile/location.svg" alt="loaction-img" />
                                    {user?.location}
                                </p>
                            </div>
                            <div className=" followers">
                                <Link onClick={() => setShowUserList("follower")}>
                                    {user?.followers} Followers
                                </Link>
                                <Link onClick={() => setShowUserList("following")} className="ms-3">
                                    {user?.following} Following
                                </Link>
                            </div>
                        </div>
                        <div className="userprof_btns userprof_btns_custom">
                            {isFollowing === "following" ? (
                                <Link onClick={handleUnFollowRequest} style={{ border: "1px solid #00808b", padding: "5px 15px", borderRadius: "20px", color: "white", fontWeight: "600", backgroundColor: "#00808b" }}>
                                    Following
                                </Link>
                            ) : isFollowing === "requested" ? (
                                <Link style={{ border: "1px solid #00808b", padding: "5px 15px", borderRadius: "20px", color: "white", fontWeight: "600", backgroundColor: "#00808b" }} onClick={handleRejectRequest}>
                                    Requested
                                </Link>
                            ) : (
                                <Link onClick={handleFollowRequest} className="editComm_btn">
                                    Follow
                                </Link>
                            )}
                            <Link to={"/message/" + user?._id} className="editComm_btn">
                                Message
                            </Link>
                        </div>
                    </div>
                    <div className="page_link">
                        {(!user?.setting?.private || isFollowing === "following") && (
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
                        )}
                    </div>
                </div>
                <div className="tab-content mt-2">
                    <div className={activeTab === "about" ? "tab-pane active" : "tab-pane"} id="about">
                        <div className="row g-2">
                            <div className="col-sm-12 col-md-7 col-lg-8">
                                <div className="card border-0" style={{ border: "1px solid red" }}>
                                    <div className="card-body" style={{ marginLeft: "24px", marginRight: "24px" }}>
                                        <h6 className="card-section-title">About</h6>
                                        <div className="row about_profile">
                                            {user?.bio && <div className="col-12 mb-3">
                                                <div className="abt-title">Bio</div>
                                                <p dangerouslySetInnerHTML={{ __html: user?.bio }} />
                                            </div>}
                                            <div className="col-12 mb-4">
                                                {user?.investmentInterests.length > 0 && <div className="abt-title">Personal Development Interests</div>}
                                                <div className="keyWord mt-3 d-flex">
                                                    {
                                                        user?.investmentInterests && user?.investmentInterests.map((item, idx) => {
                                                            return (
                                                                <span className="keywordListItem">
                                                                    <p>{item}</p>
                                                                </span>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            {user?.websiteUrl && <div className="col-12 mb-4">
                                                <img src="/images/icons/globe.svg" alt="globe" className="me-2" />
                                                <span dangerouslySetInnerHTML={{ __html: user?.websiteUrl }} />
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-5 col-lg-4">
                                <div className="card border-0">
                                    <div className="card-body">
                                        <div className="suggested-header">
                                            <h6 className="card-title">Suggested for you</h6>
                                            <div className="see-all-link" onClick={() => setShowSuggestedProfiles(!showSuggestedProfiles)}>See All</div>
                                        </div>
                                        <div>
                                            {
                                                suggestedUsers && suggestedUsers.map((suggestedUser, index) => {
                                                    const privateUser = suggestedUser?.setting?.private ? suggestedUser?.setting?.private : false;
                                                    if (index < 5) {
                                                        return (
                                                            <div key={"abt-sgu-" + index} className="pfrx-sgx-bx" style={{ marginLeft: "20px", marginRight: "20px" }}>
                                                                <ProfileImage url={suggestedUser.profile_img} style={{ borderRadius: "50%", width: "48px", height: "48px" }} />
                                                                <div className="ms-3">
                                                                    <div style={{ fontWeight: "600" }}>
                                                                        <NavLink to={"/userprofile/" + suggestedUser._id} style={{ color: "#000000", fontSize: "1.0rem", fontWeight: "600" }}>
                                                                            {suggestedUser?.user_name.length > 27 ? suggestedUser?.user_name.slice(0, 27) + "..." : suggestedUser?.user_name}
                                                                        </NavLink>
                                                                    </div>
                                                                    {/* <div>{suggestedUser?.first_name || " "} {suggestedUser?.last_name || " "}</div> */}
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
                            {(!user?.setting?.private || isFollowing === "following") && (
                                postList &&
                                postList.map((item, idx) => {
                                    const postReactions = item.postReactions ?? [];
                                    const youtubeUrl = helperServ.extractYouTubeURL(item.message);
                                    return (
                                        <div className="col-sm-4 col-lg-4 dynamic-width-custom profile_post_padding">
                                            <div className="bgWhiteCard feedBox post_box" style={{ maxHeight: "97.5%", minHeight: "97.5%" }}>
                                                <div className="feedBoxInner">
                                                    <div className="feedBoxHead d-flex align-items-center">
                                                        <div className="feedBoxHeadLeft">
                                                            <div className="feedBoxHeadName">
                                                                <h4 dangerouslySetInnerHTML={{ __html: item.message }} />
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
                                                                        <Link
                                                                            onClick={() => handleReportRequest(item._id)}
                                                                            className="dropdown-item"
                                                                        >
                                                                            <img
                                                                                src="/images/icons/report-post.svg"
                                                                                alt="report-post"
                                                                                className="img-fluid me-1"
                                                                            />
                                                                            Report Post
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <Link className="dropdown-item" href="#">
                                                                            <img src="/images/icons/add-user.svg" alt="add-user" className="img-fluid me-1" />{" "}
                                                                            Unfollow
                                                                        </Link>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {item?.mediaFiles.length > 0 ? (
                                                        <div
                                                            className="postImg mx_minus postImg-custom-profile"
                                                            onClick={() => handlePostPopup(item._id, idx)}
                                                        >
                                                            {isImage.includes(item?.mediaFiles[0].split(".").pop()) ? (
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
                                                            )}
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
                                                        {!item?.message && <p className="mb-0 postcontent postcontent-custom"><br /></p>}
                                                    </div>
                                                    <div className="likeShareIconCounter">
                                                        <ul className="nav align-items-center">
                                                            <li className="nav-item">
                                                                {
                                                                    postReactions.length > 0 ? (
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
                                                                    <img src="/images/icons/comment.svg" alt="comment" className="img-fluid" />{" "}
                                                                    <span>{item?.commentCount}</span>
                                                                </Link>
                                                            </li>
                                                            <li className="nav-item">
                                                                <Link className="nav-link" href="#">
                                                                    <img src="/images/icons/share.svg" alt="share" className="img-fluid" />{" "}
                                                                    <span>{item?.shareCount}</span>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                    <div className={activeTab === "groups" ? "tab-pane active" : "tab-pane"} id="groups">
                        <div className="row g-2">
                            <div className="col-sm-12 col-md-7 col-lg-8">
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
                            <div className="col-sm-12 col-md-5 col-lg-4">
                                <div className="card border-0">
                                    <div className="card-body">
                                        <div className="suggested-header">
                                            <h6 className="card-title">Suggested for you</h6>
                                            <div className="see-all-link" onClick={() => setShowSuggestedProfiles(!showSuggestedProfiles)}>See All</div>
                                        </div>
                                        <div>
                                            {
                                                suggestedUsers && suggestedUsers.map((suggestedUser, index) => {
                                                    const privateUser = suggestedUser?.setting?.private ? suggestedUser?.setting?.private : false;
                                                    if (index < 5) {
                                                        return (
                                                            <div key={"abt-sgu-" + index} className="pfrx-sgx-bx" style={{ marginLeft: "20px", marginRight: "20px" }}>
                                                                <ProfileImage url={suggestedUser.profile_img} style={{ borderRadius: "50%", width: "48px", height: "48px" }} />
                                                                <div className="ms-3">
                                                                    <div style={{ fontWeight: "600" }}>
                                                                        <NavLink to={"/userprofile/" + suggestedUser._id} style={{ color: "#000000", fontSize: "1.0rem", fontWeight: "600" }}>
                                                                            {suggestedUser?.user_name.length > 27 ? suggestedUser?.user_name.slice(0, 27) + "..." : suggestedUser?.user_name}
                                                                        </NavLink>
                                                                    </div>
                                                                    {/* <div>{suggestedUser?.first_name || " "} {suggestedUser?.last_name || " "}</div> */}
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

            {
                showReportPopup && (
                    <Report
                        onClose={() => {
                            setReportData(null);
                            setShowReportPopup(false);
                        }}
                        object={reportData}
                    />
                )
            }

            {
                showUnfollowPopup && (
                    <Unfollow
                        onClose={() => {
                            setUnfollowUserData(null);
                            setShowUnfollowPopup(false);
                            getUser(params.id);
                            getFollowingStatus(params.id);
                        }}
                        userData={unfollowUserData}
                    />
                )
            }

            {
                showPostId && (
                    <DiscoverPost
                        onClose={onClose}
                        postId={showPostId}
                        slideLeft={postIdx > 0}
                        slideRight={postIdx < postList.length - 1}
                        changePostIdx={changePostIdx}
                    />
                )
            }

            {
                showUserList && !user?.setting?.private && (
                    <FollowerFollowingOtherList type={showUserList} onClose={() => setShowUserList(null)} dataId={params.id} />
                )
            }

            {
                showUserList && user?.setting?.private && isFollowing === "following" && (
                    <FollowerFollowingOtherList type={showUserList} onClose={() => setShowUserList(null)} dataId={params.id} />
                )
            }

            {
                showUserLikedPost && (
                    <UserLikedPost
                        onClose={() => {
                            setShowUserLikedPost(false);
                        }}
                        postId={showUserLikedPost}
                    />
                )
            }

            {
                showEnlarge && (
                    <EnlargeImage imgUrl={user?.profile_img} onClose={handleShowEnlarge} />
                )
            }

            {
                showSuggestedProfiles && (
                    <AllSuggestions showModal={true} closeSuggestionModal={closeSuggestionModal} />
                )
            }
        </div>
    )
}

export default UserProfile;