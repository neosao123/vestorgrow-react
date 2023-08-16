import React, { useState, useEffect, useContext } from "react";
import ChatService from "../../services/chatService";
import ProfileImage from "../../shared/ProfileImage";
import { Link } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
export default function GroupList({ onClose, onConfirm, chatId, userData }) {
  const serv = new ChatService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [userType, setUserType] = useState("follower");
  const [userList, setUserList] = useState([]);
  const [invitedList, setInvitedList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [chatList, setChatList] = useState([]);
  const [invitationList, setInvitationList] = useState([]);
  useEffect(() => {
    getChatList();
    getInvitationList();
  }, []);
  
  const getChatList = async () => {
    try {
      let obj = {
        filter: {
          isGroupChat: true,
          user: userData._id,
        },
      };
      // console.log(obj);
      await serv.listAllChat(obj).then((resp) => {
        if (resp.data) {
          // resp.data = resp.data.filter((i) => !i.deleted_for.includes(user._id));
          setChatList([...resp.data]);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  const getInvitationList = async () => {
    try {
      let obj = {
        filter: {
          // isGroupChat: true,
        },
      };
      await serv.listAllInvitation(obj).then((resp) => {
        if (resp.data) {
          // resp.data = resp.data.filter((i) => !i.deleted_for.includes(user._id));
          setInvitationList([...resp.data]);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleJoinGroup = async (groupId) => {
    try {
      let obj = {
        groupId: groupId,
      };
      // console.log(obj);
      await serv.joinGroup(obj).then((resp) => {
        if (resp.message) {
          getChatList();
          getInvitationList();
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
      <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.4)" }}>
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div className="followModel modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="followesNav">
                    <ul className="nav nav-pills">
                      <li className="nav-item">
                        <a className={"nav-link active"} href="#followers">
                          Groups
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
                        <div className="followListsInner">
                          {chatList.map((item, idx) => {
                            let inUserList = item.users.map((i) => i._id);
                            return (
                              <div className="otherUser">
                                <div className="followOtherUser">
                                  <div className="followOtherUserPic"> 
                                    <a>
                                      <ProfileImage url={item.chatLogo} />
                                    </a>
                                  </div>
                                  <div className="followOtherUserName">
                                    <a>
                                      <h5 className="mb-0 username-title-custom">{item.chatName}</h5>
                                    </a>
                                    <p className="mb-0">{item.users.length} members</p>
                                  </div>
                                </div>
                                <div className="followBtn">
                                  {userData._id !== user._id ? (
                                    inUserList.includes(user._id) ? (
                                      <a
                                        href="javascript:void(0);"
                                        // onClick={() => handleInvitationList(item.userId?._id)}
                                        className={"btn followingBtn"}
                                      >
                                        Member
                                      </a>
                                    ) : (
                                      <a
                                        href="javascript:void(0);"
                                        onClick={() => handleJoinGroup(item?._id)}
                                        className={"btn btnColor"}
                                      >
                                        Join
                                      </a>
                                    )
                                  ) : (
                                    <a data-bs-toggle="dropdown" href="javascript:void(0);">
                                      <svg
                                        width="20"
                                        height="5"
                                        viewBox="0 0 20 5"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <ellipse cx="2.30769" cy="2.5" rx="2.30769" ry="2.5" fill="#465D61" />
                                        <ellipse cx="10.0001" cy="2.5" rx="2.30769" ry="2.5" fill="#465D61" />
                                        <ellipse cx="17.6925" cy="2.5" rx="2.30769" ry="2.5" fill="#465D61" />
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {invitationList.map((item, idx) => {
                            return (
                              <div className="otherUser">
                                <div className="followOtherUser">
                                  <div className="followOtherUserPic">
                                    {/* <img src="images/img/profile-image2.png" alt="search" className="img-fluid" /> */}
                                    <a>
                                      <ProfileImage url={item.groupId?.chatLogo} />
                                    </a>
                                  </div>
                                  <div className="followOtherUserName">
                                    <a>
                                      <h5 className="mb-0 username-title-custom">{item.groupId?.chatName}</h5>
                                    </a>
                                    <p className="mb-0">{item?.groupId?.users?.length} members</p>
                                  </div>
                                </div>
                                <div className="followBtn">
                                  <a
                                    href="javascript:void(0);"
                                    onClick={() => handleJoinGroup(item.groupId?._id)}
                                    className={
                                      "btn " + (invitedList.includes(item.userId?._id) ? "followingBtn" : "btnColor")
                                    }
                                  >
                                    Join
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
    </>
  );
}
