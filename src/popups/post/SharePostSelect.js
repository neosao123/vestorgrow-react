import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import UserFollowerService from "../../services/userFollowerService";
import PostService from "../../services/postService";
import ProfileImage from "../../shared/ProfileImage";
import { Link } from "react-router-dom";
import ChatService from "../../services/chatService";
import UserService from "../../services/UserService";
export default function SharePostSelect({ onClose, post }) {
  const userFollowerServ = new UserFollowerService();
  const postServ = new PostService();
  const serv = new ChatService();
  const userServ = new UserService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [followerList, setFolloweList] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [sharedPost, setSharedPost] = useState(null);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    getFollowerList();
  }, [searchText]);
  useEffect(() => {
    if (window.innerWidth > 768) {
      document.body.style.overflow = "hidden";
      document.body.style.marginRight = "20px";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, []);
  const getFollowerList = async () => {
    try {
      let obj = {
        filter: {
          listType: "follower",
          searchText: searchText,
        },
      };
      let resp = await userFollowerServ.listUser(obj);
      if (resp.data) {
        setFolloweList([...resp.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleSelectUser = async (sharedTo) => {
  //   try {
  //     let sharedPostData = sharedPost;
  //     if (selectedList.length == 0) {
  //       let resp = await postServ.sharePost(post);
  //       if (resp.data) {
  //         sharedPostData = resp.data;
  //         await setSharedPost(resp.data);
  //       }
  //     }
  //     let obj = {
  //       sharedTo: sharedTo,
  //       sharedBy: user._id,
  //       postId: sharedPostData._id,
  //     };
  //     let sharedResp = await postServ.addSelectedUser(obj);
  //     if (sharedResp.data) {
  //       setSelectedList([...selectedList, sharedTo]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const sendPostHandle = async (sharedTo) => {
    try {
      let user = await userServ.getUser(sharedTo);
      if (user.data) {
        let sharedtoUser = [user.data];
        let obj = {
          content: window.location.origin + "/post/" + post._id,
          // file: message.file,
          users: sharedtoUser,
        };
        await serv.composeMsg(obj).then((resp) => {
          if (resp.data) {
            setSelectedList([...selectedList, sharedTo]);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="modal overflowScrollStop modal-custom-zindex-bg"
        style={{ display: "block", background: "rgba(0, 0, 0, 0.35)" }}
      >
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div className="followModel modal-dialog modal-lg">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <div className="followesNav">
                    <ul className="nav nav-pills">
                      <li className="nav-item">
                        <a className="nav-link active" href="javascript:void(0);">
                          Send
                        </a>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      onClose();
                      document.body.style.overflow = "";
                      document.body.style.marginRight = "";
                    }}
                  />
                </div>
                {/* Modal body */}
                <div className="modal-body">
                  <div className="tabSendContent">
                    <div className="followersList">
                      <div className="followSearch">
                        <div className="followSearchInner">
                          <img src="/images/icons/search.svg" alt="search" className="img-fluid" />
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            name="search"
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                          />
                        </div>
                      </div>
                      <div className="followListsInner overflowScrollStop">
                        {followerList &&
                          followerList.map((item, idx) => {
                            let user = item.userId;
                            return (
                              <div className="otherUser" key={idx}>
                                <div className="followOtherUser">
                                  <div
                                    className="followOtherUserPic"
                                    onClick={() => {
                                      onClose();
                                      document.body.style.overflow = "";
                                      document.body.style.marginRight = "";
                                    }}
                                  >
                                    <Link to={"/userprofile/" + user?._id}>
                                      <ProfileImage url={user.profile_img} />
                                    </Link>
                                    {/* <img src="/images/img/profile-image2.png" alt="search" className="img-fluid" /> */}
                                  </div>
                                  <div className="followOtherUserName">
                                    <Link to={"/userprofile/" + user?._id}>
                                      <h5
                                        className="mb-0"
                                        onClick={() => {
                                          onClose();
                                          document.body.style.overflow = "";
                                          document.body.style.marginRight = "";
                                        }}
                                      >
                                        {user.user_name ? `${user.user_name}` : `${user.first_name} ${user.last_name}`}{" "}
                                        {user.role.includes("userPaid") ? (
                                          <img src="/images/icons/green-tick.svg" />
                                        ) : (
                                          ""
                                        )}{" "}
                                      </h5>
                                    </Link>
                                    <p className="mb-0">{user?.title}</p>
                                  </div>
                                </div>
                                <div className="followBtn">
                                  {selectedList.includes(user._id) ? (
                                    <a href="javascript:void(0);" className="btn followingBtn">
                                      Sent
                                    </a>
                                  ) : (
                                    <a
                                      href="javascript:void(0);"
                                      className="btn followerBtn"
                                      onClick={() => sendPostHandle(user._id)}
                                    >
                                      Send
                                    </a>
                                  )}
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
      {/* <div className="modal-backdrop show modal-bdrop-CustomZ-index"></div> */}
    </>
  );
}
