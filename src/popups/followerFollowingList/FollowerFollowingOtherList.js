import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import UserFollowerService from "../../services/userFollowerService";
import ProfileImage from "../../shared/ProfileImage";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService";
import Unfollow from "../unfollow/Unfollow";

const FollowerFollowingOtherList = ({ onClose, type, dataId }) => {
  const userFollowerServ = new UserFollowerService();
  const serv = new UserService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [userType, setUserType] = useState(type);
  const [userList, setUserList] = useState([]);
  const [showUnfollowPopup, setShowUnfollowPopup] = useState(false);
  const [unfollowUserData, setUnfollowUserData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [followingList, setFollowingList] = useState([]);
  const [requestedList, setRequestedList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setUserList([]);
    getFollowerList();
  }, [userType, searchText]);

  useEffect(() => {
    getFollowingList();
    getRequestedList();
  }, []);

  const unfollowUser = async (id, userName) => {
    setUnfollowUserData({ id: id, userName: userName });
    setShowUnfollowPopup(true);
  };

  const followUser = async (id) => {
    try {
      let obj = { followingId: id };
      await userFollowerServ
        .sendFollowReq(obj)
        .then((resp) => {
          if (resp.data) {
            getFollowingList();
            getRequestedList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getFollowerList = async () => {
    setIsLoading(true);
    try {
      let obj = {
        filter: {
          listType: userType,
          searchText: searchText,
        },
      };
      let resp = await userFollowerServ.listOtherUser(obj, dataId);
      // console.log("123123121", resp);
      if (resp.data) {
        setTimeout(() => {
          setUserList([...resp.data]);
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
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

  const getFollowingList = async () => {
    let folwingList = [];
    setIsLoading(true);
    try {
      let obj = {
        filter: {
          listType: "following",
          searchText: searchText,
        },
      };
      let resp = await userFollowerServ.listUser(obj);
      if (resp.data) {
        resp.data.map((item) => {
          folwingList.push(item?.followingId?._id);
        });
        setTimeout(() => {
          setFollowingList([...folwingList]);
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getRequestedList = async () => {
    let reqUserList = [];
    try {
      let resp = await userFollowerServ.listSentFollowReq();
      if (resp.data) {
        resp.data.map((item) => {
          reqUserList.push(item?.followingId);
        });
        setRequestedList([...reqUserList]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFollowReq = async (id) => {
    let resp = await userFollowerServ.deleteFollowReq({
      userId: user._id,
      followingId: id,
    });
    if (resp) {
      getFollowerList();
      getUserData();
      getFollowingList();
      getRequestedList();
    }
  };

  const Loading = () => {
    return (
      <div className="d-flex align-items-center justify-content-center flex-column">
        <i className="fa fa-2x fa-circle-o-notch fa-spin vs-color"></i> <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="modal show" style={{ display: "block" }}>
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div className="followModel modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="followesNav">
                    <ul className="nav nav-pills">
                      <li className="nav-item">
                        <a
                          className={"nav-link " + (userType == "follower" ? "active" : "")}
                          onClick={() => {
                            setUserList([]);
                            setUserType("follower");
                          }}
                          href="#followers"
                        >
                          Followers
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={"nav-link " + (userType == "following" ? "active" : "")}
                          onClick={() => {
                            setUserList([]);
                            setUserType("following");
                          }}
                          href="#following"
                        >
                          Following
                        </a>
                      </li>
                    </ul>
                  </div>
                  <button type="button" onClick={onClose} className="btn-close" />
                </div>
                {/* Modal body */}
                <div className="modal-body">
                  <div className="tab-content">
                    <div className={"tab-pane " + (userType === "follower" ? "active" : "")}>
                      <div className="followersList">
                        <div className="followSearch">
                          <div className="followSearchInner">
                            <img src="/images/icons/search.svg" alt="search" className="img-fluid" />
                            <input
                              type="text"
                              onChange={(e) => setSearchText(e.target.value)}
                              value={searchText}
                              className="form-control"
                              placeholder="Search"
                              name="search"
                            />
                          </div>
                        </div>
                        <div className="followListsInner">
                          {isLoading ? <Loading /> : ""}
                          {userType === "follower" && userList.length > 0 &&
                            userList.map((item, idx) => {
                              return (
                                <div className="otherUser">
                                  <div className="followOtherUser">
                                    <div className="followOtherUserPic" onClick={onClose}>
                                      {/* <img src="images/img/profile-image2.png" alt="search" className="img-fluid" /> */}
                                      <Link to={"/userprofile/" + item.userId?._id}>
                                        <ProfileImage url={item.userId?.profile_img} />
                                      </Link>
                                    </div>
                                    <div className="followOtherUserName" onClick={onClose}>
                                      <Link to={"/userprofile/" + item.userId?._id}>
                                        <h5 className="mb-0 username-title-custom" title={item?.userId?.user_name}>
                                          {/* {item.userId?.user_name
                                          ? item.userId.user_name
                                          : `${item.userId.first_name} ${item.userId.last_name}`}{" "} */}
                                          {item?.userId?.user_name.length > 17
                                            ? item?.userId?.user_name.slice(0, 17) + "..."
                                            : item?.userId?.user_name}{" "}
                                          {item.userId?.role.includes("userPaid") ? (
                                            <img src="/images/icons/green-tick.svg" alt="green-tick" />
                                          ) : (
                                            //   <img src="/images/icons/dot.svg" />
                                            ""
                                          )}{" "}
                                        </h5>
                                      </Link>
                                      <p className="mb-0" title={item?.userId?.title}>
                                        {/* {item.userId?.title}  */}
                                        {item?.userId?.title?.length > 25
                                          ? item?.userId?.title.slice(0, 25) + "..."
                                          : item?.userId?.title}{" "}
                                      </p>
                                    </div>
                                  </div>
                                  {item?.userId?._id !== user?._id && (
                                    <div className="followBtn">
                                      {followingList.includes(item?.userId?._id) ? (
                                        <Link
                                          onClick={() => unfollowUser(item?.userId?._id, item?.userId?.user_name)}
                                          className="btn btnColor btnColorBlack"
                                        >
                                          Following
                                        </Link>
                                      ) : requestedList.includes(item?.userId?._id) ? (
                                        <Link
                                          className="btn btnColor btnColorBlack"
                                          onClick={() => deleteFollowReq(item?.userId?._id)}
                                        >
                                          Requested
                                        </Link>
                                      ) : (
                                        // <a href="javascript:void(0);" onClick={handleUnFollowRequest} className="btn btnColor" >Requested</a> :
                                        <Link
                                          onClick={() => followUser(item?.userId?._id)}
                                          className="btn btnColor"
                                        >
                                          Follow
                                        </Link>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <div className={"tab-pane " + (userType === "following" ? "active" : "")}>
                      <div className="followingList">
                        <div className="followersList">
                          <div className="followSearch">
                            <div className="followSearchInner">
                              <img src="/images/icons/search.svg" alt="search" className="img-fluid" />
                              <input
                                type="text"
                                onChange={(e) => setSearchText(e.target.value)}
                                value={searchText}
                                className="form-control"
                                placeholder="Search"
                                name="search"
                              />
                            </div>
                          </div>
                          <div className="followListsInner">
                            {isLoading ? <Loading /> : ""}
                            {userType === "following" && userList.length > 0 &&
                              userList.map((item, idx) => {
                                return (
                                  <div className="otherUser">
                                    <div className="followOtherUser">
                                      <div className="followOtherUserPic" onClick={onClose}>
                                        <Link to={"/userprofile/" + item.followingId?._id}>
                                          <ProfileImage url={item.followingId?.profile_img} />
                                        </Link>
                                      </div>
                                      <div className="followOtherUserName" onClick={onClose}>
                                        <Link to={"/userprofile/" + item.followingId?._id}>
                                          <h5
                                            className="mb-0 username-title-custom"
                                            title={item?.followingId?.user_name}
                                          >
                                            {/* {item.followingId?.user_name
                                            ? item.followingId.user_name
                                            : `${item.followingId.first_name} ${item.followingId.last_name}`}{" "} */}
                                            {item?.followingId?.user_name.length > 17
                                              ? item?.followingId?.user_name.slice(0, 17) + "..."
                                              : item?.followingId?.user_name}{" "}
                                            {item.followingId?.role.includes("userPaid") ? (
                                              <img src="/images/icons/green-tick.svg" alt="" />
                                            ) : (
                                              // <img src="/images/icons/dot.svg" />
                                              ""
                                            )}
                                          </h5>
                                        </Link>
                                        <p className="mb-0" title={item?.followingId?.title}>
                                          {/* {item.followingId?.title}{" "} */}
                                          {item?.followingId?.title?.length > 25
                                            ? item?.followingId?.title.slice(0, 25) + "..."
                                            : item?.followingId?.title}
                                        </p>
                                      </div>
                                    </div>
                                    {item?.followingId?._id !== user?._id && (
                                      <div className="followBtn">
                                        {followingList.includes(item?.followingId?._id) ? (
                                          <Link
                                            onClick={() =>
                                              unfollowUser(item?.followingId?._id, item?.followingId?.user_name)
                                            }
                                            className="btn btnColor btnColorBlack"
                                          >
                                            Following
                                          </Link>
                                        ) : requestedList.includes(item?.followingId?._id) ? (
                                          <Link
                                            className="btn btnColor btnColorBlack"
                                            onClick={() => deleteFollowReq(item?.followingId?._id)}
                                          >
                                            Requested
                                          </Link>
                                        ) : (
                                          // <a href="javascript:void(0);" onClick={handleUnFollowRequest} className="btn btnColor" >Requested</a> :
                                          <a
                                            href="javascript:void(0);"
                                            onClick={() => followUser(item?.followingId?._id)}
                                            className="btn btnColor"
                                          >
                                            Follow
                                          </a>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {<div className="modal-backdrop show" onClick={onClose}></div>}
      {showUnfollowPopup && (
        <Unfollow
          onClose={() => {
            setUnfollowUserData(null);
            setShowUnfollowPopup(false);
            getFollowingList();
            getRequestedList();
          }}
          userData={unfollowUserData}
        />
      )}
    </>
  );
};

export default FollowerFollowingOtherList;
