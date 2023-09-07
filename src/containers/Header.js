import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import UserService from "../services/UserService";
import NotificationService from "../services/notificationService";
import UserFollowerService from "../services/userFollowerService";
import GlobalContext from "../context/GlobalContext";
import ProfileImage from "../shared/ProfileImage";
import SearchBar from "./SearchBar";
import moment from "moment";
import ChatService from "../services/chatService";
import Tooltip from "../shared/Tooltip";
import Logo from "../assets/images/logo-2.svg"

const serv = new UserService();
const chatServ = new ChatService();
const followServ = new UserFollowerService();
const notificationServ = new NotificationService();
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [groupJoinedByNoti, setGroupJoinedByNoti] = globalCtx.groupJoinedByNoti;
  const [activeChat, setActiveChat] = globalCtx.activeChat;
  const [notificationList, setNotificationList] = useState([]);
  const [followReq, setFollowReq] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showFollowReq, setShowFollowReq] = useState(false);
  const [addClassPara, setAddClassPara] = useState(false);
  const [addClassfull, setAddClassFull] = useState(false);
  const [updateChatList, setUpdateChatList] = globalCtx.UpdateChat;

  useEffect(() => {
    getNotificationList();
    getFollowReq();
    const interval = setInterval(() => {
      getNotificationList();
      getFollowReq();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getNotificationList = async () => {
    try {
      let resp = await notificationServ.notificationList({});
      if (resp?.data) {
        setNotificationList([...resp?.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getFollowReq = async () => {
    try {
      let resp = await followServ.listFollowReq({});
      if (resp?.data) {
        setFollowReq([...resp?.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getFollowingStatus = async (id) => {
    try {
      let resp = await followServ.isFollowing({ followingId: id });
      // if (resp.data) {
      return resp.data;
      // setIsFollowing(resp.data)
      // }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteNotification = async (id) => {
    try {
      let resp = await notificationServ.deleteNotification(id);
      // console.log(resp);
      if (resp.message) {
        getNotificationList();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogout = async () => {
    try {
      let resp = await serv.logout({});
      if (resp) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload(true);
      }
    } catch (error) {
      console.log(error);
    }
    // localStorage.clear();
  };
  const handleShowNotification = () => {
    setShowNotification(!showNotification);
  };
  const handleShowFollowReqList = () => {
    setShowFollowReq(!showFollowReq);
  };
  const handleRejectReq = async (id) => {
    try {
      let resp = await followServ.rejectFollowReq(id);
      if (resp.message) {
        // getFollowReq()
        let status = await getFollowingStatus(id);
        let reqArrTemp = followReq.map((item) => {
          if (item?.userId?._id === id) {
            item.reqStatus = true;
            item.is_following = status;
          }
          return item;
        });
        setFollowReq([...reqArrTemp]);
        getUserData();
        setAddClassPara(true);
        setAddClassFull(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleAcceptReq = async (id) => {
    try {
      let obj = { followingId: id };
      await followServ
        .acceptFollowReq(obj)
        .then(async (resp) => {
          if (resp.data) {
            // getFollowReq()
            let status = await getFollowingStatus(id);
            let reqArrTemp = followReq.map((item) => {
              if (item?.userId?._id === id) {
                item.reqStatus = true;
                item.is_following = status;
              }
              return item;
            });
            setFollowReq([...reqArrTemp]);
            getUserData();
            setAddClassPara(true);
            setAddClassFull(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const handleFollowRequest = async (id) => {
    try {
      let resp = await followServ.sendFollowReq({ followingId: id });
      if (resp.data) {
        let status = await getFollowingStatus(id);
        let reqArrTemp = followReq.map((item) => {
          if (item?.userId?._id === id) {
            item.reqStatus = true;
            item.is_following = status;
          }
          return item;
        });
        setFollowReq([...reqArrTemp]);
        getUserData();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleUnFollowRequest = async (id) => {
    // setUnfollowUserData({ id: params.id, userName: user.user_name })
    // setShowUnfollowPopup(true)
    try {
      let resp = await followServ.unfollowUser(id);
      if (resp.message) {
        let status = await getFollowingStatus(id);
        let reqArrTemp = followReq.map((item) => {
          if (item?.userId?._id === id) {
            item.reqStatus = true;
            item.is_following = status;
          }
          return item;
        });
        setFollowReq([...reqArrTemp]);
        getUserData();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getUserData = async () => {
    try {
      let resp = await serv.getUser(user?._id);
      if (resp.data) {
        setUser({ ...resp.data });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleJoinGroup = async (groupId, id, user_id) => {
    try {
      let obj = {
        groupId: groupId,
        user_id: user_id,
      };
      await chatServ.joinGroup(obj).then((resp) => {
        if (resp.message) {
          // setActiveChat(2);
          setGroupJoinedByNoti(groupId);
          deleteNotification(id);
          setUpdateChatList(!updateChatList);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  const deleteInvitation = async (groupId, id) => {
    try {
      let obj = {
        groupId: groupId,
      };
      await chatServ.deleteInvitation(obj).then((resp) => {
        if (resp.message) {
          setActiveChat(2);
          setGroupJoinedByNoti(" ");
          deleteNotification(id);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const markAsRead = async (event, id) => {
    event.preventDefault();
    try {
      let resp = await followServ.removeNotification(id);
      if (resp?.data) {
        //document.querySelector(`#noti-${id}`).remove();
        //getNotificationList();
        deleteNotification(id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {" "}
      <header className="w-100 clearfix topHeader sticky-top-header-custom" id="topHeader">
        <div className="topHeaderInner d-flex align-items-center topHeaderInner-custom" >
          <div className="mobileLogo d-block  mobileLogoCustom" >
            <Link to="/">
              <img src={Logo} alt="logo" />
            </Link>
          </div>
          <div className="topHeaderLeftSec d-md-block">
            {!location.pathname.includes("setting") && (
              <div className="customWidth">
                <SearchBar />
              </div>
            )}
          </div>
          <div className="topHeaderRightSec">
            <div className="topHeaderRightInner d-flex align-items-center">
              <div className="toggleIcon headIcon d-none d-md-block d-xl-none">
                <Link>
                  <i className="fa fa-bars" aria-hidden="true" />
                </Link>
              </div>
              <div className="notificationIcon headIcon dropdown">
                <Link onClick={handleShowNotification}>
                  <img
                    src="/images/icons/notification.svg"
                    alt="notification-icon"
                    className="img-fluid notification-icon"
                  />
                  {(notificationList.length > 0 || followReq.length > 0) && (
                    <img
                      src="/images/icons/notification-circle.svg"
                      alt="notification-circle"
                      className="img-fluid notification-circle"
                    />
                  )}
                </Link>
                <div
                  className={"dropdown-menu dropdown-notification " + (showNotification && "show")}
                  id="dropdown-notification-id-custom"
                >
                  {showFollowReq ? (
                    <>
                      <div
                        className="notifyHeading d-flex notifyHeading-customSize notifyHeading-customfr-mobile"
                        onClick={handleShowFollowReqList}

                      >
                        <img className="arrow" src="/images/icons/left-arrow.svg" alt="" />
                        <h4 className="w-100 mb-0">Follow requests</h4>
                      </div>
                      <div className="dropdownGroup dropdownGroupCustom overflowScrollStop" style={{ backgroundColor: "green" }} >
                        {followReq.map((item, idx) => {
                          return (
                            <div key={idx}>
                              <Link className="dropdown-item position-relative" id={"noti-" + item._id}>
                                <div className="notifyGroup followReqList">
                                  <div className=" position-relative">
                                    <ProfileImage
                                      url={item?.userId?.profile_img}
                                      style={{ minWidth: "48px", height: "48px", borderRadius: "50%" }}
                                    />
                                  </div>
                                  <div
                                    className={
                                      !addClassfull
                                        ? "followReqContant followReqContant-custom w-auto"
                                        : "followReqContant followReqContant-custom-full w-auto"
                                    }
                                  >
                                    <h4>
                                      {/* {item?.userId?.first_name} */}
                                      {item?.userId?.user_name}
                                    </h4>
                                    <p
                                      className={
                                        !addClassPara ? "paragrapgh_resize_custom" : "paragrapgh_resize_custom_full"
                                      }
                                    >
                                      {item?.userId?.first_name} {item?.userId?.last_name}
                                    </p>
                                    <p
                                      className={
                                        !addClassPara ? "paragrapgh_resize_custom" : "paragrapgh_resize_custom_full"
                                      }
                                    >
                                      {item?.userId?.title}
                                    </p>
                                    {!item.requested ? (<small>Has started following you</small>) : (<></>)}
                                  </div>
                                  <div className=" text-center d-flex position-absolute end-0 me-2">
                                    {!item.reqStatus ? item.requested ? (
                                      <div className="d-flex">
                                        <div className="confirmBtn me-2">
                                          <button
                                            onClick={() => handleAcceptReq(item?.userId?._id)}
                                            className="btn"
                                            type="button"
                                          >
                                            Confirm
                                          </button>
                                        </div>
                                        <div className="confirmBtn confirmBtnCustom">
                                          <button
                                            onClick={() => handleRejectReq(item?.userId?._id)}
                                            className="btn"
                                            type="button"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="closeNotify me-2">
                                        <button class="btn" onClick={(e) => markAsRead(e, item._id)}>
                                          <img src="/images/icons/close.svg" alt="close" />
                                        </button>
                                      </div>
                                    ) : item.is_following === "following" ? (
                                      <div className="confirmBtn me-2">
                                        <button
                                          onClick={() => handleUnFollowRequest(item?.userId?._id)}
                                          className="btn"
                                        >
                                          Following
                                        </button>
                                      </div>
                                    ) : item.is_following === "requested" ? (
                                      <div className="confirmBtn me-2">
                                        <button className="btn btnColor">
                                          Requested
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="confirmBtn me-2">
                                        <button onClick={() => handleFollowRequest(item?.userId?._id)} className="btn">
                                          Follow
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="notifyHeading notifyHeading-custom-mobile" >
                        <div className="notifyHeading-backButton" onClick={() => setShowNotification(false)}>
                          <img
                            className="arrow"
                            src="/images/icons/left-arrow.svg"
                            alt=""
                          // onClick={setShowNotification(false)}
                          />
                        </div>
                        <h4 className="mb-0">Notifcations</h4>
                      </div>
                      <div className="dropdownGroup h-100 overflowScrollStop">
                        <Link className="dropdown-item" onClick={handleShowFollowReqList}>
                          <div className="notifyGroup followReqGroup position-relative">
                            <div className="notifyIcon" style={{ width: followReq.length > 1 ? "40px" : "22px" }}>
                              <div className="userImgProf position-relative">
                                {followReq.length > 0 && (
                                  <div className="taskEmployeeImg rounded-circle" style={{ left: 0 }}>
                                    {/* <img data-bs-toggle="tooltip" title="Joshua" src="/images/img/profile-image3.png" /> */}
                                    <ProfileImage url={followReq[0]?.userId?.profile_img} />
                                  </div>
                                )}
                                {followReq.length > 1 && (
                                  <div
                                    className="taskEmployeeImg rounded-circle position-absolute"
                                    style={{ left: 24 }}
                                  >
                                    {/* <img data-bs-toggle="tooltip" title="jake Madsen" src="/images/img/profile-image2.png" /> */}
                                    <ProfileImage url={followReq[1]?.userId?.profile_img} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="followReqContant">
                              <h4>Follow requests</h4>
                              <p>
                                {followReq.length > 0
                                  ? `${followReq[0]?.userId?.user_name} + ${followReq.length - 1} others`
                                  : "Don't have any follow request now"}
                              </p>
                            </div>
                            <div className="dotsNotify text-center followReqDots">
                              {followReq.length >= 1 ? (
                                <img src="/images/icons/notification-circle.svg" alt="notification-circle" className="mx-1" />
                              ) : (
                                ""
                              )}
                              <img className="arrow mx-1" src="/images/icons/right-arrow.svg" alt="right-arrow" />
                            </div>
                          </div>
                        </Link>

                        {notificationList.length > 0 &&
                          notificationList.map((item, idx) => {
                            return (
                              <div key={idx}>
                                <Link
                                  className="dropdown-item"
                                  to={
                                    item?.groupId?._id && item?.type === "message"
                                      ? "/message/show/" + item?.groupId?._id + "/" + item?.groupId?.latestMessage
                                      : item?.groupId?._id && item?.type === "groupInvite"
                                        ? ""
                                        : "/post/" + item?.postId
                                  }
                                  onClick={() => {
                                    handleShowNotification();
                                    deleteNotification(item._id);
                                  }}
                                >
                                  <div className="notifyGroup">
                                    <div className="notifyIcon">
                                      <img
                                        src={
                                          item.type === "like"
                                            ? "/images/icons/liked.svg"
                                            : item.type === "comment"
                                              ? "/images/icons/comment.svg"
                                              : "/images/icons/share.svg"
                                        }
                                        alt="notification-like"
                                        className="img-fluid notificationLike"
                                      />
                                    </div>
                                    <div className="notifyContant">
                                      <div className="notifyUserImage d-flex justify-content-between">
                                        <div className="userImgProf position-relative">
                                          <div className="taskEmployeeImg rounded-circle" style={{ left: 0 }}>
                                            <ProfileImage url={item?.createdBy?.profile_img} />
                                            {/* <img data-bs-toggle="tooltip" title="Joshua" src="/images/img/profile-image3.png" /> */}
                                          </div>
                                          {/* <div className="taskEmployeeImg rounded-circle position-absolute" style={{ left: 24 }}>
                                                                        <img data-bs-toggle="tooltip" title="jake Madsen" src="/images/img/profile-image2.png" />
                                                                    </div> */}
                                        </div>
                                        <div className="closeNotify">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              e.preventDefault();
                                              deleteNotification(item._id);
                                            }}
                                            className="btn"
                                          >
                                            <img src="/images/icons/close.svg" alt="close" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="notifyUserTxt d-flex justify-content-between">
                                        <div className="notifyContant">
                                          <p className="mb-2">
                                            <strong>
                                              {item.createdBy?.first_name
                                                ? `${item.createdBy.first_name} ${item.createdBy?.last_name}`
                                                : item.createdBy?.user_name}
                                              {item.createdBy?.role.includes("userPaid") ? (
                                                <img src="/images/icons/green-tick.svg" alt="green-tick" className="mx-1" />
                                              ) : (
                                                <img src="/images/icons/dot.svg" alt="dot" className="mx-1" />
                                              )}
                                            </strong>
                                            {item.title}
                                            {item.groupId?._id && item.groupId.chatName && (
                                              <strong>"{item.groupId.chatName}"</strong>
                                            )}
                                          </p>
                                          <div className="d-flex justify-content-between">
                                            <span>{moment(item?.createdAt).fromNow()}</span>
                                            {item.type === "groupInvite" ? (
                                              <div className="followBtn followBtnSmall">
                                                <Link
                                                  onClick={() =>
                                                    handleJoinGroup(item.groupId?._id, item._id, item.createdBy?._id)
                                                  }
                                                  className={"btn btnColor"}
                                                >
                                                  Accept
                                                </Link>
                                                <Link
                                                  onClick={() => deleteInvitation(item.groupId?._id, item._id)}
                                                  className={"btn btnColor followingBtn"}
                                                >
                                                  Reject
                                                </Link>
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </div>
                                        <div className="dotsNotify text-center">
                                          <img src="/images/icons/notification-circle.svg" alt="close" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            );
                          })}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="profileImage headIcon dropdown">
                <Link data-bs-toggle="dropdown">
                  {/* <img src="/images/user-profile.png" alt="user-profile-image" className="img-fluid user-profile-image" /> */}
                  <ProfileImage
                    url={user?.profile_img}
                    style={{ width: "32px", height: "32px", borderRadius: "30px", objectFit: "cover" }}
                  />
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item dropDownUserProfile">
                      <div className="dropdownProfileOuter">
                        <div className="dropdownProfile">
                          {/* <img src="/images/user-profile.png" alt="profile-image" className="img-fluid profile-image" /> */}
                          <ProfileImage
                            url={user?.profile_img}
                            style={{ width: "32px", height: "32px", borderRadius: "30px", objectFit: "cover" }}
                          />
                          <span className="userOnline" />
                        </div>
                        <div className="dropdownTxt dropdownTxtProfile-custom">
                          <h4>
                            {user?.first_name} {user?.last_name}{" "}
                            {user.role.includes("userPaid") ? <img src="/images/icons/green-tick.svg" alt="green-tick" /> : ""}{" "}
                          </h4>
                          <p>@{user?.user_name}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      View profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/setting/billing">
                      Billing
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/setting/support">
                      Support
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/setting">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {showNotification && <div onClick={() => setShowNotification(false)} className="modal-backdrop show"></div>}
      </header>
      {
        /* 
          {
            !location.pathname.includes("setting") &&
            <div className="topHeaderLeftSec mobileSidebar d-block d-md-none">
                <div className="p-3 pb-0">
                    <SearchBar />
                </div>
            </div>
          } 
        */
      }
    </>
  );
}
export default Header;
