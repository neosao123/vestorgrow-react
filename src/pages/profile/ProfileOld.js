import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../context/GlobalContext";
import ProfileImage from "../../shared/ProfileImage";
import PostService from "../../services/postService";
import UserService from "../../services/UserService";
import EditProfile from "../../popups/profile/EditProfile";
import DetailAbout from "../../popups/about/DetailAbout";
import EditAbout from "../../popups/about/EditAboutModal";
import CreatePost from "../../popups/post/CreatePost";
import PostShareSuccess from "../../popups/post/PostSharedSuccess";
import PostShareFail from "../../popups/post/PostSharedFail";
import moment from "moment";
import FollowerFollowingList from "../../popups/followerFollowingList/FollowerFollowingList";
import VideoImageThumbnail from "react-video-thumbnail-image";
import EditCoverImage from "../../popups/profile/EditCoverImage";
import EditProfileImage from "../../popups/profile/EditProfileImage";
import DiscoverPost from "../../popups/discovery/DiscoverPost";
import GroupList from "../../popups/groupChat/GroupList";
import LoadingSpin from "react-loading-spin";
import Playeryoutube from '../../components/Playeryoutube';
import { Link } from "react-router-dom";
import UserSharedPost from "../../popups/post/UserSharedPost";

const userServ = new UserService();
const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];
export default function Profile() {
  const postServ = new PostService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [postList, setPostList] = useState([]);
  const [firstRowList, setFirstRowList] = useState([]);
  const [secondRowList, setSecondRowList] = useState([]);
  const [thirdRowList, setThirdRowList] = useState([]);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showEditAbout, setShowEditAbout] = useState(false);
  const [createPostPopup, setCreatePostPopup] = useState(false);
  const [postSuccessPopup, setPostSuccessPopup] = useState(false);
  const [postFailPopup, setPostFailPopup] = useState(false);
  const [showUserList, setShowUserList] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showEditCoverImg, setShowEditCoverImg] = useState(null);
  const [showEditProfileImg, setShowEditProfileImg] = useState(null);
  const [showPostId, setShowPostId] = useState("");
  const [postIdx, setPostIdx] = useState();
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [partition, setPartition] = useState(1);

  const [showCommentPostList, setShowCommentPostList] = globalCtx.showCommentPostList;
  const [dataForSharePost, setDataForSharePost] = useState(null);
  const [showSharePost, setShowSharePost] = useState(false);

  const [showUserSharedPost, setShowUserSharedPost] = useState("");

  const [showOtherPostSharedPopup, setShowOtherPostSharedPopup] = useState(false);
  const [showOtherPostFailedPopup, setShowOtherPostFailedPopup] = useState(false);

  useEffect(() => {
    getPostList();
    getUserData();
  }, []);

  const handleCoverImage = (img) => {
    setShowEditCoverImg(null);
  };

  const handleProfileImage = (img) => {
    setShowEditProfileImg(null);
  };

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
        setUserData(resp.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditPost = (e) => {
    const element = e.target;
    setTimeout(() => {
      element.blur();
    }, 300);
    setShowEditPost(!showEditPost);
  };

  const handleShowAbout = () => {
    setShowAbout(!showAbout);
  };

  const handleShowGroup = () => {
    setShowGroup(!showGroup);
  };

  const handleShowEditAbout = () => {
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

  let twitterurl = "http://twitter.com/share?text=vestorgrow home page&url=";
  let facebookurl = "https://www.facebook.com/sharer/sharer.php?t=vestorgrow home page&u=";
  let mailto = `mailto:${user?.email}?subject=Vestorgrow!!!&body=`;

  return (
    <>
      <div className="socialContant profileContent main_container">
        <div className="myProfile_sec">
          <div className="about_profile">
            {/* <div className="profileCoverPic mx-0" style={{ backgroundImage: `url()` }}> */}
            {/* <div className="profileCoverPic mx-0" style={{ backgroundImage: `url(${user?.cover_img})` }}> */}
            <div
              className="profileCoverPic mx-0"
              style={
                user?.cover_img
                  ? { backgroundImage: `url(${user?.cover_img})` }
                  : { backgroundImage: "url(/images/profile/image_cover_profile.png)" }
              }
            >
              <div className="edit_btn" onClick={() => setShowEditCoverImg(user?.cover_img)}>
                <a href="javascript:void(0)">
                  <label htmlFor="cover_image">
                    <img src="/images/profile/Edit.svg" alt="Edit Icon" />
                  </label>
                </a>
              </div>
            </div>
            <div className="profilePic position-relative">
              {/* <img src="/images/img/profile-image.png" alt="user-pic" className="img-fluid" /> */}
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
            </div>
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
                  {/* {user?.user_name ? user?.user_name : `${user?.first_name} ${user?.last_name}`}{" "} */}
                  {user?.user_name.length > 27 ? user?.user_name.slice(0, 27) + "..." : user?.user_name}{" "}
                  {user.role.includes("userPaid") ? <img src="/images/icons/green-tick.svg" /> : ""}{" "}
                </h4>

                <p className="txtOne mb-0">
                  {user?.first_name} {user?.last_name}
                </p>

                <p className="txtOne mb-0">
                  {user?.title?.length > 400 ? user?.title?.slice(0, 400) + "..." : user?.title}
                </p>
                <p className="txtTwo mb-0">
                  <img src="/images/profile/location.svg" alt="location-tag" />
                  {user?.location}
                </p>
              </div>
              <div className=" followers">
                <a href="javascript:void(0)" onClick={() => setShowUserList("follower")}>
                  {user?.followers} Followers
                </a>
                <a href="javascript:void(0)" onClick={() => setShowUserList("following")} className="ms-3">
                  {user?.following} Following
                </a>
              </div>
            </div>
            <div className="userprof_btns userprof_btns_custom">
              <div className="btn btnColor d-none d-md-block" onClick={handleCreatePostPopup}>
                Create a post <img src="/images/profile/plus.svg" alt="create-post-icon" />
              </div>
              <div className="editComm_btn editComm_btnCustom" onClick={handleEditPost}>
                <img src="/images/profile/editIcon.svg" alt="edit-icon" /> Edit Profile
              </div>
            </div>
          </div>
          <div className="page_link">
            <ul className="list-unstyled d-flex align-items-center mb-0">
              <li>
                <a href="javascript:void(0)" className="active">
                  Posts
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" onClick={handleShowAbout}>
                  About
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" onClick={handleShowGroup}>
                  Groups
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row row_custom">
          {postList &&
            postList.map((item, idx) => {
              return (
                <div key={idx} className="col-sm-4 col-lg-4 dynamic-width-custom">
                  <div className="bgWhiteCard feedBox post_box">
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
                          onClick={() => handlePostPopup(item._id, idx)}
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
                            (matchYoutubeUrl(item.message)) ? (
                              <div style={{ width: "100%" }}>
                                <Playeryoutube url={item.message} height={"260px"} corners={false} />
                              </div>) : (
                              <div className="profile-post-image-text" style={{ padding: '25px' }} onClick={() => handlePostPopup(item._id, idx)}>
                                <div className="mb-0 profile-post-image-inner-text" dangerouslySetInnerHTML={{ __html: item.message.length > 320 ? item.message.slice(0, 320) + "..." : item.message }} />
                              </div>
                            )
                          }
                        </div>
                      )}

                      <div className="likeShareIconCounter">
                        <ul className="nav">
                          <li className="nav-item">
                            {item.isLiked ? (
                              <Link
                                className="nav-link feedLike feedCustom"
                                onClick={() => dislikePost(item._id)}
                              >
                                <img src="/images/icons/liked.svg" alt="like" className="img-fluid" />
                                <span className="mx-2">{item?.likeCount}</span>
                              </Link>
                            ) : (
                              <Link
                                className="nav-link feedUnlike feedCustom"
                                onClick={() => likePost(item._id)}
                              >
                                <img src="/images/icons/like.svg" alt="like" className="img-fluid" />
                                <span className="mx-2">{item?.likeCount}</span>
                              </Link>
                            )}
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" onClick={() => handleShowComment(item._id)}>
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
            })}
          {/* </div> */}
        </div>

      </div>
      {showEditPost && <EditProfile onClose={handleEditPost} />}
      {showAbout && (
        <DetailAbout
          isEditable={true}
          user={user}
          onClose={handleShowAbout}
          onEdit={() => {
            handleShowAbout();
            handleShowEditAbout();
          }}
        />
      )}
      {showEditAbout && <EditAbout onClose={handleShowEditAbout} />}
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
      {showLoadingBar && (
        <>
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
          <div className="modal-backdrop modal-backdrop-CustomLoading show"></div>
        </>
      )}
      {postSuccessPopup && <PostShareSuccess onClose={handlePostSuccessPopup} />}
      {postFailPopup && <PostShareFail onClose={handlePostFailPopup} />}
      {showUserList && <FollowerFollowingList type={showUserList} onClose={() => setShowUserList(null)} />}
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
      {showPostId && (
        <DiscoverPost
          onClose={onClose}
          postId={showPostId}
          slideLeft={postIdx > 0}
          slideRight={postIdx < postList.length - 1}
          changePostIdx={changePostIdx}
        />
      )}
      {showGroup && (
        <GroupList
          userData={user}
          onClose={handleShowGroup}
          onEdit={() => {
            handleShowGroup();
          }}
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
  );
}
