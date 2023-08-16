import React, { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate, NavLink } from "react-router-dom";
import ProfileImage from "../../shared/ProfileImage";
import PostService from "../../services/postService";
import DetailAbout from "../../popups/about/DetailAbout";
import UserService from "../../services/UserService";
import UserFollower from "../../services/userFollowerService";
import moment from "moment";
import VideoImageThumbnail from "react-video-thumbnail-image";
import Unfollow from "../../popups/unfollow/Unfollow";
import DiscoverPost from "../../popups/discovery/DiscoverPost";
import Report from "../../popups/report/Report";
import GroupList from "../../popups/groupChat/GroupList";

import "./userprofile.css";

import FollowerFollowingOtherList from "../../popups/followerFollowingList/FollowerFollowingOtherList";
import Playeryoutube from "../../components/Playeryoutube";
import EnlargeImage from "../../popups/userprofile/EnlargeImage";
import UserLikedPost from "../../popups/post/UserLikedPost";

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];
export default function UserProfileOrg() {
  const params = useParams();
  const navigate = useNavigate();
  const postServ = new PostService();
  const userServ = new UserService();
  const followerServ = new UserFollower();
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

  useEffect(() => {
    getUser(params.id);
    getPostList(params.id);
    getFollowingStatus(params.id);
  }, [params.id]);

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
    // try {
    //     let resp = await followerServ.unfollowUser(params.id);
    //     if (resp.message) {
    //         getUser(params.id)
    //         getFollowingStatus(params.id)
    //     }
    // } catch (err) {
    //     console.log(err);
    // }
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

  const handleShowAbout = () => {
    setShowAbout(!showAbout);
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

  const handleShowGroup = () => {
    setShowGroup(!showGroup);
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


  return (
    <>
      <div className="socialContant profileContent main_container">
        <div className="myProfile_sec">
          <div className="about_profile">
            {/* <div className="profileCoverPic mx-0" style={{ backgroundImage: `url()` }}> */}
            <div
              className="profileCoverPic mx-0"
              style={
                user?.cover_img
                  ? { backgroundImage: `url(${user?.cover_img})` }
                  : { backgroundImage: "url(/images/profile/image_cover_profile.png)" }
              }
            ></div>
            <div className="profilePic position-relative">
              {
                /* 
                <img src="/images/img/profile-image.png" alt="user-pic" className="img-fluid" /> 
                <ProfileImage url={user?.profile_img} style={{ borderRadius: "80px" }} />
               */
              }
              <div className="prf-img-container">
                <img className="prf-img" src={user?.profile_img !== "" ? user?.profile_img : "/images/profile/default-profile.png"} alt={user?.user_name} />
                <div className="middle" onClick={handleShowEnlarge}>
                  <div className="text"><i className="fa fa-external-link fa-2x text-primary"></i></div>
                </div>
              </div>
            </div>
          </div>
          <div className="usercontentBox d-flex align-items-end justify-content-between">
            <div className="user_data">
              <div className="user_profileTxt user_profileTxt-custom-flex">
                <h4 className="mb-1">
                  {user?.user_name.length > 27 ? user?.user_name.slice(0, 27) + "..." : user?.user_name}
                  {user?.role.includes("userPaid") ? <img src="/images/icons/green-tick.svg" alt="green-tick" /> : ""}
                </h4>
                <p className="txtOne mb-0">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="txtOne mb-0">
                  {user?.title?.length > 400 ? user?.title?.slice(0, 400) + "..." : user?.title}
                </p>
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
                <Link onClick={handleUnFollowRequest} className="btn btnColor">
                  Following
                </Link>
              ) : isFollowing === "requested" ? (
                <Link className="btn btnColor" onClick={handleRejectRequest}>
                  Requested
                </Link>
              ) : (
                // <a href="javascript:void(0);" onClick={handleUnFollowRequest} className="btn btnColor" >Requested</a> :
                <Link onClick={handleFollowRequest} className="btn btnColor">
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
            )}
          </div>
        </div>
        {(!user?.setting?.private || isFollowing === "following") && (
          // <div className="post_inprofile">
          <div className="row row_custom">
            {postList &&
              postList.map((item, idx) => {
                const postReactions = item.postReactions ?? [];
                return (
                  <div className="col-sm-4 col-lg-4 dynamic-width-custom">
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
                              // <img src={item?.mediaFiles[0]} alt="lesson-banner-img" className="img-fluid" />
                              <div className="position-relative video-thumbnailCustom-profile">
                                <VideoImageThumbnail videoUrl={item?.mediaFiles[0]} alt="video" />
                                <div className="overLay">
                                  <span className="overLayCustom">
                                    <i className="fa-solid fa-film"></i>
                                  </span>
                                </div>
                              </div>
                            )}
                            {/* <img src="/images/profile/post2.png" alt="post-img" className="img-fluid" /> */}
                          </div>
                        ) : (
                          <div className="postImg mx_minus postImg-custom-profile">
                            {
                              (matchYoutubeUrl(item.message)) ? (
                                <div style={{ width: "100%" }}>
                                  <Playeryoutube url={item.message} height={"260px"} corners={false} />
                                </div>) : (
                                <div className="profile-post-image-text" style={{ padding: '25px' }}>
                                  <div className="mb-0 profile-post-image-inner-text" dangerouslySetInnerHTML={{ __html: item.message.length > 320 ? item.message.slice(0, 320) + "..." : item.message }} />
                                </div>
                              )
                            }
                          </div>
                        )}
                        <div className="postTxt" onClick={() => handlePostPopup(item._id, idx)}>
                          <p className="mb-0 postcontent postcontent-custom">{item.message.slice(0, 85)}</p>
                        </div>
                        <div className="likeShareIconCounter">
                          <ul className="nav">
                            <li className="nav-item">
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
                                <span className="mx-2">{countFormator(item?.likeCount)}</span>
                              </div>
                            </li>
                            <li className="nav-item">
                              <Link className="nav-link" href="#">
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
              })}
          </div>
        )}
      </div >
      {showReportPopup && (
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
        showAbout && (
          <DetailAbout
            isEditable={false}
            user={user}
            onClose={handleShowAbout}
            onEdit={() => {
              handleShowAbout();
            }}
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
        showGroup && (
          <GroupList
            userData={user}
            onClose={handleShowGroup}
            onEdit={() => {
              handleShowGroup();
            }}
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
      {showUserLikedPost && (
        <UserLikedPost
          onClose={() => {
            setShowUserLikedPost(false);
          }}
          postId={showUserLikedPost}
        />
      )}
      {
        showEnlarge && (
          <EnlargeImage imgUrl={user?.profile_img} onClose={handleShowEnlarge} />
        )
      }
    </>
  );
}
