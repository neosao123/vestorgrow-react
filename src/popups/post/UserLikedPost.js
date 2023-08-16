import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import UserFollowerService from "../../services/userFollowerService";
import PostService from "../../services/postService";
import ProfileImage from "../../shared/ProfileImage";
import { Link } from "react-router-dom";
import Unfollow from "../unfollow/Unfollow";
import "../../assets/reactions-modal.css";
import ReactionFilledIcon from "../../components/ReactionFilledIcon";

export default function UserLikedPost({ onClose, postId }) {
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

  const [reactionCount, setReactionCount] = useState();
  const [likeCount, setLikeCount] = useState();
  const [loveCount, setLoveCount] = useState();
  const [insightCount, setInsightCount] = useState();
  const [activeTab, setActiveTab] = useState("all");

  const [likedUsersList, setLikedUsersList] = useState([]);

  const [lovedUsersList, setLovedUsersList] = useState([]);

  const [insightFullUsersList, setInsightFullUsersList] = useState([]);

  useEffect(() => {
    if (activeTab === "all") {
      getReactedUsersList();
    } else if (activeTab === "like") {
      getLiked();
    } else if (activeTab === "love") {
      getLoved();
    } else {
      getInsightFull();
    }
  }, [activeTab, searchText]);

  useEffect(() => {
    if (window.innerWidth > 768) {
      document.body.style.overflow = "hidden";
      document.body.style.marginRight = "20px";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const getReactedUsersList = async () => {
    try {
      let obj = {
        filter: {
          postId: postId,
          searchText: searchText,
        },
      };
      let resp = await postServ.likePostList(obj);
      if (resp.data) {
        setReactionCount(resp.data.length);
        setLikeCount(resp.likeCount)
        setLoveCount(resp.loveCount)
        setInsightCount(resp.insightCount);
        setUserList([...resp.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getInsightFull = async () => {
    try {
      let obj = {
        filter: {
          postId: postId,
          searchText: searchText,
          type: "insight"
        },
      };
      let resp = await postServ.likePostList(obj);
      if (resp.data) {
        setReactionCount(resp.data.length);
        setLikeCount(resp.likeCount)
        setLoveCount(resp.loveCount)
        setInsightCount(resp.insightCount);
        setInsightFullUsersList([...resp.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLiked = async () => {
    try {
      let obj = {
        filter: {
          postId: postId,
          searchText: searchText,
          type: "like"
        },
      };
      let resp = await postServ.likePostList(obj);
      if (resp.data) {
        setReactionCount(resp.data.length);
        setLikeCount(resp.likeCount)
        setLoveCount(resp.loveCount)
        setInsightCount(resp.insightCount);
        setLikedUsersList([...resp.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLoved = async () => {
    try {
      let obj = {
        filter: {
          postId: postId,
          searchText: searchText,
          type: "love"
        },
      };
      let resp = await postServ.likePostList(obj);
      if (resp.data) {
        setReactionCount(resp.data.length);
        setLikeCount(resp.likeCount)
        setLoveCount(resp.loveCount)
        setInsightCount(resp.insightCount);
        setLovedUsersList([...resp.data]);
      }
    } catch (error) {
      console.log(error);
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
                  <div className="reactions-list-container">
                    <ul className="nav nav-pills">
                      <li className="nav-item">
                        <div className={activeTab === "all" ? "nav-link active" : "nav-link"} onClick={() => {
                          setActiveTab("all");
                          getReactedUsersList();
                        }}>
                          All
                        </div>
                      </li>
                      <li className="nav-item">
                        <div className={activeTab === "like" ? "nav-link active" : "nav-link"} onClick={() => { setActiveTab("like"); getLiked() }}>
                          <img src="/images/icons/filled-thumbs-up.svg" alt="liked" />
                          <span className="ms-2">{likeCount}</span>
                        </div>
                      </li>
                      <li className="nav-item">
                        <div className={activeTab === "love" ? "nav-link active" : "nav-link "} onClick={() => { setActiveTab("love"); getLoved() }}>
                          <img src="/images/icons/filled-heart.svg" alt="love" />
                          <span className="ms-2">{loveCount}</span>
                        </div>
                      </li>
                      <li className="nav-item">
                        <div className={activeTab === "insight" ? "nav-link active" : "nav-link"} onClick={() => { setActiveTab("insight"); getInsightFull() }}>
                          <img src="/images/icons/filled-insightfull.svg" alt="insight" />
                          <span className="ms-2">{insightCount}</span>
                        </div>
                      </li>
                    </ul>
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
                    <div className="tab-content">
                      <div className={activeTab === "all" ? "tab-pane active" : "tab-pane"} id="all">
                        {userList.map((item, idx) => {
                          return (
                            <div className="prf-bx" key={"reacted-user" + idx}>
                              <Link className="me-3" to={"/userprofile/" + item.createdBy?._id} >
                                <img src={item.createdBy?.profile_img !== "" ? item.createdBy?.profile_img : "/images/profile/default-profile.png"} alt={item.user_name} className="prfimg" />
                                <ReactionFilledIcon type={item.type} />
                              </Link>
                              <div className="text-dark">
                                <div className="usrnm">
                                  {item.createdBy?.first_name
                                    ? `${item.createdBy.first_name} ${item.createdBy.last_name}`
                                    : item.createdBy.user_name}{" "}
                                </div>
                                <div className="subtitle">{item.createdBy?.title}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className={activeTab === "like" ? "tab-pane active" : "tab-pane"} id="like">
                        {likedUsersList.map((item, idx) => {
                          return (
                            <div className="prf-bx" key={"reacted-user" + idx}>
                              <Link className="me-3" to={"/userprofile/" + item.createdBy?._id} >
                                <img src={item.createdBy?.profile_img} alt={item.user_name} className="prfimg" />
                                <ReactionFilledIcon type={item.type} />
                              </Link>
                              <div className="text-dark">
                                <div className="usrnm">
                                  {item.createdBy?.first_name
                                    ? `${item.createdBy.first_name} ${item.createdBy.last_name}`
                                    : item.createdBy.user_name}{" "}
                                </div>
                                <div className="subtitle">{item.createdBy?.title}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className={activeTab === "love" ? "tab-pane active" : "tab-pane"} id="love">
                        {lovedUsersList.map((item, idx) => {
                          return (
                            <div className="prf-bx" key={"reacted-user" + idx}>
                              <Link className="me-3" to={"/userprofile/" + item.createdBy?._id} >
                                <img src={item.createdBy?.profile_img} alt={item.user_name} className="prfimg" />
                                <ReactionFilledIcon type={item.type} />
                              </Link>
                              <div className="text-dark">
                                <div className="usrnm">
                                  {item.createdBy?.first_name
                                    ? `${item.createdBy.first_name} ${item.createdBy.last_name}`
                                    : item.createdBy.user_name}{" "}
                                </div>
                                <div className="subtitle">{item.createdBy?.title}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className={activeTab === "insight" ? "tab-pane active" : "tab-pane"} id="insight">
                        {insightFullUsersList.map((item, idx) => {
                          return (
                            <div className="prf-bx" key={"reacted-user" + idx}>
                              <Link className="me-3" to={"/userprofile/" + item.createdBy?._id} >
                                <img src={item.createdBy?.profile_img} alt={item.user_name} className="prfimg" />
                                <ReactionFilledIcon type={item.type} />
                              </Link>
                              <div className="text-dark">
                                <div className="usrnm">
                                  {item.createdBy?.first_name
                                    ? `${item.createdBy.first_name} ${item.createdBy.last_name}`
                                    : item.createdBy.user_name}{" "}
                                </div>
                                <div className="subtitle">{item.createdBy?.title}</div>
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
      </div >
    </>
  );
}
