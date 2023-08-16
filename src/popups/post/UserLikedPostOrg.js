import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import UserFollowerService from "../../services/userFollowerService";
import PostService from "../../services/postService";
import ProfileImage from "../../shared/ProfileImage";
import { Link } from "react-router-dom";
import Unfollow from "../unfollow/Unfollow";
export default function UserLikedPostOrg({ onClose, postId }) {
  const userFollowerServ = new UserFollowerService();
  const postServ = new PostService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showUnfollowPopup, setShowUnfollowPopup] = useState(false);
  const [unfollowUserData, setUnfollowUserData] = useState(null);
  const [followingList, setFollowingList] = useState([]);
  const [requestedList, setRequestedList] = useState([]);
  useEffect(() => {
    getLikedUserList();
  }, [searchText]);

  useEffect(() => {
    if (window.innerWidth > 768) {
      document.body.style.overflow = "hidden";
      document.body.style.marginRight = "20px";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, []);

  useEffect(() => {
    getFollowingList();
    getRequestedList();
  }, []);

  const getLikedUserList = async () => {
    try {
      let obj = {
        filter: {
          postId: postId,
          searchText: searchText,
        },
      };
      let resp = await postServ.likePostList(obj);
      if (resp.data) {
        setUserList([...resp.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };
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
            getLikedUserList();
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

  const getFollowingList = async () => {
    let folwingList = [];
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
        setFollowingList([...folwingList]);
      }
    } catch (error) {
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
      getFollowingList();
      getRequestedList();
    }
  };
  return (
    <>
      <div
        className="modal show modal-custom-zindex-bg"
        style={{ display: "block", background: !showUnfollowPopup ? "rgba(0, 0, 0, 0.35)" : "none" }}
      >
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Reactions</h5>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      document.body.style.overflow = "";
                      document.body.style.marginRight = "";
                    }}
                    className="btn-close"
                  />
                </div>
                {/* Modal body */}
                <div className="modal-body">
                  <div className="">
                    <ul className="nav nav-pills">
                      <li className="nav-item">
                        <a className={"nav-link active"} href="#all">
                          All
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className={"nav-link"} href="#like">
                          <img src="./images/icons/filled-thumbs-up.svg" alt="liked" />
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className={"nav-link"} href="#love">
                          <img src="./images/icons/filled-heart.svg" alt="liked" />
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className={"nav-link"} href="#insight">
                          <img src="./images/icons/filled-insightfull.svg" alt="liked" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content">
                    <div className={"tab-pane active"} id="all">
                      <div className="followersList">
                        <div className="followSearch mt-3">
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
                          {userList.map((item, idx) => {
                            return (
                              <div className="otherUser">
                                <div className="followOtherUser">
                                  <div
                                    className="followOtherUserPic"
                                    onClick={() => {
                                      onClose();
                                      document.body.style.overflow = "";
                                      document.body.style.marginRight = "";
                                    }}
                                  >
                                    {/* <img src="/images/img/profile-image2.png" alt="search" className="img-fluid" /> */}
                                    <Link to={"/userprofile/" + item.createdBy?._id}>
                                      <ProfileImage url={item.createdBy?.profile_img} />
                                    </Link>
                                  </div>
                                  <div className="followOtherUserName">
                                    <Link to={"/userprofile/" + item.createdBy?._id}>
                                      <h5
                                        className="mb-0"
                                        onClick={() => {
                                          onClose();
                                          document.body.style.overflow = "";
                                          document.body.style.marginRight = "";
                                        }}
                                      >
                                        {item.createdBy?.first_name
                                          ? `${item.createdBy.first_name} ${item.createdBy.last_name}`
                                          : item.createdBy.user_name}{" "}
                                        {item.createdBy?.role.includes("userPaid") ? (
                                          <img src="/images/icons/green-tick.svg" />
                                        ) : (
                                          ""
                                        )}{" "}
                                      </h5>
                                    </Link>
                                    <p className="mb-0">{item.createdBy?.title}</p>
                                  </div>
                                </div>
                                {item.createdBy?._id != user?._id && (
                                  <div className="followBtn">
                                    {/* {item.is_following == "following" ? (
                                      <a
                                        href="javascript:void(0);"
                                        onClick={() => unfollowUser(item.createdBy?._id, item.createdBy?.user_name)}
                                        className="btn btnColor"
                                      >
                                        Following
                                      </a>
                                    ) : item.is_following == "requested" ? (
                                      <a href="javascript:void(0);" className="btn btnColor">
                                        Requested
                                      </a>
                                    ) : (
                                      // <a href="javascript:void(0);" onClick={handleUnFollowRequest} className="btn btnColor" >Requested</a> :
                                      <a
                                        href="javascript:void(0);"
                                        onClick={() => followUser(item.createdBy?._id)}
                                        className="btn btnColor"
                                      >
                                        Follow
                                      </a>
                                    )} */}

                                    {followingList.includes(item.createdBy?._id) ? (
                                      <a
                                        href="javascript:void(0);"
                                        onClick={() => unfollowUser(item.createdBy?._id, item.createdBy?.user_name)}
                                        className="btn btnColor btnColorBlack"
                                      >
                                        Following
                                      </a>
                                    ) : requestedList.includes(item.createdBy?._id) ? (
                                      <a
                                        href="javascript:void(0);"
                                        className="btn btnColor btnColorBlack"
                                        onClick={() => deleteFollowReq(item.createdBy?._id)}
                                      >
                                        Requested
                                      </a>
                                    ) : (
                                      // <a href="javascript:void(0);" onClick={handleUnFollowRequest} className="btn btnColor" >Requested</a> :
                                      <a
                                        href="javascript:void(0);"
                                        onClick={() => followUser(item.createdBy?._id)}
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
      {showUnfollowPopup && (
        <div className="show modal-backdrop-custom-zindex-bg">
          <Unfollow
            onClose={() => {
              setUnfollowUserData(null);
              setShowUnfollowPopup(false);
              getLikedUserList();
              getFollowingList();
              getRequestedList();
            }}
            userData={unfollowUserData}
          />
        </div>
      )}
      {/* {!showUnfollowPopup && <div className="modal-backdrop show"></div>} */}
    </>
  );
}
