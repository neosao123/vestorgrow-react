import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import CreatePost from "../../popups/post/CreatePost";
import PostShareSuccess from "../../popups/post/PostSharedSuccess";
import PostShareFail from "../../popups/post/PostSharedFail";
import PostService from "../../services/postService";
import VideoImageThumbnail from "react-video-thumbnail-image";
import moment from "moment";
import ProfileImage from "../../shared/ProfileImage";
import Comment from "../../shared/Comment";
import SharePostSelect from "../../popups/post/SharePostSelect";
import UserBlockedServ from "../../services/userBlockedService";
import UserFollowerService from "../../services/userFollowerService";
import ImageCarousel from "../../popups/imageCarousel/ImageCarousel";
import Unfollow from "../../popups/unfollow/Unfollow";
import UserLikedPost from "../../popups/post/UserLikedPost";
import UserSharedPost from "../../popups/post/UserSharedPost";
import ReportService from "../../services/reportService";
import Linkify from "react-linkify";
import { SecureLink } from "react-secure-link";
import Report from "../../popups/report/Report";
import LoadingSpin from "react-loading-spin";
import FBReactions from "../../components/FBReactions";
import "linkify-plugin-mention";
import OtherPostSharedSuccess from "../../popups/post/OtherPostSharedSuccess";
import OtherPostShareFail from "../../popups/post/OtherPostSharedFail";
import ScrollMore from "../../shared/ScrollMore";
import YoutubeThumbnail from "../../components/YoutubeThumbnail";
import Playeryoutube from "../../components/Playeryoutube";
import SharedPost from "../../components/SharedPost";

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];

const PostsShared = () => {

  const postServ = new PostService();
  const followerServ = new UserFollowerService();
  const blockedServ = new UserBlockedServ();
  const reportServ = new ReportService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [createPostPopup, setCreatePostPopup] = globalCtx.createPostPopup;
  const [postSuccessPopup, setPostSuccessPopup] = globalCtx.postSuccessPopup;
  const [postFailPopup, setPostFailPopup] = globalCtx.postFailPopup;
  const [showCommentPostList, setShowCommentPostList] = globalCtx.showCommentPostList;
  // const [showCommentPostList, setShowCommentPostList] = useState([])
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
  const [search, setSearch] = useState({
    filter: {
      is_active: true,
    },
    start: 0,
    length: 15,
  });
  let twitterurl = "http://twitter.com/share?text=vestorgrow home page&url=";
  let facebookurl = "https://www.facebook.com/sharer/sharer.php?t=vestorgrow home page&u=";
  let mailto = `mailto:${user?.email}?subject=Vestorgrow!!!&body=`;
  // let link = encodeURI(window.location.origin + "/post")
  let loading = false;
  const handleCreatePostPopup = () => {
    setCreatePostPopup(!createPostPopup);
    setShowLoadingBar(false);
  };
  const handlePostSuccessPopup = () => {
    setPostSuccessPopup(!postSuccessPopup);
    setShowLoadingBar(false);
  };
  const handlePostFailPopup = () => {
    setPostFailPopup(!postFailPopup);
    setShowLoadingBar(false);
  };

  useEffect(() => {
    getPostList();
  }, [postSuccessPopup, search]);

  const getPostList = async () => {
    try {
      //if (loading === false && (postCount === 0 || postCount > postList.length)) {
      loading = true;
      const obj = search;
      let resp = await postServ.postList(obj);
      console.log(resp.data);
      if (resp.data) {
        setPostList(postList.length > 0 && search.start !== 0 ? [...postList, ...resp.data] : resp.data);
        setPostCount(resp.total);
      }
      //}
    } catch (err) {
      console.log(err);
    }
  };

  const options = {
    formatHref: {
      mention: (href) => "http://localhost:3000/userprofile/profiles" + href,
    },
  };

  function reachedBottomCall() {
    let searchTemp = { ...search };
    searchTemp.start = search.start + search.length;
    setSearch(searchTemp);
  }

  const hidePost = async (postId) => {
    try {
      let resp = await postServ.hidePost(postId);
      if (resp.data) {
        loading = false;
        setTimeout(() => {
          getPostList();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async (postId) => {
    try {
      let resp = await postServ.deletePost(postId);
      if (resp.message) {
        // getPostList();
        setSearch({ ...search, start: 0 });
        // getPostList();
      }
    } catch (err) {
      console.log(err);
    }
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

  const unhidePost = async (postId) => {
    try {
      let resp = await postServ.unhidePost(postId);
      if (resp.message) {
        loading = false;
        getPostList();
      }
    } catch (err) {
      console.log(err);
    }
  };

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

  // check youtube video url 
  const matchYoutubeUrl = (url) => {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? true : false;
  }


  return (
    <>
      <div className="middleColumn">
        <div className="new-post_custom-div sticky-top-custom">
          <div className="new-post_custom-divInner-top"></div>
          <div className="new-post_custom-divInner">
            <div className="bgWhiteCard addPhotoVideoPost d-none d-md-block sticky-top-custom">
              <div className="youMind youMindCustom" onClick={handleCreatePostPopup} style={{ cursor: "pointer" }}>
                <div className="putStatus d-flex align-items-center">
                  <div className="youMindProf">
                    <ProfileImage url={user?.profile_img} style={{ borderRadius: "80px" }} />
                  </div>
                  <div className="youMindTxtWrite">
                    <div className="form-control" style={{ borderRadius: "25px" }}>Create a post</div>
                  </div>
                </div>
                <div className="postFile p-0">
                  <div className="addPhoto">
                    <Link className="btn">
                      <img src="/images/icons/image.svg" alt="img-icon" className="img-fluid" />
                      <span>Add Photo/Video</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {postList.length > 0 &&
          postList.map((item, idx) => {
            let date = new Date();
            const originalPostId = item.originalPostId;
            item.duration = moment.duration(moment(date).diff(moment(item.createdAt)));
            return item.isHidden ? (
              <div className="bgDarkCard postHidden d-none d-md-block">
                <div className="postHiddenInner d-flex align-items-center">
                  <div className="hideIconWhite">
                    <img
                      src="/images/icons/hide-icon-white.svg"
                      alt="hide-icon-white"
                      className="img-fluid"
                      onClick={() => unhidePost(item._id)}
                    />
                  </div>
                  <div className="postHiddenTxt">
                    <h5>Post Hidden</h5>
                    <p>You won't see this post on your timeline</p>
                  </div>
                  <div className="postHiddenClose">
                    <NavLink onClick={() => unhidePost(item._id)}>
                      <img src="/images/icons/close-white.svg" alt="close-white" className="img-fluid" />
                    </NavLink>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bgWhiteCard feedBox" key={idx}>
                <div className="feedBoxInner">
                  <SharedPost originalPostData={item.originalPostId} createdByUser={item.createdBy} createdAt={item.createdAt} shareType={item.shareType} />
                  <div className="feedBoxHead d-flex align-items-center">
                    <div className="feedBoxHeadLeft">
                      <div className="feedBoxprofImg">
                        {
                          originalPostId && originalPostId?.createdBy?._id !== "" ? (
                            <NavLink to={(originalPostId?.createdBy?._id !== null) ? "/userprofile/" + originalPostId?.createdBy?._id : ""}>
                              <ProfileImage url={item.originalPostId?.createdBy?.profile_img} style={{ borderRadius: "30px" }} />
                            </NavLink>
                          ) : (
                            <NavLink to={(item.createdBy !== null) ? "/userprofile/" + item.createdBy?._id : ""}>
                              <ProfileImage url={item.createdBy?.profile_img} style={{ borderRadius: "30px" }} />
                            </NavLink>
                          )
                        }
                      </div>
                      <div className="feedBoxHeadName">
                        {
                          originalPostId && originalPostId?.createdBy?._id !== "" ? (
                            <NavLink to={(originalPostId?.createdBy !== null) ? "/userprofile/" + originalPostId?.createdBy?._id : ""}>
                              <h4 className="username-title-custom" title={originalPostId?.createdBy?.user_name}>
                                {originalPostId?.createdBy?.user_name.length > 25
                                  ? originalPostId?.createdBy?.user_name.slice(0, 25) + "..."
                                  : originalPostId?.createdBy?.user_name}
                                {originalPostId?.createdBy?.role.includes("userPaid") ? (
                                  <img src="/images/icons/green-tick.svg" alt="green-tick" />
                                ) : ("")}
                              </h4>
                            </NavLink>
                          ) : (
                            <>
                              <NavLink to={(item.createdBy !== null) ? "/userprofile/" + item.createdBy?._id : ""}>
                                <h4 className="username-title-custom" title={item?.createdBy?.user_name}>
                                  {item?.createdBy?.user_name.length > 25
                                    ? item?.createdBy?.user_name.slice(0, 25) + "..."
                                    : item?.createdBy?.user_name}
                                  {item.createdBy?.role.includes("userPaid") ? (
                                    <img src="/images/icons/green-tick.svg" alt="green-tick" />
                                  ) : ("")}
                                </h4>
                              </NavLink>
                              <p>
                                <span>{moment(item?.createdAt).fromNow()}</span>
                                <i className="fa fa-circle" aria-hidden="true" />
                                <span>{item?.shareType}</span>
                              </p>
                            </>
                          )}
                      </div>
                    </div>
                    <div className="feedBoxHeadRight ms-auto">
                      <div className="feedBoxHeadDropDown">
                        <a className="nav-link" data-bs-toggle="dropdown">
                          <img src="/images/icons/dots.svg" alt="dots" className="img-fluid" />
                        </a>
                        <ul className="dropdown-menu">
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
                              <div onClick={() => deletePost(item._id)} className="dropdown-item">
                                <img src="/images/icons/delete.svg" alt="hide-icon" className="img-fluid" />
                                Delete
                              </div>
                            </li>
                          )}
                          {(item?.createdBy?._id !== user._id) && (
                            <>
                              <li>
                                <div onClick={() => handleReportRequest(item._id)} className="dropdown-item">
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
                              "dropdown-menu dropdown-menuMore-custom" + (showShareTo === item._id ? " show" : "")
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
                              {/* <img src={item.mediaFiles[1]} alt="profile-img" className="img-fluid" /> */}
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
                              <a href="javascript:void(0)">
                                {/* <img src={item.mediaFiles[2]} alt="profile-img" className="img-fluid" /> */}
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
                              </a>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* <img src={item.mediaFiles[1]} alt="profile-img" className="img-fluid" /> */}
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
                  {/* <div className={`postTxt ${item?.message.length > 600 ? "postLimitLines" : ""}`}> */}
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
                          (matchYoutubeUrl(item.message)) ? (
                            <></>
                          ) : (<div className="mb-0 whiteSpace p-aligment-wrap" dangerouslySetInnerHTML={{ __html: item.message }} />)
                        }
                      </Linkify>

                    )}
                    {/* <p className="mb-0">{item?.message}</p> */}
                    <div className="col-12 text-center">
                      {
                        (matchYoutubeUrl(item.message)) ? (
                          <Playeryoutube url={item.message} corners={true} />
                        ) : (<></>)
                      }
                    </div>
                  </div>
                  <div className="likeShareIconCounter">
                    <ul className="nav nav-custom-like-count">
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          onClick={() => setShowUserLikedPost(item?._id)}
                        >
                          <img src="/images/icons/loved.svg" alt="like" className="img-fluid" style={{ width: "24px", height: "24px", marginRight: "5px" }} />
                          <span>{item?.likeCount}</span>
                        </NavLink>
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
                        <FBReactions postReaction={null} />
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
                        <div className="commonDropdown dropdown">
                          <a
                            href="javascript:void(0)"
                            className="nav-link feedShare feedCustom"
                            data-bs-toggle="dropdown"
                          >
                            <img src="/images/icons/share.svg" alt="share" className="img-fluid" /> <span>Share</span>
                          </a>
                          <ul className="dropdown-menu">
                            <li>
                              <a
                                href="javascript:void(0)"
                                className="dropdown-item"
                                onClick={() => handleSharePost(idx, "Friends")}
                              >
                                <img
                                  src="/images/icons/share-to-feed.svg"
                                  alt="share-to-friends"
                                  className="img-fluid me-1"
                                />
                                Share to feed
                              </a>
                            </li>
                            <li>
                              <a
                                href="javascript:void(0)"
                                className="dropdown-item"
                                onClick={() => handleSharePost(idx, "Selected")}
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
                                href="javascript:void(0)"
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
                                href="javascript:void(0)"
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
                                href="javascript:void(0)"
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
                  <div className="position-relative-class homepage-commentSection">
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
            );
          })}

      </div>
      {showReportPopup && (
        <Report
          onClose={() => {
            setReportData(null);
            setShowReportPopup(false);
          }}
          object={reportData}
        />
      )}
      {createPostPopup && (
        <CreatePost
          onClose={handleCreatePostPopup}
          onSuccess={() => {
            handleCreatePostPopup();
            handlePostSuccessPopup();
            setSearch({ ...search, start: 0 });
          }}
          onFail={() => {
            handleCreatePostPopup();
            handlePostFailPopup();
          }}
        />
      )}
      {postSuccessPopup && <PostShareSuccess onClose={handlePostSuccessPopup} />}
      {showOtherPostSharedPopup && (
        <OtherPostSharedSuccess onClose={() => setShowOtherPostSharedPopup(!showOtherPostSharedPopup)} />
      )}
      {showOtherPostFailedPopup && (
        <OtherPostShareFail onClose={() => setShowOtherPostFailedPopup(!showOtherPostFailedPopup)} />
      )}
      {postFailPopup && <PostShareFail onClose={handlePostFailPopup} />}
      {showSharePost && <SharePostSelect onClose={() => setShowSharePost(!showSharePost)} post={dataForSharePost} />}
      {mediaFiles && mediaFiles.length > 0 && (
        <ImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} imageIdx={imageIdx} />
      )}
      {showUnfollowPopup && (
        <Unfollow
          onClose={() => {
            setUnfollowUserData(null);
            setShowUnfollowPopup(false);
            getPostList();
          }}
          userData={unfollowUserData}
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
      {showUserSharedPost && (
        <UserSharedPost
          onClose={() => {
            setShowUserSharedPost(false);
          }}
          postId={showUserSharedPost}
        />
      )}
    </>
  )
}

export default PostsShared