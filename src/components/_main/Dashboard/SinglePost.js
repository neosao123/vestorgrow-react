import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import Linkify from "react-linkify";
import { SecureLink } from "react-secure-link";

import PostService from '../../../services/postService';
import UserFollowerService from '../../../services/userFollowerService';
import UserBlockedServ from "../../../services/userBlockedService";
import ReportService from '../../../services/reportService';
import HelperFunctions from '../../../services/helperFunctions';
import GlobalContext from '../../../context/GlobalContext';

import FBReactions from "../../FBReactions";
import OriginalPostCreator from "../../OriginalPostCreator";
import { NavLink } from "react-router-dom";
import ProfileImage from "../../../shared/ProfileImage";
import VideoImageThumbnail from "react-video-thumbnail-image";
import Playeryoutube from "../../Playeryoutube";
import Comment from "../../../shared/Comment";

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];



const SinglePost = ({ ...props }) => {
    const { item, idx } = props;

    const postServ = new PostService();
    const followerServ = new UserFollowerService();
    const blockedServ = new UserBlockedServ();
    const reportServ = new ReportService();
    const helperServ = new HelperFunctions();

    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;

    const [createPostPopup, setCreatePostPopup] = globalCtx.createPostPopup;
    const [postSuccessPopup, setPostSuccessPopup] = globalCtx.postSuccessPopup;
    const [postFailPopup, setPostFailPopup] = globalCtx.postFailPopup;
    const [showCommentPostList, setShowCommentPostList] = globalCtx.showCommentPostList;
    const [showSharePost, setShowSharePost] = useState(false);
    const [dataForSharePost, setDataForSharePost] = useState(null);
    const [postList, setPostList] = useState([]);
    const [showMoreList, setShowMoreList] = useState([]);
    const [showShareTo, setShowShareTo] = useState(false);
    const [imageIdx, setImageIdx] = useState(0);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [showUnfollowPopup, setShowUnfollowPopup] = useState(false);
    const [showUserLikedPost, setShowUserLikedPost] = useState(false);
    const [showUserSharedPost, setShowUserSharedPost] = useState(false);
    const [unfollowUserData, setUnfollowUserData] = useState(null);
    const [showReportPopup, setShowReportPopup] = useState(false);
    const [showLoadingBar, setShowLoadingBar] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [showOtherPostSharedPopup, setShowOtherPostSharedPopup] = useState(false);
    const [showOtherPostFailedPopup, setShowOtherPostFailedPopup] = useState(false);
    const [postCount, setPostCount] = useState(0);


    let date = new Date();
    const originalPostId = item.originalPostId ?? null;
    item.duration = moment.duration(moment(date).diff(moment(item.createdAt)));
    let postReactions = item.postReactions ?? [];
    const profileImage = item.createdBy?.profile_img !== "" ? item.createdBy.profile_img : "/images/profile/default-profile.png";
    const youtubeURL = helperServ.extractYouTubeURL(item.message);

    let twitterurl = "http://twitter.com/share?text=vestorgrow home page&url=";
    let facebookurl = "https://www.facebook.com/sharer/sharer.php?t=vestorgrow home page&u=";
    let mailto = `mailto:${user?.email}?subject=Vestorgrow!!!&body=`;

    const options = {
        formatHref: {
            mention: (href) => process.env.REACT_APP_API_BASEURL + "/userprofile/profiles" + href,
        },
    };

    const hidePost = async (postId) => {
        try {
            let resp = await postServ.hidePost(postId);
            if (resp.data) {
                // loading = false;
                // setTimeout(() => {
                //     getPostList();
                // }, 1000);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deletePost = async (postId) => {
        try {
            let resp = await postServ.deletePost(postId);
            if (resp.message) {
                //setSearch({ ...search, start: 0 });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleSharePost = async (postIdx, shareType) => {
        let post = postList[postIdx];
        if (!post.originalPostId) {
            post.originalPostId = post._id;
            post.parentPostId = post._id;
        } else {
            post.parentPostId = post._id;
        }
        post.shareType = shareType;
        if (shareType === "Selected") {
            setDataForSharePost(post);
            setShowSharePost(true);
        } else {
            try {
                let resp = await postServ.sharePost(post);
                if (resp.data) {
                    getPostList();
                    setShowOtherPostSharedPopup(!showOtherPostSharedPopup);
                } else {
                    setShowOtherPostFailedPopup(!showOtherPostFailedPopup);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleShowComment = (id) => {
        if (showCommentPostList.includes(id)) {
            setShowCommentPostList(showCommentPostList.filter((i) => i !== id));
        } else {
            setShowCommentPostList([...showCommentPostList, id]);
        }
    };

    const handleUnFollowRequest = async (id, userName) => {
        setUnfollowUserData({ id: id, userName: userName });
        setShowUnfollowPopup(true);
    };

    const handleReportRequest = async (postId) => {
        let obj = {
            postId: postId,
            userId: user._id,
        };
        setReportData(obj);
        setShowReportPopup(true);
    };

    document.body.addEventListener("click", () => setShowShareTo(false), true);

    const getPostList = () => {

    }

    return (
        <div className="bgWhiteCard feedBox" key={idx}>
            <div className="feedBoxInner">
                <OriginalPostCreator originalPostData={item.originalPostId} createdByUser={item.createdBy} createdAt={item.createdAt} />
                <div className="feedBoxHead d-flex align-items-center">
                    <div className="feedBoxHeadLeft">
                        <div className="feedBoxprofImg">
                            <NavLink to={(item.createdBy !== null) ? "/userprofile/" + item.createdBy?._id : ""}>
                                <ProfileImage url={profileImage} style={{ borderRadius: "30px" }} />
                            </NavLink>
                        </div>
                        <div className="feedBoxHeadName">
                            <NavLink to={(item.createdBy !== null) ? "/userprofile/" + item.createdBy?._id : ""}>
                                <h4 className="username-title-custom" title={item?.createdBy?.user_name}>
                                    {
                                        item?.createdBy?.user_name.length > 25
                                            ? item?.createdBy?.user_name.slice(0, 25) + "..."
                                            : item?.createdBy?.user_name}
                                    {
                                        item.createdBy?.role.includes("userPaid") ? (
                                            <img src="/images/icons/green-tick.svg" alt="green-tick" className="mx-1" />
                                        ) : (
                                            <span className="mx-1"></span>
                                        )
                                    }
                                    {
                                        (originalPostId !== null) && (
                                            <span className="repostedCustom">Reposted</span>
                                        )
                                    }
                                </h4>
                            </NavLink>
                            <p>
                                <span>{moment(item?.createdAt).fromNow()}</span>
                                <i className="fa fa-circle" aria-hidden="true" />
                                <span>{item?.shareType}</span>
                            </p>
                        </div>
                    </div>
                    <div className="feedBoxHeadRight ms-auto">
                        <div className="feedBoxHeadDropDown">
                        </div>
                    </div>
                </div>
                {item.mediaFiles.length === 1 && (
                    <div
                        className="postImg postImgSingle"
                        onClick={() => {
                            setMediaFiles([...item.mediaFiles]);
                            setImageIdx(0);
                        }}
                    >
                        {isImage.includes(item.mediaFiles[0].split(".").pop()) ? (
                            <div className="position-relative">
                                <img src={item.mediaFiles[0]} alt="post-img" className="img-fluid" />
                                <div className="overLay overLayCustomBody">
                                    <span className="overLayCustom">
                                        <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="position-relative video-thumbnailCustom">
                                <VideoImageThumbnail videoUrl={item.mediaFiles[0]} alt="video" />
                                <div className="overLay">
                                    <span className="overLayCustom">
                                        <i className="fa-solid fa-film"></i>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {item.mediaFiles.length > 1 && (
                    <div className="multiplePost d-flex multiplePostimg-custom">
                        <div
                            className="multiplePostLeft"
                            onClick={() => {
                                setMediaFiles([...item.mediaFiles]);
                                setImageIdx(0);
                            }}
                        >
                            {isImage.includes(item.mediaFiles[0].split(".").pop()) ? (
                                <div className="position-relative h-100">
                                    <img src={item.mediaFiles[0]} alt="post-img" className="img-fluid" />
                                    <div className="overLay overLayCustomBody">
                                        <span className="overLayCustom">
                                            <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="position-relative">
                                    <VideoImageThumbnail
                                        className="customVideoImage276"
                                        videoUrl={item.mediaFiles[0]}
                                        alt="video"
                                    />
                                    <div className="overLay">
                                        <span className="overLayCustom">
                                            <i className="fa-solid fa-film"></i>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="multiplePostRight d-flex flex-column">
                            {item.mediaFiles.length > 2 ? (
                                <>
                                    <div
                                        className="multiplePostimg multiplePostimg-custom"
                                        onClick={() => {
                                            setMediaFiles([...item.mediaFiles]);
                                            setImageIdx(1);
                                        }}
                                    >
                                        {isImage.includes(item.mediaFiles[1].split(".").pop()) ? (
                                            <div className="position-relative h-100">
                                                <img src={item.mediaFiles[1]} alt="post-img" className="img-fluid" />
                                                <div className="overLay overLayCustomBody">
                                                    <span className="overLayCustom">
                                                        <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="position-relative">
                                                <VideoImageThumbnail
                                                    className="customVideoImage133"
                                                    videoUrl={item.mediaFiles[1]}
                                                    alt="video"
                                                />
                                                <div className="overLay">
                                                    <span className="overLayCustom">
                                                        <i className="fa-solid fa-film"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className="multiplePostimg multiplePostimg-custom"
                                        onClick={() => {
                                            setMediaFiles([...item.mediaFiles]);
                                            setImageIdx(2);
                                        }}
                                    >
                                        <NavLink>
                                            {isImage.includes(item.mediaFiles[2].split(".").pop()) ? (
                                                <img
                                                    src={item.mediaFiles[2]}
                                                    alt="post-img"
                                                    className="img-fluid customVideoImage133"
                                                />
                                            ) : (
                                                <div className="position-relative">
                                                    <VideoImageThumbnail
                                                        className="customVideoImage133"
                                                        videoUrl={item.mediaFiles[2]}
                                                        alt="video"
                                                    />
                                                    <div className="overLay">
                                                        <span className="overLayCustom">
                                                            <i className="fa-solid fa-film"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {item.mediaFiles.length > 3 && (
                                                <div className="overLay rounded-0">
                                                    <span>+{item.mediaFiles.length - 3}</span>
                                                </div>
                                            )}
                                        </NavLink>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        onClick={() => {
                                            setMediaFiles([...item.mediaFiles]);
                                            setImageIdx(1);
                                        }}
                                    >
                                        {isImage.includes(item.mediaFiles[1].split(".").pop()) ? (
                                            <div className="position-relative">
                                                <img
                                                    src={item.mediaFiles[1]}
                                                    alt="post-img"
                                                    className="img-fluid customVideoImage276"
                                                />
                                                <div className="overLay overLayCustomBody">
                                                    <span className="overLayCustom">
                                                        <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="position-relative">
                                                <VideoImageThumbnail
                                                    className="customVideoImage276"
                                                    videoUrl={item.mediaFiles[1]}
                                                    alt="video"
                                                />
                                                <div className="overLay">
                                                    <span className="overLayCustom">
                                                        <i className="fa-solid fa-film"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                <div className={`postTxt `}>
                    {item?.message.length > 500 ? (
                        !showMoreList.includes(item._id) ? (
                            <Linkify
                                options={options}
                                componentDecorator={(decoratedHref, decoratedText, key) => (
                                    <SecureLink href={decoratedHref} key={key}>
                                        {decoratedText}
                                    </SecureLink>
                                )}
                            >
                                <div className="mb-0 whiteSpace p-aligment-wrap">
                                    <div dangerouslySetInnerHTML={{ __html: item.message.slice(0, 500) + "... " }} />
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => setShowMoreList([...showMoreList, item._id])}
                                    >
                                        Show More
                                    </a>
                                </div>
                            </Linkify>
                        ) : (
                            <Linkify
                                options={options}
                                componentDecorator={(decoratedHref, decoratedText, key) => (
                                    <SecureLink href={decoratedHref} key={key}>
                                        {decoratedText}
                                    </SecureLink>
                                )}
                            >
                                <div className="mb-0 whiteSpace p-aligment-wrap">
                                    <div dangerouslySetInnerHTML={{ __html: item.message }} />
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => setShowMoreList(showMoreList.filter((i) => i !== item._id))}
                                    >
                                        Show Less
                                    </a>
                                </div>
                            </Linkify>
                        )
                    ) : (
                        <Linkify
                            options={options}
                            componentDecorator={(decoratedHref, decoratedText, key) => (
                                <SecureLink href={decoratedHref} key={key}>
                                    {decoratedText}
                                </SecureLink>
                            )}
                        >
                            {
                                (helperServ.matchYoutubeUrl(item.message)) &&
                                <div className="mb-0 whiteSpace p-aligment-wrap" dangerouslySetInnerHTML={{ __html: item.message }} />
                            }
                        </Linkify>
                    )}
                    <div className="col-12 text-center">
                        {
                            youtubeURL ? <Playeryoutube url={youtubeURL} corners={true} /> : <></>
                        }
                    </div>
                </div>
                <div className="likeShareIconCounter">
                    <ul className="nav nav-custom-like-count">
                        <li className="nav-item">
                            {item.likeCount > 0 ? (
                                <div className={"d-flex align-items-center"} onClick={() => setShowUserLikedPost(item?._id)}>
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
                                    <span className="mx-2">{helperServ.countFormator(item?.likeCount)}</span>
                                </div>
                            ) : (
                                <NavLink
                                    className="nav-link"
                                >
                                    <img src="/images/icons/no-reaction.svg" alt="like" className="img-fluid" style={{ width: "24px", height: "24px", marginRight: "5px" }} />
                                    <span>{item?.likeCount}</span>
                                </NavLink>
                            )}
                        </li>
                        <li className="nav-item commentShareCustom">
                            <div>
                                <NavLink
                                    className="nav-link feedCustom"
                                    onClick={() => handleShowComment(item._id)}
                                >
                                    <span>{item?.commentCount}</span> comments
                                </NavLink>
                                <NavLink
                                    className="nav-link feedCustom"
                                    onClick={() => setShowUserSharedPost(item?._id)}
                                >
                                    <span>{item?.shareCount}</span> share
                                </NavLink>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="likeShareIcon likeShareIconCustom">
                    <ul className="nav">
                        <li className="nav-item">
                            {/* Reactions Component */}
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link feedComment feedCustom"
                                onClick={() => handleShowComment(item._id)}
                            >
                                <img src="/images/icons/comment.svg" alt="comment" className="img-fluid" />{" "}
                                <span>Comment</span>
                            </NavLink>
                        </li>

                    </ul>
                </div>
                <div className="position-relative-class homepage-commentSection">
                    {
                        /**
                            Commnet Component
                         */
                    }
                </div>
            </div>
        </div>
    )
}

export default SinglePost