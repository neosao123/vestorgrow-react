import React, { useState, useEffect, useContext } from "react";
import UserFollowerService from "../../services/userFollowerService";
import ProfileImage from "../../shared/ProfileImage";
import { Link } from "react-router-dom";
import ChatService from "../../services/chatService";


const chatServ = new ChatService();

export default function InviteMembers({ onClose, onConfirm, chatId, existingUser }) {
  const userFollowerServ = new UserFollowerService();
  const [userType, setUserType] = useState("follower");
  const [userList, setUserList] = useState([]);
  const [invitedList, setInvitedList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [copiedText, setCopiedText] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [chatMembers, setChatMembers] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    getFollowerList();
    getChatMembers();
  }, [userType, searchText]);

  const getChatMembers = async () => {
    setUserList([]);
    try {
      let resp = await chatServ.getChatMembers(chatId);
      if (resp.data) {
        setChatMembers([...resp.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowerList = async () => {
    setUserList([]);
    setShowLoading(true);
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
          setShowLoading(false);
          setUserList([...resp.data]);
        }, 2000);
      } else {
        setTimeout(() => {
          setShowLoading(false);
        }, 2000);
      }
    } catch (error) {
      setShowLoading(false);
      console.log(error);
    }
  };

  const handleInvitationList = (id) => {
    if (invitedList.includes(id)) {
      setInvitedList(invitedList.filter((i) => i !== id));
      setIsClicked(false)
    } else {
      setInvitedList([...invitedList, id]);
      setIsClicked(false)
    }
  };

  const Loading = () => {
    return (
      <div className="d-flex align-items-center justify-content-center flex-column">
        <i className="fa fa-2x fa-circle-o-notch fa-spin vs-color"></i>  <span>Loading...</span>
      </div>
    );
  }

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
                          Followers
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={"nav-link " + (userType === "following" ? "active" : "")}
                          onClick={() => setUserType("following")}
                          href="#following"
                        >
                          Following
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
                    <div className={"tab-pane " + (userType === "follower" ? "active" : "")}>
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
                          {(showLoading === true) ? <Loading /> : ""}
                          {userList.map((item, idx) => {
                            return (
                              <div className="otherUser">
                                <div className="followOtherUser">
                                  <div className="followOtherUserPic">
                                    {/* <img src="images/img/profile-image2.png" alt="search" className="img-fluid" /> */}
                                    <Link to={"/userprofile/" + item.userId?._id}>
                                      <ProfileImage url={item.userId?.profile_img} />
                                    </Link>
                                  </div>
                                  <div className="followOtherUserName">
                                    <Link to={"/userprofile/" + item.userId?._id}>
                                      <h5 className="mb-0 username-title-custom">
                                        {item.userId?.user_name
                                          ? item.userId.user_name
                                          : `${item.userId.first_name} ${item.userId.last_name}`}{" "}
                                        {item.userId?.role.includes("userPaid") ? (
                                          <img src="/images/icons/green-tick.svg" alt="green-tick" />
                                        ) : (
                                          //   <img src="/images/icons/dot.svg" />
                                          ""
                                        )}{" "}
                                      </h5>
                                    </Link>
                                    <p className="mb-0">{item.userId?.title}</p>
                                  </div>
                                </div>
                                <div className="followBtn">
                                  {existingUser && existingUser.includes(item.userId?._id) ? (
                                    <a
                                      href="javascript:void(0);"
                                      // onClick={() => handleInvitationList(item.userId?._id)}
                                      className={"btn followingBtn"}
                                    >
                                      Member
                                    </a>
                                  ) : (
                                    <>
                                      {!isClicked && <a
                                        href="javascript:void(0);"
                                        onClick={() => { handleInvitationList(item.userId?._id); isClicked(true) }}
                                        className={
                                          "btn " + (invitedList.includes(item.userId?._id) ? "followingBtn" : "btnColor")
                                        }
                                      >
                                        Invite
                                      </a>}
                                      {isClicked && <a
                                        href="javascript:void(0);"

                                        className={
                                          "btn " + (invitedList.includes(item.userId?._id) ? "followingBtn" : "btnColor")
                                        }
                                      >
                                        ...Loading
                                      </a>}
                                    </>

                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className={"tab-pane " + (userType == "following" ? "active" : "")}>
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
                            {(showLoading === true) ? <Loading /> : ""}
                            {userList.map((item, idx) => {
                              return (
                                <div className="otherUser">
                                  <div className="followOtherUser">
                                    <div className="followOtherUserPic">
                                      <Link to={"/userprofile/" + item.followingId?._id}>
                                        <ProfileImage url={item.followingId?.profile_img} />
                                      </Link>
                                    </div>
                                    <div className="followOtherUserName">
                                      <Link to={"/userprofile/" + item.followingId?._id}>
                                        <h5 className="mb-0 username-title-custom">
                                          {item.followingId?.user_name
                                            ? item.followingId.user_name
                                            : `${item.followingId.first_name} ${item.followingId.last_name}`}{" "}
                                          {item.followingId?.role.includes("userPaid") ? (
                                            <img src="/images/icons/green-tick.svg" />
                                          ) : (
                                            // <img src="/images/icons/dot.svg" />
                                            ""
                                          )}{" "}
                                        </h5>
                                      </Link>
                                      <p className="mb-0">{item.followingId?.title}</p>
                                    </div>
                                  </div>
                                  <div className="followBtn">
                                    {/* className="btn followingBtn" */}
                                    {existingUser && existingUser.includes(item.followingId?._id) ? (
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
                                        onClick={() => handleInvitationList(item.followingId?._id)}
                                        className={
                                          "btn " +
                                          (invitedList.includes(item.followingId?._id) ? "followingBtn" : "btnColor")
                                        }
                                      >
                                        Invite
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
                  <div className="postBtn submitHeaderCustom mt-3">
                    <button type="button" onClick={onClose} className={"btn btnColor btnColorWhite"}>
                      Back
                    </button>
                    <button onClick={() => onConfirm(invitedList)} className={"btn btnColor "}>
                      Confirm
                    </button>
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
