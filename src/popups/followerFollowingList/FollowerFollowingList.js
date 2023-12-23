import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import UserFollowerService from "../../services/userFollowerService";
import ProfileImage from "../../shared/ProfileImage";
import { Link } from "react-router-dom";
import Unfollow from "../unfollow/Unfollow";
import UserService from "../../services/UserService";
export default function FollowerFollowingList({ onClose, post, type }) {
  const userFollowerServ = new UserFollowerService();
  const serv = new UserService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [userType, setUserType] = useState(type);
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showUnfollowPopup, setShowUnfollowPopup] = useState(false);
  const [unfollowUserData, setUnfollowUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getFollowerList();
  }, [userType, searchText]);

  const getFollowerList = async () => {
    setIsLoading(true);
    try {
      let obj = {
        filter: {
          listType: userType,
          searchText: searchText,
        },
      };
      let resp = await userFollowerServ.listUser(obj);
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

  const unfollowUser = async (id, userName) => {
    setUnfollowUserData({ id: id, userName: userName });
    getUserData();
    setShowUnfollowPopup(true);
  };

  const followUser = async (id) => {
    try {
      let obj = { followingId: id };
      await userFollowerServ
        .sendFollowReq(obj)
        .then((resp) => {
          if (resp.data) {
            getFollowerList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
    getUserData();
  };

  const getUserData = async () => {
    setUserList([]);
    try {
      let resp = await serv.getUser(user?._id);
      if (resp.data) {
        setUser({ ...resp.data });
      }
    } catch (err) {
      console.log(err);
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
                          className={"nav-link " + (userType === "follower" ? "active" : "")}
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
                          className={"nav-link " + (userType === "following" ? "active" : "")}
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
                    <div className={"tab-pane " + (userType == "follower" ? "active" : "")}>
                      <div className="followersList">
                        <div className="followSearch">
                          <div className="followSearchInner">
                            <img src="images/icons/search.svg" alt="search" className="img-fluid" />
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
                                <div className="otherUser" key={`follower${idx}`}>
                                  <div className="followOtherUser">
                                    <div className="followOtherUserPic">
                                      <Link to={"/userprofile/" + item.userId?._id}>
                                        <ProfileImage url={item.userId?.profile_img} style={user?.profile_img ? { width: "40px", height: "40px", borderRadius: "20px" } : { borderRadius: "30px" }} />
                                      </Link>
                                    </div>
                                    <div className="followOtherUserName">
                                      <Link to={"/userprofile/" + item.userId?._id}>
                                        <h5 className="mb-0 username-title-custom" title={item?.userId?.user_name}>
                                          {item?.userId?.user_name.length > 17
                                            ? item?.userId?.user_name.slice(0, 17) + "..."
                                            : item?.userId?.user_name}{" "}
                                          {item.userId?.role.includes("userPaid") ? (
                                            <img src="/images/icons/green-tick.svg" alt="green tick" />
                                          ) : (
                                            //   <img src="/images/icons/dot.svg" />
                                            ""
                                          )}
                                        </h5>
                                      </Link>
                                      <p className="mb-0" title={item?.userId?.title}>
                                        {item?.userId?.title?.length > 25
                                          ? item?.userId?.title.slice(0, 25) + "..."
                                          : item?.userId?.title}{" "}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="followBtn">
                                    {item.is_following === "following" ? (
                                      <button
                                        type="button"
                                        onClick={() => unfollowUser(item.userId?._id, item.userId?.user_name)}
                                        className="btn btnColor btnColorBlack"
                                      >
                                        Following
                                      </button>
                                    ) : item.is_following === "requested" ? (
                                      <button
                                        type="button"
                                        className="btn btnColor btnColorBlack"
                                        onClick={() => deleteFollowReq(item.userId?._id)}
                                      >
                                        Requested
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => followUser(item.userId?._id)}
                                        className="btn btnColor"
                                      >
                                        Follow
                                      </button>
                                    )}
                                  </div>
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
                              <img src="images/icons/search.svg" alt="search" className="img-fluid" />
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
                                  <div className="otherUser" key={`following${idx}`}>
                                    <div className="followOtherUser">
                                      <div className="followOtherUserPic">
                                        <Link to={"/userprofile/" + item.followingId?._id}>
                                          <ProfileImage url={item.followingId?.profile_img} style={user?.profile_img ? { width: "40px", height: "40px", borderRadius: "20px" } : { borderRadius: "30px" }} />
                                        </Link>
                                      </div>
                                      <div className="followOtherUserName">
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
                                              <img src="/images/icons/green-tick.svg" alt="green tick" />
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
                                    <div className="followBtn">
                                      <a
                                        href="javascript:void(0);"
                                        onClick={() => unfollowUser(item.followingId?._id, item.followingId?.user_name)}
                                        className="btn followingBtn"
                                      >
                                        Following
                                      </a>
                                    </div>
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
      {showUnfollowPopup && (
        <Unfollow
          onClose={() => {
            setUnfollowUserData(null);
            setShowUnfollowPopup(false);
            getFollowerList();
            getUserData();
          }}
          userData={unfollowUserData}
        />
      )}
      {!showUnfollowPopup && <div className="modal-backdrop show"></div>}
    </>
  );
}
