import React, { useEffect, useState, useContext } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useParams } from "react-router-dom";
import ChatService from "../../../services/chatService";
import ProfileImage from "../../../shared/ProfileImage";
import GlobalContext from "../../../context/GlobalContext";
import moment from "moment";
import io from "socket.io-client";
import ChatMsgTimeStamp from "../../../components/ChatMsgTimeStamp";
// import ComposeMessage from "../../../popups/message/ComposeMessage";
import CreateGroup from "../../../popups/groupChat/CreateGroup";
import SentMessage from "../../../popups/message/SentMessage";
import DeleteMessage from "../../../popups/message/DeleteMessage";
import BlockUser from "../../../popups/user/BlockUser";
import DeleteChat from "../../../popups/message/DeleteChat";
import ChatMessage from "./ChatMessage";
import ImageCarousel from "../../../popups/imageCarousel/ImageCarousel";

const serv = new ChatService();
let socket;
let chatCompare = [];
export default function GroupChat({
  showCreateGroup,
  setShowCreateGroup,
  setShowGroupInfo,
  setShowDeleteGroup,
  setMediaFiles,
  groupChatRerendered,
  setGroupChat,
  groupChat,
}) {
  const params = useParams();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [groupJoinedByNoti, setGroupJoinedByNoti] = globalCtx.groupJoinedByNoti;
  const [users, setUsers] = useState([]);
  const [unreadMsgCount, setUnreadMsgCount] = globalCtx.unreadMsgCount;
  const [getMessageData, setGetMessageData] = globalCtx.getMessageData;
  const [groupExecutionSuccess, setGroupExecutionSuccess] = globalCtx.groupExecutionSuccess;
  const [chatList, setChatList] = useState([]);
  const [invitationList, setInvitationList] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [chatName, setChatName] = useState(null);
  const [groupAuther, setGroupAuther] = useState(false);
  const [groupAdmin, setGroupAdmin] = useState(false);
  const [groupAdminList, setGroupAdminList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState({});
  const [latestMsgList, setLatestMsgList] = useState({});
  const [showMsg, setShowMsg] = useState(false);
  const [searchTxt, setSearchTxt] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [activeBtn, setActiveBtn] = useState(false);
  const [activeGroupList, setActiveGroupList] = useState([]);
  const [message, setMessage] = useState({
    content: "",
    file: "",
    sender: user._id,
  });
  // const [getMessageData, setGetMessageData] = useState([]);
  // const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSentMsg, setShowSentMsg] = useState(false);
  const [groupChatRerender, setGroupChatRerender] = useState(groupChatRerendered);
  useEffect(() => {
    getChatList();
    getInvitationList();
    setShowMsg(false);
  }, [groupExecutionSuccess, groupChatRerender, groupJoinedByNoti]);
  useEffect(() => {
    if (searchTxt !== "") {
      getSuggestionList();
    }
  }, [searchTxt]);
  useEffect(() => {
    socket = io(process.env.REACT_APP_API_BASEURL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
  }, []);
  useEffect(() => {
    for (const item in unreadCount) {
      if (getMessageData.filter((i) => i.id === item).length > 0) {
        setUnreadCount({ ...unreadCount, [item]: 0 });
      }
    }
  }, [JSON.stringify(getMessageData)]);
  useEffect(() => {
    var objDiv = document.getElementById("messagesEndRefGroup");
    if (objDiv) {
      objDiv.scrollTop = objDiv?.scrollHeight;
    }
  }, [messageList]);
  useEffect(() => {
    socket.on("messageRecieved", (newMessage) => {
      // for (const item in latestMsgList) {
      //   if (item == newMessage.chat) {
      //     setLatestMsgList({ ...latestMsgList, [item]: newMessage });
      //   }
      // }
      if (
        !chatCompare || // if chat is not selected or doesn't match current chat
        !chatCompare.includes(newMessage.chat)
      ) {
        for (const item in unreadCount) {
          if (item == newMessage.chat) {
            setUnreadCount({ ...unreadCount, [item]: unreadCount[item] + 1 });
          }
        }
        //     if (!notification.includes(newMessageRecieved)) {
        //       setNotification([newMessageRecieved, ...notification]);
        //       setFetchAgain(!fetchAgain);
        //     }
      } else {
        setMessageList([...messageList, newMessage]);
      }
    });
    let count = 0;
    for (const item in unreadCount) {
      count += unreadCount[item];
    }
    if (groupChat !== count) {
      // setUnreadMsgCount({ ...unreadMsgCount, groupChat: count });
      setGroupChat(count);
    }
  });
  // console.log("hiii", messageList);
  const getChatList = async () => {
    try {
      let obj = {
        filter: {
          isGroupChat: true,
        },
      };
      await serv.listAllChat(obj).then((resp) => {
        if (resp.data) {
          resp.data = resp.data.filter((i) => !i.deleted_for.includes(user._id));
          setChatList([...resp.data]);
          let unreadCountList = unreadCount;
          let latestMsgListTemp = latestMsgList;
          resp.data.map((item) => {
            unreadCountList[item._id] = item.unreadCount;
            latestMsgListTemp[item._id] = item.latestMessage;
          });
          setUnreadCount(unreadCountList);
          setLatestMsgList(latestMsgListTemp);
          // resp.data[0].users.forEach(element => {
          //     if (element._id !== user._id) {
          //         getMessage(resp.data[0]._id, element, resp.data[0].users)
          //     }
          // });
          if (groupJoinedByNoti !== "" && groupJoinedByNoti !== " ") {
            let tempData = resp.data.filter((i) => i._id == groupJoinedByNoti);
            tempData[0].users.forEach((element) => {
              if (element._id !== user._id) {
                getMessage(
                  tempData[0]._id,
                  element,
                  resp.data[0].users,
                  tempData[0].chatName,
                  tempData[0].createdBy == user._id,
                  tempData[0].groupAdmin?.includes(user._id),
                  tempData[0].groupAdmin
                );
                setShowMsg(true);
              }
            });
          }
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
  const getMessage = async (id, oUser, users, chatName, isGroupAuth, isGroupAdmin, groupAdmin) => {
    // if (getMessageData.findIndex((i) => i.id == id) == -1) {
    //   if (getMessageData.length > 2) {
    //     let msgData = getMessageData;
    //     msgData.shift();
    //     setGetMessageData([...msgData, { id, oUser, users }]);
    //   } else {
    //     setGetMessageData([...getMessageData, { id, oUser, users }]);
    //   }
    // }
    // setMUser(oUser);
    setChatId(id);
    setGroupAuther(isGroupAuth);
    setGroupAdmin(isGroupAdmin);
    setGroupAdminList(groupAdmin);
    setChatName(chatName);
    chatCompare = [...chatCompare, id];
    setUsers([...users]);
    setUnreadCount({ ...unreadCount, [id]: 0 });
    socket.emit("joinChat", id);
    try {
      let obj = {
        filter: {
          chat: id,
        },
      };
      await serv.listAllMessage(obj).then((resp) => {
        if (resp.data) {
          setMessageList([...resp.data]);
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
      await serv.joinGroup(obj).then((resp) => {
        if (resp.message) {
          setActiveGroupList([...activeGroupList, groupId]);
          setTimeout(() => {
            getChatList();
            getInvitationList();
            // setActiveGroupList([]);
          }, 2000);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSendRequest = async (groupId) => {
    try {
      let obj = {
        groupId: groupId,
      };
      await serv.userInvitation(obj).then((resp) => {
        if (resp.message) {
          setActiveGroupList([...activeGroupList, groupId]);
          setTimeout(() => {
            getChatList();
            getInvitationList();
            // setActiveGroupList([]);
          }, 2000);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  // const changeDate = (date) => {
  //     setDate(date)
  // }
  // useEffect(() => {
  // $('html').click(function (e) {
  //     if (!$(e.target).hasClass('emojiPicker')) {
  //         setShowEmoji(false)
  //     }
  // });
  // document.body.addEventListener('click', () => setShowEmoji(false), true);
  // })
  const sendMessage = async () => {
    setActiveBtn(true);
    setShowEmoji(false);
    let obj = message;
    obj.chat = chatId;
    if (message.content.trim() || message.file) {
      const formData = new FormData();
      formData.append("content", message.content);
      formData.append("chat", chatId);
      formData.append("sender", message.sender);
      if (message.file !== "") {
        formData.append("file", message.file);
      }
      try {
        await serv.createMessage(formData).then((resp) => {
          if (resp.data) {
            setMessage({
              content: "",
              file: "",
              sender: user._id,
            });
            let payload = { ...resp.data, users: users, sender: user };
            setMessageList([...messageList, { ...resp.data, sender: user }]);
            socket.emit("newMessage", payload);
            for (const item in latestMsgList) {
              if (item === payload.chat) {
                setLatestMsgList({ ...latestMsgList, [item]: payload });
              }
            }
          } else {
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      setMessage({
        content: "",
        file: "",
        sender: user._id,
      });
    }
    setActiveBtn(false);
  };
  const getSuggestionList = async () => {
    try {
      let obj = {
        filter: {
          searchText: searchTxt,
        },
      };
      await serv.listAllGroupSuggestion(obj).then((resp) => {
        if (resp.data) {
          setSearchList([...resp.data]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleLeaveGroup = async (groupId) => {
    try {
      let obj = {
        groupId: groupId,
      };
      await serv.leaveGroup(obj).then((resp) => {
        if (resp.message) {
          setShowMsg(false);
          setGroupChatRerender(!groupChatRerender);
        }
        // console.log(resp);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveFromGroup = async (groupId, userId) => {
    try {
      let obj = {
        groupId: groupId,
        userId: userId,
      };
      await serv.removeFromGroup(obj).then((resp) => {
        if (resp.message) {
          setShowMsg(false);
          setGroupChatRerender(!groupChatRerender);
        }
        // console.log(resp);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleMakeGroupAdmin = async (groupId, userId) => {
    try {
      let obj = {
        groupId: groupId,
        userId: userId,
      };
      await serv.makeAdmin(obj).then((resp) => {
        if (resp.message) {
          setShowMsg(false);
        }
        // console.log(resp);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div id="feedChat" className="feedChatUser">
        <div className="chatBoxGroupBottom">
          {!showMsg ? (
            <div className="feedChatHeading ">
              <div className="d-flex mb-3 d-flex-Custom">
                <h5 className="mb-0">Group Chat</h5>
                {/* <div className="messageChatLeftHeadIcon ms-auto" onClick={() => setShowCreateGroup(!showCreateGroup)}>
                  <img src="/images/icons/group-plus.svg" alt="compose-button" className="img-fluid composeButton" />
                </div> */}
                <div className="messageChatLeftHeadIcon ms-auto" onClick={() => setShowCreateGroup(!showCreateGroup)}>
                  {/* <div className="messageChatLeftHeadIcon ms-auto"> */}
                  <img
                    src="/images/icons/compose-button.svg"
                    alt="compose-button"
                    className="img-fluid composeButton"
                  />
                </div>
              </div>
              <div className="inputGroup inputGroupCustom">
                <img src="/images/icons/search.svg" alt="search-icon" className="img-fluid" />
                <input
                  type="text"
                  value={searchTxt}
                  className="form-control"
                  placeholder="Search groups"
                  onChange={(e) => setSearchTxt(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="feedChatHeading feedChatHeading-customAlign ">
              <div className="d-flex mb-2">
                <img
                  src="/images/icons/arrow_forward_24px.svg"
                  className="me-2"
                  onClick={() => {
                    setShowMsg(false);
                    chatCompare = [];
                  }}
                  alt=""
                />
                <h5 className="mb-0" title={chatName}>
                  {chatName.length > 36 ? chatName.slice(0, 36) + "..." : chatName}
                </h5>

                <div className="messageChatLeftHeadIcon ms-auto">
                  {/* <div className="messageChatLeftHeadIcon ms-auto"> */}
                  <a data-bs-toggle="dropdown" href="javascript:void(0);">
                    <svg width="20" height="5" viewBox="0 0 20 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <ellipse cx="2.30769" cy="2.5" rx="2.30769" ry="2.5" fill="#465D61" />
                      <ellipse cx="10.0001" cy="2.5" rx="2.30769" ry="2.5" fill="#465D61" />
                      <ellipse cx="17.6925" cy="2.5" rx="2.30769" ry="2.5" fill="#465D61" />
                    </svg>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-customGroupChat">
                    <li>
                      <a
                        className="dropdown-item"
                        href="javascript:void(0);"
                        onClick={() => {
                          setShowGroupInfo(chatId);
                        }}
                      >
                        <img src="/images/icons/eye.svg" className="img-fluid me-2" alt="" />
                        View group info
                      </a>
                    </li>
                    <li>
                      {groupAuther ? (
                        <a
                          className="dropdown-item"
                          href="javascript:void(0);"
                          onClick={() => {
                            setShowDeleteGroup({ _id: chatId, chatName: chatName });
                          }}
                        >
                          <img src="/images/icons/users-alt.svg" className="img-fluid me-2" />
                          Delete group
                        </a>
                      ) : (
                        <a
                          className="dropdown-item"
                          href="javascript:void(0);"
                          onClick={() => {
                            handleLeaveGroup(chatId);
                          }}
                        >
                          <img src="/images/icons/log-out.svg" className="img-fluid me-2" />
                          Leave group
                        </a>
                      )}
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="javascript:void(0);"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(window.location.origin + "/groupinvite/" + chatId);
                          setCopiedText(window.location.origin + "/groupinvite/" + chatId);
                          setTimeout(() => {
                            // document.getElementsByClassName("dropdown-menu-customGroupChat").remov
                            setCopiedText("");
                            Array.from(document.querySelectorAll(".dropdown-menu-customGroupChat")).forEach((el) =>
                              el.classList.remove("show")
                            );
                          }, 1000);
                        }}
                      >
                        <img src="/images/icons/link-connect.svg" className="img-fluid me-2" />
                        {copiedText !== window.location.origin + "/groupinvite/" + chatId
                          ? "Invite via link"
                          : "Link is copied"}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          <div className="feedChatUserMsgGroup">
            {!showMsg ? (
              searchTxt === "" ? (
                <div className="allFeedUser allFeedUserCustom">
                  {chatList.map((item, idx) => {
                    let oUser;
                    item.users.forEach((element) => {
                      if (element._id !== user._id) {
                        oUser = element;
                      }
                    });
                    return (
                      <div className="feedUserChat" key={"fuc" + idx}>
                        <a href="javascript:void(0);" className="userFeedLink userFeedLink-customMain">
                          <div
                            className="FeedUserChatProfile"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowGroupInfo(item._id);
                            }}
                          >
                            <ProfileImage url={item.chatLogo} />
                            {/* <img src="/images/img/profile-image2.png" alt="profile-img" className="img-fluid" /> */}
                          </div>
                          <div className="FeedUserChatHead">
                            <div className="FeedUserChatName d-flex justify-content-between">
                              <h6
                                className="mb-0"
                                onClick={() => {
                                  getMessage(
                                    item._id,
                                    oUser,
                                    item.users,
                                    item.chatName,
                                    item?.createdBy == user._id,
                                    item?.groupAdmin?.includes(user._id),
                                    item?.groupAdmin
                                  );
                                  setShowMsg(true);
                                }}
                              >
                                {/* {item.chatName} */}
                                {item?.chatName.length > 24 ? item?.chatName.slice(0, 24) + "..." : item?.chatName}
                              </h6>
                              <div className="feedChatHeadRight">
                                <a data-bs-toggle="dropdown" className="dot-center" href="javascript:void(0);">
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
                                <ul className="dropdown-menu dropdown-menu-customGroupChat">
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="javascript:void(0);"
                                      onClick={() => {
                                        setShowGroupInfo(item._id);
                                      }}
                                    >
                                      <img src="/images/icons/eye.svg" className="img-fluid me-2" />
                                      View group info
                                    </a>
                                  </li>
                                  <li>
                                    {item?.createdBy == user._id ? (
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                        onClick={() => {
                                          setShowDeleteGroup({ _id: item._id, chatName: item.chatName });
                                        }}
                                      >
                                        <img src="/images/icons/users-alt.svg" className="img-fluid me-2" />
                                        Delete group
                                      </a>
                                    ) : (
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                        onClick={() => {
                                          handleLeaveGroup(item._id);
                                        }}
                                      >
                                        <img src="/images/icons/log-out.svg" className="img-fluid me-2" />
                                        Leave group
                                      </a>
                                    )}
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="javascript:void(0);"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(
                                          window.location.origin + "/groupinvite/" + item._id
                                        );
                                        setCopiedText(window.location.origin + "/groupinvite/" + item._id);
                                        setTimeout(() => {
                                          // document.getElementsByClassName("dropdown-menu-customGroupChat").remov
                                          setCopiedText("");
                                          Array.from(
                                            document.querySelectorAll(".dropdown-menu-customGroupChat")
                                          ).forEach((el) => el.classList.remove("show"));
                                        }, 1000);
                                      }}
                                    >
                                      <img src="/images/icons/link-connect.svg" className="img-fluid me-2" alt="" />
                                      {copiedText !== window.location.origin + "/groupinvite/" + item._id
                                        ? "Invite via link"
                                        : "Link is copied"}
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="FeedUserChatTxt">
                              <p className="mb-0 whiteSpace text-break">{item.users.length} members</p>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                  {invitationList.map((item, idx) => {
                    return (
                      <div className="feedUserChat" key={"fuc" + idx}>
                        <a href="javascript:void(0);" className="userFeedLink">
                          <div
                            className="FeedUserChatProfile"
                            onClick={() => {
                              setShowGroupInfo(item.groupId._id);
                            }}
                          >
                            <ProfileImage url={item.groupId?.chatLogo} />
                            {/* <img src="/images/img/profile-image2.png" alt="profile-img" className="img-fluid" /> */}
                          </div>
                          <div className="FeedUserChatHead">
                            <div className="FeedUserChatName d-flex justify-content-between">
                              <div>
                                <h6 className="mb-0">
                                  {/* {item.groupId?.chatName} */}
                                  {item?.groupId?.chatName.length > 24
                                    ? item?.groupId?.chatName.slice(0, 24) + "..."
                                    : item?.groupId?.chatName}
                                </h6>
                                <div className="FeedUserChatTxt">
                                  <p className="mb-0 whiteSpace text-break">{item.groupId?.users.length} members</p>
                                </div>
                              </div>
                              <div className="feedChatHeadRight">
                                {activeGroupList.includes(item.groupId?._id) ? (
                                  <a
                                    href="javascript:void(0);"
                                    // onClick={() => handleJoinGroup(item.groupId?._id)}
                                    className={"btn " + "btnColor btnColorBlack"}
                                  >
                                    Joined
                                  </a>
                                ) : (
                                  <a
                                    href="javascript:void(0);"
                                    onClick={() => handleJoinGroup(item.groupId?._id)}
                                    className={"btn " + "btnColor"}
                                  >
                                    Join
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="allFeedUser allFeedUserCustom">
                  {searchList.map((item, idx) => {
                    return (
                      <div className="feedUserChat" key={"fuc" + idx}>
                        <a href="javascript:void(0);" className="userFeedLink">
                          <div
                            className="FeedUserChatProfile"
                            onClick={() => {
                              setShowGroupInfo(item._id);
                            }}
                          >
                            <ProfileImage url={item?.chatLogo} />
                            {/* <img src="/images/img/profile-image2.png" alt="profile-img" className="img-fluid" /> */}
                          </div>
                          <div className="FeedUserChatHead">
                            <div className="FeedUserChatName d-flex justify-content-between">
                              <div>
                                <h6 className="mb-0">
                                  {/* {item?.chatName} */}
                                  {item?.chatName.length > 24 ? item?.chatName.slice(0, 24) + "..." : item?.chatName}
                                </h6>
                                <div className="FeedUserChatTxt">
                                  <p className="mb-0 whiteSpace text-break">{item?.users.length} members</p>
                                </div>
                              </div>
                              <div className="feedChatHeadRight">
                                {item.users.findIndex((i) => i._id === user._id) !== -1 || item.createdBy === user._id ? (
                                  <a
                                    href="javascript:void(0);"
                                    // onClick={() => handleJoinGroup(item.groupId?._id)}
                                    className={"btn " + "btnColor btnColorBlack"}
                                  >
                                    {item.createdBy === user._id ? "Owner" : "Member"}
                                  </a>
                                ) : item.isPrivate ? (
                                  activeGroupList.includes(item?._id) || item.requested ? (
                                    <a
                                      href="javascript:void(0);"
                                      // onClick={() => handleJoinGroup(item.groupId?._id)}
                                      className={"btn " + "btnColor btnColorBlack"}
                                    >
                                      Requested
                                    </a>
                                  ) : (
                                    <a
                                      href="javascript:void(0);"
                                      onClick={() => handleSendRequest(item?._id)}
                                      className={"btn " + "btnColor"}
                                    >
                                      Request
                                    </a>
                                  )
                                ) : activeGroupList.includes(item?._id) ? (
                                  <a
                                    href="javascript:void(0);"
                                    // onClick={() => handleJoinGroup(item.groupId?._id)}
                                    className={"btn " + "btnColor btnColorBlack"}
                                  >
                                    Joined
                                  </a>
                                ) : (
                                  <a
                                    href="javascript:void(0);"
                                    onClick={() => handleJoinGroup(item?._id)}
                                    className={"btn " + "btnColor"}
                                  >
                                    Join
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <>
                <div
                  className={
                    message.content.length < 25
                      ? "allFeedUserOne-group allFeedUser allFeedUserGroupChat"
                      : message.content.length < 48
                        ? "allFeedUserTwo-group allFeedUser allFeedUserGroupChat"
                        : message.content.length < 70
                          ? "allFeedUserThree-group allFeedUser allFeedUserGroupChat"
                          : message.content.length < 98
                            ? "allFeedUserFour-group allFeedUser allFeedUserGroupChat"
                            : message.content.length < 125
                              ? "allFeedUserFive-group allFeedUser allFeedUserGroupChat"
                              : "allFeedUserSix-group allFeedUser allFeedUserGroupChat"
                  }
                  id="messagesEndRefGroup"
                >
                  {messageList.map((item, idx) => {
                    return (
                      <div className="feedUserChat" key={"fuc" + idx}>
                        <a
                          href="javascript:void(0);"
                          className="userFeedLink userFeedLinkActive"
                          data-bs-toggle="dropdown"
                        >
                          <div className="FeedUserChatProfile">
                            {/* <img src="/images/img/profile-image4.png" alt="profile-img" className="img-fluid" /> */}
                            <ProfileImage url={item?.sender?.profile_img} />
                          </div>
                          <div className="FeedUserChatHead">
                            <div className="FeedUserChatName FeedUserChatName-CustomWeb d-flex justify-content-between">
                              <h6
                                className="mb-0"
                                title={
                                  (item?.sender?.user_name ? item?.sender?.user_name : "Vestorgrow user") +
                                  " " +
                                  (groupAdminList.includes(item?.sender?._id) ? "(Admin)" : "")
                                }
                              >
                                {item?.sender?.user_name ? item?.sender?.user_name : "Vestorgrow user"}{" "}
                                {groupAdminList.includes(item?.sender?._id) ? "(Admin)" : ""}
                              </h6>

                              <span><ChatMsgTimeStamp onlyTime={false} dateTime={item?.updatedAt} /></span>
                            </div>
                            <div className="FeedUserChatTxt">
                              {item.content && <p className="mb-0 whiteSpace text-break">{item.content}</p>}
                              {item.file && (
                                <img
                                  src={item.file}
                                  className="img-fluid"
                                  alt=""
                                  onClick={() => {
                                    setMediaFiles(item.file);
                                    // setImageIdx(0);
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </a>
                        {groupAdmin && (
                          <ul className="dropdown-menu dropdown-menu-customGroupMemb">
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => {
                                  handleMakeGroupAdmin(chatId, item?.sender?._id);
                                }}
                              >
                                <img src="/images/icons/admin.svg" className="img-fluid me-2" />
                                Make admin
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                              // onClick={() => {
                              //   setShowGroupInfo(chatId);
                              // }}
                              >
                                <img src="/images/icons/mute-member.svg" className="img-fluid me-2" />
                                Mute member
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => {
                                  handleRemoveFromGroup(chatId, item?.sender?._id);
                                }}
                              >
                                <img src="/images/icons/remove-member.svg" className="img-fluid me-2" />
                                Remove from group
                              </a>
                            </li>
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div
                  className="feedChatSendMsgBox feedChatSendMsgBoxCustom p-0 position-relative border-white-custom"
                  id="emojiPickerGroups-id-custom"
                >
                  {showEmoji && (
                    <div
                      // className="emojiPickerGlobal emojiPicker-msg-custom"
                      className={
                        "picker-head " +
                        (message.content.length < 25
                          ? "emojiPickerGlobal emojiPicker-msg-custom"
                          : message.content.length < 48
                            ? "emojiPickerGlobal emojiPicker-msg-custom emojiPickerGlobal-two"
                            : message.content.length < 70
                              ? "emojiPickerGlobal emojiPicker-msg-custom emojiPickerGlobal-three"
                              : message.content.length < 98
                                ? "emojiPickerGlobal emojiPicker-msg-custom emojiPickerGlobal-four"
                                : message.content.length < 125
                                  ? "emojiPickerGlobal emojiPicker-msg-custom emojiPickerGlobal-five"
                                  : "emojiPickerGlobal emojiPicker-msg-custom emojiPickerGlobal-six")
                      }
                    >
                      <div
                        className="closeBtnPositionCustom display_none-custom close-btn-picker"
                        style={{ right: "30px" }}
                      >
                        <button
                          type="button"
                          className="btn-close btn-close-inner-custom"
                          onClick={() => setShowEmoji(false)}
                        />
                      </div>
                      <Picker
                        data={data}
                        perLine={7}
                        onClickOutside={(e) => {
                          if (!e.target.closest("#emojiPickerGroups-id-custom")) {
                            setShowEmoji(false);
                          }
                        }}
                        onEmojiSelect={(e) => setMessage({ ...message, content: message.content + e.native })}
                      />
                    </div>
                  )}
                  {message.file && (
                    <div
                      className={
                        message.content.length < 25
                          ? "imagePreview"
                          : message.content.length < 48
                            ? "imagePreview imagePreview-two"
                            : message.content.length < 70
                              ? "imagePreview imagePreview-three"
                              : message.content.length < 98
                                ? "imagePreview imagePreview-four"
                                : message.content.length < 125
                                  ? "imagePreview imagePreview-five"
                                  : "imagePreview imagePreview-six"
                      }
                    >
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage({ ...message, file: "" })}
                      />
                      <img src={URL.createObjectURL(message.file)} className="img-fluid imagePreData" alt="" />
                    </div>
                  )}
                  <div className="messageReplyOption position-relative">
                    <div className="chatInput">
                      <div className="input-group input-group-custom">
                        <div className="input-group-custom-child">
                          <span className="input-group-text gray-color-custom emoji">
                            <a
                              href="javascript:void(0);"
                              onClick={() => setShowEmoji(!showEmoji)}
                              id="emojiPickerGroups-btn-id-custom"
                            >
                              <img src="/images/icons/smile.svg" alt className="img-fluid" />
                            </a>
                          </span>
                          <span className="input-group-text file-upload gray-color-custom">
                            <a href="javascript:void(0);">
                              <label htmlFor="groupImages">
                                <img src="/images/icons/img-upload.svg" alt="file-upload" className="img-fluid" />
                              </label>
                            </a>
                          </span>
                          <textarea
                            className="form-control gray-color-custom input-group-custom input-group-msg-custom-gl allFeedUser"
                            rows={
                              message.content.length < 25
                                ? "1"
                                : message.content.length < 48
                                  ? "2"
                                  : message.content.length < 70
                                    ? "3"
                                    : message.content.length < 98
                                      ? "4"
                                      : message.content.length < 125
                                        ? "5"
                                        : "6"
                            }
                            type="text"
                            placeholder="Write a message..."
                            onChange={(e) => setMessage({ ...message, content: e.target.value })}
                            value={message.content}
                          />
                        </div>
                        <input
                          style={{ display: "none" }}
                          type="file"
                          name="images"
                          id="groupImages"
                          accept="image/*"
                          multiple={false}
                          onChange={(event) => {
                            setMessage({ ...message, file: event.currentTarget.files[0] });
                            event.target.value = null;
                          }}
                        />
                        <div className="sendBtn sendBtnCustom">
                          <button type="button" onClick={sendMessage} className="btn p-0" disabled={activeBtn}>
                            {activeBtn ? (
                              <i className="fa-solid fa-spinner"></i>
                            ) : (
                              <img src="/images/icons/send.svg" alt="send" className="img-fluid" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="chatBoxParent"></div>
    </>
  );
}
