import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "linkify-plugin-mention";
import GlobalContext from "../../context/GlobalContext";

import PostService from "../../services/postService";
import ProfileImage from "../../shared/ProfileImage";
import UserBlockedServ from "../../services/userBlockedService";
import UserFollowerService from "../../services/userFollowerService";
import HelperFunctions from "../../services/helperFunctions";
import ReportService from "../../services/reportService";

import Report from "../../popups/report/Report";
import ImageCarousel from "../../popups/imageCarousel/ImageCarousel";
import Unfollow from "../../popups/unfollow/Unfollow";
import UserLikedPost from "../../popups/post/UserLikedPost";
import UserSharedPost from "../../popups/post/UserSharedPost";
import OtherPostSharedSuccess from "../../popups/post/OtherPostSharedSuccess";
import OtherPostShareFail from "../../popups/post/OtherPostSharedFail";
import SinglePost from "../../components/_main/Dashboard/SinglePost";
import CreatePost from "../../popups/post/CreatePost";
import PostShareSuccess from "../../popups/post/PostSharedSuccess";
import PostShareFail from "../../popups/post/PostSharedFail";
import SharePostSelect from "../../popups/post/SharePostSelect";
import UserService from "../../services/UserService";
import PostCreateSuccess from "../../popups/post/PostCreatedSuccess";
import DeletePostSuccess from "../../popups/post/DeletePostSuccess";
import { wrap } from "framer-motion";
import "./posts.css"
import PostReportSuccess from "../../popups/post/ReportPostSuccess";
import BlockUserSuccess from "../../popups/post/BlockUserSuccess";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../../components/Loader";


const Posts = () => {

  const postServ = new PostService();
  const followerServ = new UserFollowerService();
  const blockedServ = new UserBlockedServ();
  const reportServ = new ReportService();
  const helperServ = new HelperFunctions();
  const serv = new UserService()
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
  const [mediaFilesCarousel, setMediaFilesCarousel] = useState([]);
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
  const [deleteSuccessPopup, setDeleteSuccessPopup] = useState(false)
  const [showReportSuccess, setShowReportSuccess] = useState(false)
  const [blockUserSuccess, setBlockUserSuccess] = useState(false)
  const [page, setPage] = useState(1);
  const [hasMore, setHasmore] = useState(true);


  const [search, setSearch] = useState({
    filter: {
      is_active: true,
    },
    start: 0,
    length: 20,
  });


  const getUserData = async () => {
    try {
      let resp = await serv.getUser(user?._id);
      if (resp.data) {
        setUser({ ...resp.data });
        localStorage.setItem("user", JSON.stringify(resp.data))
      }
    } catch (err) {
      console.log(err);
    }
  };

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

  const handleDeleteSuccessPopup = () => {
    setDeleteSuccessPopup(!deleteSuccessPopup);
    setShowLoadingBar(false);
  }

  useEffect(() => {
    getPostList();
  }, [postSuccessPopup, search, change]);

  const getPostList = async () => {
    try {
      const obj = search;
      obj.page = page;
      let resp = await postServ.myFeed(obj)
        .then((res) => {
          setPostList((prev) => [...prev, ...res?.data]);
          setPostCount(res.count);
          setPage(page + 1)
        })
        .catch((error) => console.log("error:", error))
      // if (resp?.data) {
      //   setPostList(postList?.length > 0 && search.start !== 0 ? [...postList, ...resp.data] : resp.data);
      //   setPostCount(resp.total);
      // }
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
        // loading = false;
        getPostList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSharePost = async (postIdx, shareType) => {
    // console.log("SHARETOFEED:", postIdx, shareType)
    // console.log(postList)
    // let post = postList[postIdx];
    // console.log(post)
    // if (!post.originalPostId) {
    //   post.originalPostId = post._id;
    //   post.parentPostId = post._id;
    // } else {
    //   post.parentPostId = post._id;
    // }
    // post.shareType = shareType;
    // if (shareType === "Selected") {
    //   setDataForSharePost(post);
    //   setShowSharePost(true);
    // }
    // else {
    try {
      let resp = await postServ.sharePost(postIdx);
      if (resp.data) {
        getPostList();
        setShowOtherPostSharedPopup(!showOtherPostSharedPopup);
      } else {
        setShowOtherPostFailedPopup(!showOtherPostFailedPopup);
      }
    } catch (err) {
      console.log(err);
    }
    // }
  };

  const handleShowComment = (id) => {
    if (showCommentPostList.includes(id)) {
      setShowCommentPostList(showCommentPostList.filter((i) => i !== id));
    } else {
      setShowCommentPostList([...showCommentPostList, id]);
    }
  };

  const handleUnFollowRequest = async (id, userName) => {
    setUnfollowUserData({ id: id, userName: userName })
    setShowUnfollowPopup(true);
    setTimeout(() => {
      getUserData()
      getPostList()
    }, 2000);

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

  const LoaderStyle = {
    display: "flex",
    justifyContent: "center"
  }

  const EndTextStyle = {
    display: "flex",
    justifyContent: "center",
  }

  return (
    <>
      <div className="middleColumn">
        <div className="new-post_custom-div sticky-top-custom post_container" style={{ marginTop: "35px" }}>
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
        <div className="single_post_container" id="scrollableDiv" style={{ borderRadius: "15px" }}>
          <InfiniteScroll
            dataLength={postList.length}
            loader={<div style={LoaderStyle}><Loader /></div>}
            next={getPostList}
            hasMore={postList.length < +postCount ? true : false}
            endMessage={<div style={EndTextStyle}><p>No posts.</p></div>}
            scrollableTarget="scrollableDiv"
            scrollThreshold="200px"
          >
            {postList.length > 0 &&
              postList.map((item, idx) => {
                return <SinglePost index={idx} item={item} idx={idx} key={idx} deleteSuccessPopup={deleteSuccessPopup} setDeleteSuccessPopup={setDeleteSuccessPopup} setMediaFilesCarousel={setMediaFilesCarousel} handleUnFollowRequest={() => handleUnFollowRequest(item?.createdBy?._id, item?.createdBy?.user_name)} setChange={setChange} change={change} handleReportRequest={handleReportRequest} setShowSharePost={setShowSharePost} setSharePostId={setSharePostId} handleSharePost={handleSharePost} getPostList={getPostList} setImageIdx={setImageIdx} setBlockUserSuccess={setBlockUserSuccess} setShowUserLikedPost={setShowUserLikedPost} setShowUserSharedPost={setShowUserSharedPost} onDelete={() => { setPostList([]); setPage(1); setChange(!change); setDeleteSuccessPopup(!deleteSuccessPopup) }} />
              })}
          </InfiniteScroll>
        </div>
        <div style={{ marginBottom: "20px" }}>
        </div>
      </div >
      {showReportPopup && (
        <Report
          onClose={() => {
            setReportData(null);
            setShowReportPopup(false);
            setShowReportSuccess(true)
          }}
          object={reportData}
        />
      )
      }
      {
        createPostPopup && (
          <CreatePost
            onClose={handleCreatePostPopup}
            onSuccess={() => {
              handleCreatePostPopup();
              handlePostSuccessPopup();
              // setSearch({ ...search, start: 0 });
              // setChange(prev=>!prev)
              // getPostList()
            }}
            getposts={() => { setPostList([]); setPage(1); getPostList() }}
            onFail={() => {
              handleCreatePostPopup();
              handlePostFailPopup();
            }}
          />
        )
      }
      {deleteSuccessPopup && <DeletePostSuccess onClose={handleDeleteSuccessPopup} />}
      {postSuccessPopup && <PostCreateSuccess onClose={handlePostSuccessPopup} />}
      {
        showOtherPostSharedPopup && (
          <OtherPostSharedSuccess onClose={() => setShowOtherPostSharedPopup(!showOtherPostSharedPopup)} />
        )
      }
      {
        showOtherPostFailedPopup && (
          <OtherPostShareFail onClose={() => setShowOtherPostFailedPopup(!showOtherPostFailedPopup)} />
        )
      }
      {postFailPopup && <PostShareFail onClose={handlePostFailPopup} />}
      {showSharePost && <SharePostSelect onClose={() => setShowSharePost(!showSharePost)} postId={sharePostId} />}
      {
        mediaFilesCarousel && mediaFilesCarousel.length > 0 && (
          <ImageCarousel onClose={() => setMediaFilesCarousel(null)} mediaFiles={mediaFilesCarousel} imageIdx={imageIdx} />
        )
      }
      {
        showUnfollowPopup && (
          <Unfollow
            onClose={() => {
              setUnfollowUserData(null);
              setShowUnfollowPopup(false);
              getPostList();
              getUserData()
            }}
            // getUserData={getUserData}
            userData={unfollowUserData}
          />
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
        showUserSharedPost && (
          <UserSharedPost
            onClose={() => {
              setShowUserSharedPost(false);
            }}
            postId={showUserSharedPost}
          />
        )
      }
      {
        showReportSuccess && (<PostReportSuccess onClose={() => {
          setShowReportSuccess(false)
        }} />)
      }
      {
        blockUserSuccess && (<BlockUserSuccess onClose={() => { setBlockUserSuccess(false) }} />)
      }
    </>
  )
}

export default Posts