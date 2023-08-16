import React, { useState, useEffect, useContext } from "react";
import UserFollowerService from "../../services/userFollowerService";
import ProfileImage from "../../shared/ProfileImage";
import ChatService from "../../services/chatService";
import { Link } from "react-router-dom";
export default function GroupMembersList({ onClose, onConfirm, chatId, adminUsers }) {
  const userFollowerServ = new UserFollowerService();
  const chatServ = new ChatService();
  const [userType, setUserType] = useState("follower");
  const [userList, setUserList] = useState([]);
  const [invitedList, setInvitedList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [copiedText, setCopiedText] = useState("");
  const [userDetail, setUserDetail] = useState("");
  const [groupAdmins, setGroupAdmins] = useState(null);

  useEffect(() => {
    setGroupAdmins(adminUsers);
    getChatDetail();
  }, []);

  const getChatDetail = async () => {
    try {
      let resp = await chatServ.getDetailMemberList(chatId);
      if (resp.data) {
        setUserDetail(resp.data);
        setUserList([...resp.data.users]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInvitationList = (id) => {
    if (invitedList.includes(id)) {
      setInvitedList(invitedList.filter((i) => i !== id));
    } else {
      setInvitedList([...invitedList, id]);
    }
  };

  const AdminIcon = () => {
    return (
      <div style={{ background: "#ffffff", color: "#00808b", padding: "5px 15px", borderRadius: "5px", border: "1px solid #00808b", fontWeight: "600", fontSize: "0.8rem" }}>Group Admin</div>
    );
  };

  return (
    <>
      <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.4)" }}>
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div className="followModel modal-dialog modal-lg followModel-inviteCustom">
              <div className="modal-content">
                <div className="modal-header flex-row">
                  <div className="followesNav">
                    <ul className="nav nav-pills">
                      <li className="nav-item">
                        <a
                          className={"nav-link " + (userType === "follower" ? "active" : "")}
                          onClick={() => setUserType("follower")}
                          href="#followers"
                        >
                          Members
                        </a>
                      </li>
                    </ul>
                  </div>
                  {chatId && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + "/groupinvite/" + chatId);
                        setCopiedText(window.location.origin + "/groupinvite/" + chatId);
                        setTimeout(() => setCopiedText(""), 1000);
                      }}
                      className="btn-invite"
                    >
                      <img src="/images/icons/link-connect.svg" className="img-fluid me-2" alt="" />
                      {copiedText !== window.location.origin + "/groupinvite/" + chatId
                        ? "Invite via link"
                        : "Link is copied"}
                      {/* Invite via link */}
                    </button>
                  )}
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
                          {userList
                            .filter((i) => i.user_name.includes(searchText))
                            .map((item, idx) => {
                              console.log(item._id)
                              return (
                                <div className="otherUser">
                                  <div className="followOtherUser">
                                    <div className="followOtherUserPic">
                                      {/* <img src="images/img/profile-image2.png" alt="search" className="img-fluid" /> */}
                                      <Link to={"/userprofile/" + item?._id}>
                                        <ProfileImage url={item?.profile_img} />
                                      </Link>
                                    </div>
                                    <div className="followOtherUserName">
                                      <Link to={"/userprofile/" + item?._id}>
                                        <h5 className="mb-0 username-title-custom">
                                          {item?.user_name ? item?.user_name : `${item?.first_name} ${item?.last_name}`}{" "}
                                          {item?.role.includes("userPaid") ? (
                                            <img src="/images/icons/green-tick.svg" alt="green-tick" />
                                          ) : (
                                            //   <img src="/images/icons/dot.svg" />
                                            ""
                                          )}{" "}
                                        </h5>
                                      </Link>
                                      <p className="mb-0">{item?.title}</p>
                                    </div>
                                  </div>
                                  <div>
                                    {
                                      (adminUsers !== null && adminUsers.indexOf(item._id) > -1) ? <AdminIcon /> : ""
                                    }
                                  </div>
                                  {
                                    /* 
                                      <div className="followBtn">
                                        <a
                                          href="javascript:void(0);"
                                          onClick={() => handleInvitationList(item?._id)}
                                          className={
                                            "btn " + (invitedList.includes(item?._id) ? "followingBtn" : "btnColor")
                                          }
                                        >
                                          Invite
                                        </a>
                                      </div> 
                                    */
                                  }
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
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="postBtn submitHeaderCustom">
                    <button type="button" onClick={onClose} className={"btn btnColor btnColorWhite"}>
                      Back
                    </button>
                    {/* <button onClick={() => onConfirm(invitedList)} className={"btn btnColor "}>
                      Confirm
                    </button> */}
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
