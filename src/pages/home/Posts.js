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
import HelperFunctions from "../../services/helperFunctions";
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
import OriginalPostCreator from "../../components/OriginalPostCreator";
import SinglePost from "../../components/_main/Dashboard/SinglePost";

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];

const Posts = () => {

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
  const [change, setChange] = useState(false)
  const [sharePostId, setSharePostId] = useState(null)


  const [search, setSearch] = useState({
    filter: {
      is_active: true,
    },
    start: 0,
    length: 20,
  });

  let twitterurl = "http://twitter.com/share?text=vestorgrow home page&url=";
  let facebookurl = "https://www.facebook.com/sharer/sharer.php?t=vestorgrow home page&u=";
  let mailto = `mailto:${user?.email}?subject=Vestorgrow!!!&body=`;

  // let link = encodeURI(window.location.origin + "/post")

  // let loading = false;

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
    setTimeout(() => {
      getPostList();
    }, 2000);
  }, [postSuccessPopup, search, change]);

  const getPostList = async () => {
    try {
      const obj = search;
      let resp = await postServ.myFeed(obj)
        .then((res) => {
          setPostList(res.data)
          setPostCount(res.total)
        })
      if (resp.data) {
        setPostList(postList.length > 0 && search.start !== 0 ? [...postList, ...resp.data] : resp.data);
        setPostCount(resp.total);
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

  function reachedBottomCall() {
    let searchTemp = { ...search };
    searchTemp.start = search.start + search.length;
    setSearch(searchTemp);
  }


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
        // loading = false;
        getPostList();
      }
    } catch (err) {
      console.log(err);
    }
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

  const handleSharePost = async (postIdx, shareType) => {
    console.log("SHARETOFEED:", postIdx, shareType)
    console.log(postList)
    let post = postList[postIdx];
    console.log(post)
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
    console.log(postId)
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
            return <SinglePost index={idx} item={item} idx={idx} key={idx} setChange={setChange} change={change} handleReportRequest={handleReportRequest} setShowSharePost={setShowSharePost} setSharePostId={setSharePostId} handleSharePost={handleSharePost} />
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
            // setSearch({ ...search, start: 0 });
            // setChange(prev=>!prev)
          }}
          getposts={getPostList}
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
      {showSharePost && <SharePostSelect onClose={() => setShowSharePost(!showSharePost)} postId={sharePostId} />}
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

export default Posts