import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import PostService from "../../services/postService";
import DiscoverService from "../../services/discoverService";
import HelperFunctions from "../../services/helperFunctions";
import VideoImageThumbnail from "react-video-thumbnail-image";
import OwlCarousel from "react-owl-carousel";
import ReactPlayer from "react-player";
import moment from "moment";
import ProfileImage from "../../shared/ProfileImage";
import Comment from "../../shared/Comment";
import SharePostSelect from "../../popups/post/SharePostSelect";
import ImageCarousel from "../../popups/imageCarousel/ImageCarousel";
import UserFollowerService from "../../services/userFollowerService";
import UserLikedPost from "../../popups/post/UserLikedPost";
import UserSharedPost from "../../popups/post/UserSharedPost";
import { Link, useParams, NavLink } from "react-router-dom";
import MetaDecorator from "../../shared/MetaDecorator";
import Linkify from "react-linkify";
import { SecureLink } from "react-secure-link";
import Unfollow from "../../popups/unfollow/Unfollow";
import FBReactions from "../../components/FBReactions";
import Playeryoutube from "../../components/Playeryoutube";
import OriginalPostCreator from "../../components/OriginalPostCreator";

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];
export default function PostDetail() {
  const params = useParams();
  const postServ = new PostService();
  const discoverServ = new DiscoverService();
  const followerServ = new UserFollowerService();
  const helperServ = new HelperFunctions();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [isAuthentiCated, setIsAuthentiCated] = globalCtx.auth;
  const [showCommentPostList, setShowCommentPostList] = globalCtx.showCommentPostList;
  const [postId, setPostId] = useState(params.id);
  const [showSharePost, setShowSharePost] = useState(false);
  const [dataForSharePost, setDataForSharePost] = useState(null);
  const [post, setPost] = useState(null);
  const [showMoreList, setShowMoreList] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUserLikedPost, setShowUserLikedPost] = useState(false);
  const [showUserSharedPost, setShowUserSharedPost] = useState(false);
  const [metaData, setMetaData] = useState(false);
  const [showCommentDirect, setShowCommentDirect] = useState(true);
  const [postreactions, setPostReactions] = useState([]);

  const [showUnfollowPopup, setShowUnfollowPopup] = useState(false);
  const [unfollowUserData, setUnfollowUserData] = useState(null);
  const [imageIdx, setImageIdx] = useState(0);
  const [youtubeURL, setYouttubeURL] = useState(null);

  let twitterurl = "http://twitter.com/share?text=vestorgrow home page&url=";
  let facebookurl = "https://www.facebook.com/sharer/sharer.php?t=vestorgrow home page&u=";
  let mailto = `mailto:${user?.email}?subject=Vestorgrow!!!&body=`;
  // let link = encodeURI(window.location.origin)
  useEffect(() => {
    getPost();
  }, [params.id]);
  const getFollowStatus = async (id) => {
    try {
      if (isAuthentiCated) {
        let resp = await followerServ.isFollowing({ followingId: id });
        setIsFollowing(resp.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getPost = async () => {
    try {
      let resp = await discoverServ.getPost(params.id);
      if (resp.data) {
        setPost(resp.data);
        getFollowStatus(resp.data.createdBy._id);
        setMetaData(true);
        setPostReactions(resp.data.postReactions ?? []);
        setYouttubeURL(helperServ.extractYouTubeURL(resp.data.message));
      }
    } catch (err) {
      console.log(err);
    }
  };
  const dislikePost = async (postId) => {
    try {
      let resp = await postServ.dislikePost(postId);
      if (resp.message) {
        getPost();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSharePost = async (postIdx, shareType) => {
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
          getPost();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const likePost = async (postId) => {
    try {
      let resp = await postServ.likePost({ postId: postId });
      if (resp.data) {
        getPost();
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
    setShowCommentDirect((prevState) => !prevState);
  };
  const handleFollowRequest = async (userId) => {
    try {
      let resp = await followerServ.sendFollowReq({ followingId: userId });
      if (resp.data) {
        getFollowStatus(userId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnFollowRequest = async () => {
    setUnfollowUserData({ id: post?.createdBy?._id, userName: post?.createdBy?.user_name });
    setShowUnfollowPopup(true);
  };

  const handleRejectRequest = async () => {
    let curUser = JSON.parse(localStorage.getItem("user"));
    let res = await followerServ.deleteFollowReq({
      userId: curUser._id,
      followingId: post?.createdBy?._id,
    });

    if (res.message === "Request Deleted successfully") {
      setIsFollowing(false);
    }
  };

  const openImageCarousellHandler = (idx) => {
    setImageIdx(idx);
    setMediaFiles([...post?.mediaFiles]);
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

  const updatePostAfterReaction = (mode, postId, data) => {
    if (mode === "inc") {
      getPost();
    } else {
      getPost();
    }
  }

  return (
    <>
      {metaData ? (
        <MetaDecorator
          title={post.createdBy.first_name + " " + post.createdBy.last_name}
          description={post.message}
          imageUrl={post.mediaFiles[0]}
        />
      ) : (
        ""
      )}
      <div className="postDetail-heading_custom">
        <div className="feedBoxHeadRight">
          <Link to={"/"}>
            <img
              className="arrow"
              src="/images/icons/left-arrow.svg"
              alt="left-arrow"
            />
          </Link>
        </div>
        <h4>Post Detail</h4>
      </div>
      <div className="socialContant profileContent main_container">
        <div
          className={
            "discoverPosts PostDetail-customPadding modal-dialog modal-xl my-0 " +
            (post?.mediaFiles && post?.mediaFiles.length > 0 ? "discoverPostsCustom" : "discoverPostsCustomText")
          }
        >
          <div className="modal-content discovery-content postDetail-content_custom-mobile">
            <div className="modal-body p-0">
              <div className="discoverPostModelBody discoverPostModelBodyCustom discoverPostModelBodyCustom-mob">
                {post?.mediaFiles && post?.mediaFiles.length > 0 && (
                  <div className="discoverPostBanner d-flex align-items-center">
                    <OwlCarousel
                      className="owl-carousel owl-theme gallerySlider gallerySliderCustom"
                      loop={false}
                      margin={10}
                      dots={true}
                      nav={true}
                      startPosition={imageIdx}
                      navText={[
                        "<div class='carousel-right-btn-custom'><i class='fa-solid fa-angle-left'></i></div>",
                        "<div class='carousel-right-btn-custom'><i class='fa-solid fa-angle-right'></i></div>",
                      ]}
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
                      {post?.mediaFiles.map((item, idx) => {
                        return (
                          <div className="item" key={idx} onClick={() => openImageCarousellHandler(idx)}>
                            <div className="galleryImg galleryImgCustom">
                              {isImage.includes(item.split(".").pop()) ? (
                                <img src={item} alt="gallery" className="img-fluid" />
                              ) : (
                                <>
                                  <div className="position-relative postCustomLongImgpx">

                                    <ReactPlayer
                                      width="100%"
                                      height="100%"
                                      controls={true}
                                      url={item}
                                      onReady={() => console.log("ready")}
                                    />

                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </OwlCarousel>
                  </div>
                )}
                <div className="discoverFeed discoverFeedText discoverFeed-custom mt-4">
                  <div className="feedBoxInner discoverModelProfInner discoverModelProfInnerCustom postDetailProfInnerCustom">
                    <OriginalPostCreator originalPostData={post?.originalPostId} createdByUser={post?.createdBy} createdAt={post?.createdAt} />
                    <div className="feedBoxHead d-flex">
                      <div className="discoverModelProf">
                        <div className="feedBoxprofImg">
                          <Link to={"/userprofile/" + post?.createdBy?._id}>
                            <ProfileImage url={post?.createdBy?.profile_img !== "" ? post?.createdBy?.profile_img : "/images/profile/default-profile.png"} />
                          </Link>
                        </div>
                      </div>
                      <div className="feedBoxHeadLeft">
                        <div className="feedBoxHeadName">
                          <h4 className="username-title-custom" title={post?.createdBy?.user_name}>
                            <Link to={"/userprofile/" + post?.createdBy?._id}>
                              {post?.createdBy?.user_name.length > 18
                                ? post?.createdBy?.user_name.slice(0, 18) + "..."
                                : post?.createdBy?.user_name}{" "}
                            </Link>{" "}
                            {
                              post?.createdBy?.role.includes("userPaid") ? (
                                <img src="/images/icons/green-tick.svg" alt="green-tick" />
                              ) : (
                                ""
                              )
                            }
                            {user?._id !== post?.createdBy?._id &&
                              (isFollowing === "following" ? (
                                <span className="followDesign followDesign-custom" onClick={handleUnFollowRequest}>
                                  {" "}
                                  Following
                                </span>
                              ) : isFollowing === "requested" ? (
                                <span className="followDesign followDesign-custom" onClick={handleRejectRequest}>
                                  {" "}
                                  Requested
                                </span>
                              ) : (
                                <span
                                  className="followDesign followDesign-custom"
                                  onClick={() => handleFollowRequest(post?.createdBy?._id)}
                                >
                                  {" "}
                                  Follow
                                </span>
                              ))}
                          </h4>
                          <p>
                            <span>{moment(post?.createdAt).fromNow()}</span>
                            <i className="fa fa-circle" aria-hidden="true" />
                            <span>{post?.shareType}</span>
                          </p>
                        </div>
                      </div>
                      <div className="feedBoxHeadRight ms-auto">
                      </div>
                    </div>
                    <div className="postTxt">
                      {post?.message.length > 250 ? (
                        !showMoreList.includes(post?._id) ? (
                          <Linkify
                            componentDecorator={(decoratedHref, decoratedText, key) => (
                              <SecureLink href={decoratedHref} key={key}>
                                {decoratedText}
                              </SecureLink>
                            )}
                          >
                            <div className="mb-0">
                              <div dangerouslySetInnerHTML={{ __html: post?.message.slice(0, 250) + "..." }} />
                              <a
                                href="javascript:void(0);"
                                onClick={() => setShowMoreList([...showMoreList, post?._id])}
                              >
                                Show More
                              </a>
                            </div>
                          </Linkify>
                        ) : (
                          <Linkify
                            componentDecorator={(decoratedHref, decoratedText, key) => (
                              <SecureLink href={decoratedHref} key={key}>
                                {decoratedText}
                              </SecureLink>
                            )}
                          >
                            <div className="mb-0">
                              <div dangerouslySetInnerHTML={{ __html: post?.message + "..." }} />
                              <a
                                href="javascript:void(0);"
                                onClick={() => setShowMoreList(showMoreList.filter((i) => i !== post?._id))}
                              >
                                Show Less
                              </a>
                            </div>
                          </Linkify>
                        )
                      ) : (
                        <Linkify
                          componentDecorator={(decoratedHref, decoratedText, key) => (
                            <SecureLink href={decoratedHref} key={key}>
                              {decoratedText}
                            </SecureLink>
                          )}
                        >
                          <div className="mb-0" dangerouslySetInnerHTML={{ __html: post?.message }} />
                        </Linkify>
                      )}
                    </div>
                    <div>
                      {
                        youtubeURL && <Playeryoutube url={youtubeURL} corners={true} />
                      }
                    </div>
                    <div className="likeShareIconCounter">
                      <ul className="nav nav-custom-like-count">
                        <li className="nav-item">
                          {post?.likeCount > 0 ? (
                            <div className={"d-flex align-items-center"} onClick={() => setShowUserLikedPost(post?._id)}>
                              <div className="floating-reactions-container">
                                {
                                  postreactions.includes("like") && <span><img src="/images/icons/filled-thumbs-up.svg" alt="filled-thumbs-up" /></span>
                                }
                                {
                                  postreactions.includes("love") && <span><img src="/images/icons/filled-heart.svg" alt="filled-heart" /></span>
                                }
                                {
                                  postreactions.includes("insight") && <span><img src="/images/icons/filled-insightfull.svg" alt="filled-insightfull" /></span>
                                }
                              </div>
                              <span className="mx-2">{countFormator(post?.likeCount)}</span>
                            </div>
                          ) : (
                            <NavLink
                              className="nav-link"
                            >
                              <img src="/images/icons/no-reaction.svg" alt="like" className="img-fluid" style={{ width: "24px", height: "24px", marginRight: "5px" }} />
                              <span>{post?.likeCount}</span>
                            </NavLink>
                          )}
                        </li>
                        <li className="nav-item commentShareCustom">
                          <div>
                            <a className="nav-link" href="#" onClick={() => handleShowComment(post?._id)}>
                              <span>{post?.commentCount}</span> comments
                            </a>
                            <a className="nav-link" href="#" onClick={() => setShowUserSharedPost(post?._id)}>
                              <span>{post?.shareCount}</span> share
                            </a>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="likeShareIcon">
                      <ul className="nav">
                        <li className="nav-item">
                          <FBReactions postReaction={post?.reaction ?? null} postId={params.id} updatePostAfterReaction={updatePostAfterReaction} />
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link feedComment feedCustom"
                            href="javascript:void(0);"
                            onClick={() => handleShowComment(post?._id)}
                          >
                            <img src="/images/icons/comment.svg" alt="comment" className="img-fluid" />{" "}
                            <span>Comment</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <div className="commonDropdown dropdown">
                            <a
                              className="nav-link feedShare feedCustom"
                              href="javascript:void(0);"
                              data-bs-toggle="dropdown"
                            >
                              <img src="/images/icons/share.svg" alt="share" className="img-fluid" /> <span>Share</span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-customPaddingPost">
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="javascript:void(0);"
                                  onClick={() => handleSharePost(0, "Friends")}
                                >
                                  <img
                                    src="/images/icons/share-to-feed.svg"
                                    alt="share-to-friends"
                                    className="img-fluid me-1"
                                  />{" "}
                                  Share to feed
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="javascript:void(0);"
                                  onClick={() => handleSharePost(0, "Selected")}
                                >
                                  <img
                                    src="/images/icons/share-to-friends.svg"
                                    alt="share-to-friends"
                                    className="img-fluid me-1"
                                  />{" "}
                                  Share to selected
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="javascript:void(0);"
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      encodeURI(window.location.origin + "/post/" + post?._id)
                                    )
                                  }
                                >
                                  <img
                                    src="/images/icons/share-to-feed.svg"
                                    alt="share-to-friends"
                                    className="img-fluid me-1"
                                  />{" "}
                                  Copy Link
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href={facebookurl + encodeURI(window.location.origin + "/post/" + post?._id)}
                                  target="_blank"
                                >
                                  <img
                                    src="/images/icons/share-to-friends.svg"
                                    alt="share-to-friends"
                                    className="img-fluid me-1"
                                  />{" "}
                                  Share to Facebook
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href={twitterurl + encodeURI(window.location.origin + "/post/" + post?._id)}
                                  target="_blank"
                                >
                                  <img
                                    src="/images/icons/share-to-friends.svg"
                                    alt="share-to-friends"
                                    className="img-fluid me-1"
                                  />{" "}
                                  Share to Twitter
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href={mailto + encodeURI(window.location.origin + "/post/" + post?._id)}
                                  target="_blank"
                                >
                                  <img
                                    src="/images/icons/share-to-friends.svg"
                                    alt="share-to-friends"
                                    className="img-fluid me-1"
                                  />{" "}
                                  Share via email
                                </a>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="commentWrapper position-relative-class">
                      {isAuthentiCated && post && (
                        <Comment
                          post={post}
                          // showCommentList={showCommentPostList.includes(post?._id)}
                          showCommentList={showCommentDirect}
                          updatePost={getPost}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSharePost && <SharePostSelect onClose={() => setShowSharePost(!showSharePost)} post={dataForSharePost} />}
      {mediaFiles && mediaFiles.length > 0 && (
        <ImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} imageIdx={imageIdx} />
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
      {showUnfollowPopup && (
        <Unfollow
          onClose={() => {
            setUnfollowUserData(null);
            setShowUnfollowPopup(false);
            // getUser(post?.createdBy?._id);
            getFollowStatus(post?.createdBy?._id);
          }}
          userData={unfollowUserData}
        />
      )}
    </>
  );
}
