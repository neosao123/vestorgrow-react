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
import { NavLink, useNavigate } from "react-router-dom";
import ProfileImage from "../../../shared/ProfileImage";
import VideoImageThumbnail from "react-video-thumbnail-image";
import Playeryoutube from "../../Playeryoutube";
import Comment from "../../../shared/Comment";
import DiscoverService from "../../../services/discoverService";


const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];



const SinglePost = ({ ...props }) => {
    const { getPostList, item, index, idx, handleReportRequest, setShowSharePost, setSharePostId, handleSharePost } = props;

    const postServ = new PostService();
    const followerServ = new UserFollowerService();
    const blockedServ = new UserBlockedServ();
    const reportServ = new ReportService();
    const helperServ = new HelperFunctions();
    const discoverServ = new DiscoverService()

    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;

    const [showCommentPostList, setShowCommentPostList] = globalCtx.showCommentPostList;
    // const [showSharePost, setShowSharePost] = useState(false);
    const [dataForSharePost, setDataForSharePost] = useState(null);
    const [post, setPost] = useState(null);
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
    const [showComments, setShowComments] = useState(false)
    const [postCount, setPostCount] = useState(0);
    const [likes, setLikes] = useState(0)
    const [postReactions, setPostReaction] = useState([])
    const [id, setId] = useState("")
    const [originalPostId, setOriginalPostId] = useState(null)
    const [profileImage, setProgile_img] = useState("/images/profile/default-profile.png")
    const [youtubeURL, setIsYouTubeURL] = useState(false)
    const [reaction, setReaction] = useState(null)
    const [message, setMessage] = useState("")
    const [isHidden, setIsHidden] = useState(false)
    const [change, setChange] = useState(false)

    let date = new Date();

    let twitterurl = "http://twitter.com/share?text=vestorgrow home page&url=";
    let facebookurl = "https://www.facebook.com/sharer/sharer.php?t=vestorgrow home page&u=";
    let mailto = `mailto:${user?.email}?subject=Vestorgrow!!!&body=`;

    useEffect(() => {
        setId(item?._id)
        setLikes(item?.likeCount)
        setProgile_img(item?.createdBy.profile_img)
        setPostReaction(item?.postReactions)
        setOriginalPostId(item.originalPostId)
        setReaction(item.reaction)
        setIsYouTubeURL(helperServ.extractYouTubeURL(item.message));
        item.duration = moment.duration(moment(date).diff(moment(item.createdAt)))
        setMessage(item?.message)
        setIsHidden(item?.isHidden)
    }, [])

    // console.log("ishidden:", isHidden)

    const getPost = async () => {
        try {
            let resp = await discoverServ.getPost(item?._id);
            if (resp.data) {
                setId(resp?.data?._id)
                setLikes(resp?.data?.likeCount)
                setProgile_img(resp?.data?.createdBy.profile_img)
                setPostReaction(resp?.data?.postReactions)
                setOriginalPostId(resp?.data.originalPostId)
                setReaction(resp?.data?.reaction)
                item.duration = moment.duration(moment(date).diff(moment(resp?.data?.createdAt)));
                setIsYouTubeURL(helperServ.extractYouTubeURL(resp.data.message));
                setMessage(resp?.data?.message)
                setIsHidden(resp?.data?.isHidden)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const options = {
        formatHref: {
            mention: (href) => process.env.REACT_APP_API_BASEURL + "/userprofile/profiles" + href,
        },
    };

    const blockUser = async (userId) => {
        try {
            let obj = {
                blockedId: userId,
            };
            let resp = await blockedServ.sendBlockReq(obj);
            if (resp.data) {
                getPostList();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const hidePost = async (id) => {
        try {
            console.log(id)
            let resp = await postServ.hidePost(id);
            if (resp.data) {
                setTimeout(() => {
                    getPost();
                }, 1000);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const unhidePost = async (id) => {
        try {
            let resp = await postServ.unhidePost(id);
            if (resp.message) {
                getPostList();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deletePost = async (id) => {
        try {
            let resp = await postServ.deletePost(id);
            if (resp.message) {
                setTimeout(() => {
                    setChange(!change);
                    getPostList();
                }, 1000);
            }
        } catch (err) {
            console.log(err);
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

    const updatePostAfterReaction = (mode, postId, data, uniqueReactions) => {
        if (mode === "inc") {
            let _postList = postList;
            let _postListIdx = _postList.findIndex((i) => i._id === postId);
            _postList[_postListIdx].reaction = {
                _id: data._id,
                postId: data.postId,
                type: data.type
            };
            _postList[_postListIdx].isLiked = true;
            _postList[_postListIdx].postReactions = uniqueReactions;
            _postList[_postListIdx].likeCount = _postList[_postListIdx].likeCount + 1;
            setPostList([..._postList]);
        } else {
            let _postList = postList;
            let _postListIdx = _postList.findIndex((i) => i._id === postId);
            _postList[_postListIdx].reaction = null;
            _postList[_postListIdx].isLiked = false;
            _postList[_postListIdx].likeCount = _postList[_postListIdx].likeCount - 1;
            _postList[_postListIdx].postReactions = uniqueReactions;
            setPostList([..._postList]);
        }
    }

    document.body.addEventListener("click", () => setShowShareTo(false), true);

    return isHidden ? (
        <div className="bgDarkCard postHidden d-none d-md-block">
            <div className="postHiddenInner d-flex align-items-center">
                <div className="hideIconWhite">
                    <img
                        src="/images/icons/hide-icon-white.svg"
                        alt="hide-icon-white"
                        className="img-fluid"
                        onClick={() => unhidePost(id)}
                    />
                </div>
                <div className="postHiddenTxt">
                    <h5>Post Hidden</h5>
                    <p>You won't see this post on your timeline</p>
                </div>
                <div className="postHiddenClose">
                    <NavLink onClick={() => unhidePost(id)}>
                        <img src="/images/icons/close-white.svg" alt="close-white" className="img-fluid" />
                    </NavLink>
                </div>
            </div>
        </div>
    ) : (
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
                                        (item?.originalPostId) && (
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
                            <a className="nav-link" data-bs-toggle="dropdown">
                                <img src="/images/icons/dots.svg" alt="dots" className="img-fluid" />
                            </a>
                            <ul className="dropdown-menu opts">
                                <li>
                                    <div
                                        className="dropdown-item" onClick={() => setShowShareTo(item._id)}>
                                        <img src="/images/icons/share.svg" alt="hide-icon" className="img-fluid" /> Share to
                                    </div>
                                </li>
                                <li>
                                    <div className="dropdown-item"
                                        onClick={() =>
                                            navigator.clipboard.writeText(encodeURI(window.location.origin + "/post/" + item._id))
                                        }
                                    >
                                        <img src="/images/icons/link.svg" alt="hide-icon" className="img-fluid" /> Copy
                                        Link
                                    </div>
                                </li>
                                <li>
                                    <div onClick={() => hidePost(item._id)} className="dropdown-item"
                                    >
                                        <img src="/images/icons/hide-icon.svg" alt="hide-icon" className="img-fluid" />
                                        Hide Post
                                    </div>
                                </li>
                                {(item?.createdBy?._id === user._id) && (
                                    <li>
                                        <div onClick={() => deletePost(id)} className="dropdown-item">
                                            <img src="/images/icons/delete.svg" alt="hide-icon" className="img-fluid" />
                                            Delete
                                        </div>
                                    </li>
                                )}
                                {(item?.createdBy?._id !== user._id) && (
                                    <>
                                        <li>
                                            <div onClick={() => {

                                                console.log("id:", id);
                                                handleReportRequest(id)
                                            }} className="dropdown-item">
                                                <img
                                                    src="/images/icons/report-post.svg"
                                                    alt="report-post"
                                                    className="img-fluid"
                                                />
                                                Report Post
                                            </div>
                                        </li>
                                        <li>
                                            <div
                                                onClick={() => handleUnFollowRequest(item.createdBy._id, item.createdBy.user_name)}
                                                className="dropdown-item"
                                            >
                                                <img src="/images/icons/add-user.svg" alt="add-user" className="img-fluid" />
                                                Unfollow
                                            </div>
                                        </li>
                                        <li>
                                            <a
                                                href="javascript:void(0)"
                                                onClick={() => blockUser(item.createdBy._id)}
                                                className="dropdown-item"
                                            >
                                                <i className="fa-solid fa-user-lock me-1"></i> Block
                                            </a>
                                        </li>
                                    </>
                                )}
                            </ul>
                            <div className="dropdown">
                                <ul
                                    className={
                                        "dropdown-menu opts dropdown-menuMore-custom" + (showShareTo === item._id ? " show" : "")
                                    }
                                    aria-labelledby="dropdownMenuShareTo"
                                    id="dropdownMenuShareTo"
                                >
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="javascript:void(0);"
                                            onClick={() =>
                                                navigator.clipboard.writeText(window.location.origin + "/post/" + item._id)
                                            }
                                        >
                                            <img
                                                src="/images/icons/link-icon.svg"
                                                alt="share-to-friends"
                                                className="img-fluid me-1"
                                            />
                                            Copy Link
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item dropdown-item-fbCustom"
                                            href={facebookurl + encodeURI(window.location.origin + "/post/" + item._id)}
                                            target="_blank"
                                        >
                                            <img
                                                src="/images/icons/facebook.svg"
                                                alt="share-to-friends"
                                                className="img-fluid me-1 img-fluid-fbCustom"
                                            />
                                            Share to Facebook
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href={twitterurl + encodeURI(window.location.origin + "/post/" + item._id)}
                                            target="_blank"
                                        >
                                            <img
                                                src="/images/icons/twitter.svg"
                                                alt="share-to-friends"
                                                className="img-fluid me-1"
                                            />
                                            Share to Twitter
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href={mailto + encodeURI(window.location.origin + "/post/" + item._id)}
                                            target="_blank"
                                        >
                                            <img
                                                src="/images/icons/email.svg"
                                                alt="share-to-friends"
                                                className="img-fluid me-1"
                                            />
                                            Share via email
                                        </a>
                                    </li>
                                </ul>
                            </div>
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
                    {message.length > 500 ? (
                        !showMoreList.includes(id) ? (
                            <Linkify
                                options={options}
                                componentDecorator={(decoratedHref, decoratedText, key) => (
                                    <SecureLink href={decoratedHref} key={key}>
                                        {decoratedText}
                                    </SecureLink>
                                )}
                            >
                                <div className="mb-0 whiteSpace p-aligment-wrap">
                                    <div dangerouslySetInnerHTML={{ __html: message.slice(0, 500) + "... " }} />
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => setShowMoreList([...showMoreList, id])}
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
                                    <div dangerouslySetInnerHTML={{ __html: item?.message }} />
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => setShowMoreList(showMoreList.filter((i) => i !== id))}
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
                                item?.message &&
                                <div className="mb-0 whiteSpace p-aligment-wrap" dangerouslySetInnerHTML={{ __html: item?.message }} />
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
                            {likes > 0 ? (
                                <div className={"d-flex align-items-center"} onClick={() => setShowUserLikedPost(item?._id)}>
                                    <div className="floating-reactions-container">
                                        {
                                            postReactions?.includes("like") && <span><img src="/images/icons/filled-thumbs-up.svg" alt="filled-thumbs-up" /></span>
                                        }
                                        {
                                            postReactions?.includes("love") && <span><img src="/images/icons/filled-heart.svg" alt="filled-heart" /></span>
                                        }
                                        {
                                            postReactions?.includes("insight") && <span><img src="/images/icons/filled-insightfull.svg" alt="filled-insightfull" /></span>
                                        }
                                    </div>
                                    <span className="mx-2">{likes}</span>
                                </div>
                            ) : (
                                <NavLink
                                    className="nav-link"
                                >
                                    <img src="/images/icons/no-reaction.svg" alt="like" className="img-fluid" style={{ width: "24px", height: "24px", marginRight: "5px" }} />
                                    <span>{likes}</span>
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
                            {
                                <FBReactions postId={id} postReaction={reaction} getPost={getPost} />
                            }
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
                        <li className="nav-item">
                            {/* <ShareComp item={item}/> */}
                            <div className="commonDropdown dropdown">
                                <a
                                    href="javascript:void(0)"
                                    className="nav-link feedShare feedCustom"
                                    data-bs-toggle="dropdown"
                                >
                                    <img src="/images/icons/share.svg" alt="share" className="img-fluid" /> <span>Share</span>
                                </a>
                                <ul className="dropdown-menu">
                                    {user._id !== item?.createdBy._id && <li>
                                        <a
                                            href="javascript:void(0)"
                                            className="dropdown-item"
                                            onClick={() => handleSharePost(index, "Friends")}
                                        >
                                            <img
                                                src="/images/icons/share-to-feed.svg"
                                                alt="share-to-friends"
                                                className="img-fluid me-1"
                                            />
                                            Share to feed
                                        </a>
                                    </li>}
                                    <li>
                                        <a
                                            href="javascript:void(0)"
                                            className="dropdown-item"
                                            // onClick={() => handleSharePost(idx, "Selected")}
                                            onClick={() => { setShowSharePost(true); setSharePostId(id) }}
                                        >
                                            <img
                                                src="/images/icons/share-to-friends.svg"
                                                alt="share-to-friends"
                                                className="img-fluid me-1"
                                            />
                                            Share to selected
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="javascript:void(0)"
                                            className="dropdown-item"
                                            onClick={() =>
                                                navigator.clipboard.writeText(window.location.origin + "/post/" + item._id)
                                            }
                                        >
                                            <img
                                                src="/images/icons/link-icon.svg"
                                                alt="share-to-friends"
                                                className="img-fluid me-1"
                                            />
                                            Copy Link
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            // href="javascript:void(0)"
                                            className="dropdown-item dropdown-itemShare-fbCustom"
                                            href={facebookurl + encodeURI(window.location.origin + "/post/" + item._id)}
                                            target="_blank"
                                        >
                                            <img
                                                src="/images/icons/facebook.svg"
                                                alt="share-to-friends"
                                                className="img-fluid me-1 img-fluid-fbCustom"
                                            />
                                            Share to Facebook
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            // href="javascript:void(0)"
                                            className="dropdown-item"
                                            href={twitterurl + encodeURI(window.location.origin + "/post/" + item._id)}
                                            target="_blank"
                                        >
                                            <img
                                                src="/images/icons/twitter.svg"
                                                alt="share-to-friends"
                                                className="img-fluid me-1"
                                            />
                                            Share to Twitter
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            // href="javascript:void(0)"
                                            className="dropdown-item"
                                            href={mailto + encodeURI(window.location.origin + "/post/" + item._id)}
                                            target="_blank"
                                        >
                                            <img
                                                src="/images/icons/email.svg"
                                                alt="share-to-friends"
                                                className="img-fluid me-1"
                                            />
                                            Share via email
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                {/* <div className="position-relative-class homepage-commentSection"> */}
                <div className="position-relative-class ">
                    {
                        <Comment
                            post={item}
                            showCommentList={showCommentPostList.includes(item._id)}
                            updatePost={getPostList}
                            heightUnset={true}
                            idx={idx}
                            postsLength={postList.length}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default SinglePost