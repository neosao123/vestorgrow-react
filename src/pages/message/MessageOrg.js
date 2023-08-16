import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useParams, useNavigate } from "react-router-dom";
import ChatService from "../../services/chatService";
import UserService from "../../services/UserService";
import ProfileImage from "../../shared/ProfileImage";
import GlobalContext from "../../context/GlobalContext";
import moment from "moment";
import io from "socket.io-client";
import DeleteMessage from "../../popups/message/DeleteMessage";
import BlockUser from "../../popups/user/BlockUser";
import DeleteChat from "../../popups/message/DeleteChat";
import ComposeMessage from "../../popups/message/ComposeMessage";
import SentMessage from "../../popups/message/SentMessage";
import ImageCarousel from "../../popups/imageCarousel/ImageCarousel";
import VideoImageThumbnail from "react-video-thumbnail-image";
import Linkify from "react-linkify";
import { SecureLink } from "react-secure-link";
import ChatMsgTimeStamp from "../../components/ChatMsgTimeStamp";
const serv = new ChatService();
const userServ = new UserService();
let socket, chatCompare;
const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];
export default function MessageOrg() {
  const params = useParams();
  const navigate = useNavigate();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [chatList, setChatList] = useState([]);
  const [mUser, setMUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState({});
  const [latestMsgList, setLatestMsgList] = useState({});
  const [showDeleteMsgPopup, setShowDeleteMsgPopup] = useState(null);
  const [showBlockUserPopup, setShowBlockUserPopup] = useState(null);
  const [showDeleteChatPopup, setShowDeleteChatPopup] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [showSentMsg, setShowSentMsg] = useState(false);
  const [showComposeMsg, setShowComposeMsg] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isOnline, setIsOnline] = useState([]);
  const [activeBtn, setActiveBtn] = useState(false);
  // const [date, setDate] = useState(moment(Date, "DD MMM YYYY"))
  const [message, setMessage] = useState({
    content: "",
    file: "",
    sender: user._id,
  });

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 400) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener
  useEffect(() => {
    handleResize();
  });

  useEffect(() => {
    getChatList();
    setShowMsg(false);
  }, [filterText]);

  useEffect(() => {
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [messageList]);

  useEffect(() => {
    if (params.id) {
      setTimeout(createChat(), 1000);
    } else if (params.chat_id && params.message_id) {
      setChatId(params.chat_id);
      getChatList(params.chat_id);
    }
  }, [params.id, params.chat_id, params.message_id]);

  useEffect(() => {
    for (const item in unreadCount) {
      if (item === chatId) {
        setUnreadCount({ ...unreadCount, [item]: 0 });
      }
    }
  }, [chatId]);

  useEffect(() => {
    socket = io(process.env.REACT_APP_API_BASEURL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    getOnlineStatus();
    const interval = setInterval(getOnlineStatus, 5000);
    return () => clearInterval(interval);
  }, [chatList]);

  useEffect(() => {
    // document.getElementById('messages').scrollIntoView(false)
    socket.on("messageRecieved", (newMessage) => {
      for (const item in latestMsgList) {
        if (item === newMessage.chat) {
          setLatestMsgList({ ...latestMsgList, [item]: newMessage });
        }
      }
      if (
        !chatCompare || // if chat is not selected or doesn't match current chat
        chatCompare !== newMessage.chat
      ) {
        for (const item in unreadCount) {
          if (item === newMessage.chat) {
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
  });

  const getOnlineStatus = async () => {
    try {
      let userList = [];
      chatList.forEach((item) => {
        item.users.forEach((element) => {
          if (element._id !== user._id) {
            userList.push(element._id);
          }
        });
      });
      await userServ.getOnlineStatus({ users: userList }).then((resp) => {
        setIsOnline(resp.result);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const createChat = async () => {
    try {
      let obj = {
        users: [params.id, user._id],
      };
      await serv.createChat(obj).then((resp) => {
        if (resp.data) {
          getChatList();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getChatList = async (chat_id) => {
    let obj = {
      filter: {
        isGroupChat: false,
      },
    };
    if (filterText) {
      obj.filter.userName = filterText;
    }
    try {
      await serv.listAllChat(obj).then((resp) => {
        if (resp.data) {
          resp.data = resp.data.filter((i) => !i.deleted_for.includes(user?._id));
          setChatList([...resp.data]);
          let unreadCountList = unreadCount;
          let latestMsgListTemp = latestMsgList;
          resp.data.map((item) => {
            if (item.latestMessage.sender !== user._id) {
              unreadCountList[item?._id] = item.unreadCount;
            }
            latestMsgListTemp[item?._id] = item.latestMessage;
          });
          setUnreadCount(unreadCountList);
          setLatestMsgList(latestMsgListTemp);
          let el = 0;
          if (chat_id) {
            resp.data.forEach((item, idx) => {
              if (item._id === chat_id) {
                el = idx;
              }
            });
          }
          resp.data[el].users.forEach((element) => {
            if (element?._id !== user?._id) {
              getMessage(resp.data[el]?._id, element, resp.data[el].users);
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getMessage = async (id, oUser, users) => {
    setMessage({
      content: "",
      file: "",
      sender: user?._id,
    });

    setMUser(oUser);
    setChatId(id);
    chatCompare = id;
    setUsers([...users]);
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
          if (params.message_id) {
            scroll(params.message_id);
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const scroll = (id) => {
    var objDiv = document.getElementById("messages");
    const section = document.getElementById(`msg${id}`);
    // objDiv.scrollTop = section.scrollIntoView;
    // objDiv.scrollTop = objDiv.scrollHeight;
    // section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sendMessage = async () => {
    setActiveBtn(true);
    let obj = message;
    obj.chat = chatId;
    if (message.content.trim() || message.file) {
      const formData = new FormData();
      formData.append("content", message.content);
      formData.append("chat", chatId);
      formData.append("sender", message.sender);
      if (Array.isArray(message.file)) {
        message.file.forEach((element) => {
          formData.append("file", element);
        });
      }
      try {
        await serv.createMessage(formData).then((resp) => {
          if (resp.data) {
            setMessage({
              content: "",
              file: "",
              sender: user?._id,
            });
            let payload = { ...resp.data, users: users, sender: user };
            setMessageList([...messageList, { ...resp.data, sender: user }]);

            socket.emit("newMessage", payload);
            for (const item in latestMsgList) {
              if (item == payload.chat) {
                setLatestMsgList({ ...latestMsgList, [item]: payload });
              }
            }
          } else {
            console.log(resp);
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      setMessage({
        content: "",
        file: "",
        sender: user?._id,
      });
    }
    setActiveBtn(false);
  };

  const handleDelete = (id) => {
    setShowDeleteMsgPopup(id);
  };

  const handleDeleteChat = (id) => {
    setShowDeleteChatPopup(id);
  };

  const handleBlockUser = (id) => {
    setShowBlockUserPopup(id);
  };

  // const changeDate = (date) => {
  //     setDate(date)
  // }
  let date = moment(Date()).format("DD MMMM YYYY");
  // useEffect(() => {
  // $('html').click(function (e) {
  //     if (!$(e.target).hasClass('emojiPicker')) {
  //         setShowEmoji(false)
  //     }
  // });
  // document.body.addEventListener('click', () => setShowEmoji(false), true);
  // })
  const handleKeypress = (e) => {
    if (e.keyCode === 13 && e.shiftKey) {
      sendMessage();
    }
  };
  const handleNavigate = (url) => {
    navigate(url);
  };

  return (
    <>
      <div className="socialContant chatsocialContant main_container pb-0">
        <div className="messageChatBox">
          <div
            className={
              "messageChatLeft messageChatLeftCustom d-md-block " +
              (showMsg ? "d-sm-none d-none" : "d-sm-block d-block")
            }
          >
            <div className="messageChatLeftHead">
              <div className="messageHeading d-block d-md-none">
                <h4>Messages</h4>
              </div>
              <div className="messageChatLeftHeadSearch d-none d-md-block">
                <div className="input-group">
                  <img src="/images/icons/search.svg" alt="searchIcon" className="img-fluid searchIcon" />
                  <input
                    type="text"
                    className="form-control"
                    placeholder
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </div>
              </div>
              <div className="messageChatLeftHeadIcon ms-auto" onClick={() => setShowComposeMsg(!showComposeMsg)}>
                <img src="/images/icons/compose-button.svg" alt="compose-button" className="img-fluid composeButton" />
              </div>
            </div>
            <div className="allMsgUser allMsgUser-paddingCustom">
              {chatList.map((item, idx) => {
                let time = moment(item?.updatedAt).fromNow(true).split(" ");
                time = `${time[0]} ${time[1].slice(0, 1)}`;
                let oUser;
                item.users.forEach((element) => {
                  if (element?._id !== user?._id) {
                    oUser = element;
                  }
                });
                return (
                  <Link
                    onClick={() => {
                      getMessage(item?._id, oUser, item?.users);
                      setShowMsg(true);
                    }}
                  >
                    <div className={`allMsgUserInner d-flex ${item?._id == chatId ? "active" : ""}`}>
                      <div className="allMsgUserImg userProfileImg">
                        <ProfileImage url={oUser?.profile_img} />
                        {isOnline.includes(oUser?._id) && <span className="msgOnline" />}
                        {/* <img src="/images/img/profile-image.png" alt="userImg" className="img-fluid" /> */}
                      </div>
                      <div className="allMsgContant d-flex">
                        <div className="allMsgUserTxt text-break">
                          <h4 title={oUser?.user_name}>
                            {oUser?.user_name.length > 20 ? oUser?.user_name.slice(0, 20) + "..." : oUser?.user_name}{" "}
                            {/* <h4 title={oUser?.user_name}>{oUser?.user_name}</h4> */}
                            {oUser?.role.includes("userPaid") ? (
                              <img src="/images/icons/green-tick.svg" alt="green-tick" />
                            ) : (
                              // <img src="/images/icons/dot.svg" />
                              ""
                            )}{" "}
                          </h4>
                          {/* <p>{item.latestMessage?.content}</p> */}
                          <p className="whiteSpace">
                            {latestMsgList[item?._id]?.content.length > 24
                              ? latestMsgList[item?._id]?.content.slice(0, 24) + "..."
                              : latestMsgList[item?._id]?.content}
                          </p>
                        </div>
                        <div className="allMsgUserTime allMsgUserTime-custom">
                          {/* {<span>{moment(latestMsgList[item?._id]?.updatedAt).fromNow()}</span>} */}
                          <ChatMsgTimeStamp dateTime={latestMsgList[item?._id]?.createdAt} onlyTime={false} />
                          {unreadCount[item?._id] > 0 && (
                            <span className="badge rounded-pill notificationBadge">{unreadCount[item?._id]}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <div
            className={
              "messageChatRight messageChatRightCustom position-relative d-md-block " +
              (showMsg ? "d-sm-flex d-flex" : "d-sm-none d-none")
            }
          >
            <div className="messageChatRightHead">
              <div className="userProfile userProfile-custom-desktop">
                <a href="javascript:void(0)" onClick={() => setShowMsg(false)} className="ChatBoxBackBtn d-md-none">
                  <i className="fa fa-chevron-left" aria-hidden="true" />
                </a>
                <div className="userProfileInner" onClick={() => handleNavigate("/userprofile/" + mUser?._id)}>
                  <div className="userProfileImg">
                    <ProfileImage url={mUser?.profile_img} />
                    {/* <img src="/images/img/profile-image.png" alt="profile-image" className="img-fluid" /> */}
                    {isOnline.includes(mUser?._id) && <span className="msgOnline" />}
                  </div>
                  <div className="userProfileTxt userProfileTxt-custom">
                    <h5 className="mb-0 userProfileTxtUsername-custom">
                      <h5 className="mb-0" title={mUser?.user_name}>
                        {mUser?.user_name}
                      </h5>
                      {mUser?.role.includes("userPaid") ? (
                        <img src="/images/icons/green-tick.svg" alt="green-tick" />
                      ) : (
                        ""
                        // mUser?.title && <img src="/images/icons/dot.svg" />
                      )}{" "}
                      {/* <span rows="1" title={mUser?.title}>
                        {mUser?.title}{" "}
                      </span> */}
                    </h5>
                    <p className="mb-0 d-none d-md-block"> {isOnline.includes(mUser?._id) ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <div className="threeDotsMenu">
                  <div className="leftSideThreeDots">
                    <div className="dropdown">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <img src="/images/icons/dots.svg" alt="dots" className="img-fluid" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a className="dropdown-item" href="javascript:void(0);">
                            Report
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                            onClick={() => handleBlockUser(mUser)}
                          >
                            Block
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                            style={{ color: "#CC1F29" }}
                            onClick={() => handleDeleteChat(chatId)}
                          >
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="userProfile userProfile-custom-mobile">
                <div className="ChatBoxBackButton-profile">
                  <a href="javascript:void(0)" onClick={() => setShowMsg(false)} className="ChatBoxBackBtn d-md-none">
                    <i className="fa fa-chevron-left" aria-hidden="true" />
                  </a>
                  <div className="userProfileInner" onClick={() => handleNavigate("/userprofile/" + mUser?._id)}>
                    <div className="userProfileImg">
                      <ProfileImage url={mUser?.profile_img} />
                      {/* <img src="/images/img/profile-image.png" alt="profile-image" className="img-fluid" /> */}
                      {/* <span className="msgOnline" /> */}
                      {isOnline.includes(mUser?._id) && <span className="msgOnline" />}
                    </div>
                    <div className="userProfileTxt userProfileTxt-custom">
                      <h5 className="mb-0">
                        {mUser?.user_name.length > 20 ? mUser?.user_name.slice(0, 20) + "..." : mUser?.user_name}{" "}
                        {/* {mUser?.user_name}{" "} */}
                        {mUser?.role.includes("userPaid") ? (
                          <img src="/images/icons/green-tick.svg" alt="green-tick" />
                        ) : (
                          ""
                          // mUser?.title && <img src="/images/icons/dot.svg" />
                        )}{" "}
                        {/* <span>{mUser?.title} </span> */}
                      </h5>
                      <p className="mb-0 d-none d-md-block">{isOnline.includes(mUser?._id) ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                </div>
                <div className="threeDotsMenu">
                  <div className="leftSideThreeDots">
                    <div className="dropdown">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <img src="/images/icons/dots.svg" alt="dots" className="img-fluid" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a className="dropdown-item" href="javascript:void(0);">
                            Report
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                            onClick={() => handleBlockUser(mUser)}
                          >
                            Block
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                            style={{ color: "#CC1F29" }}
                            onClick={() => handleDeleteChat(chatId)}
                          >
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="chatSection chatSection-mobile-custom" id="messages">
              <div className="messageScreen messageScreen-custom-overflow">
                {messageList.map((item, idx) => {
                  let itemDate = moment(item.createdAt).format("DD MMMM YYYY");
                  let showDate = false;
                  if (date !== itemDate || idx === 0) {
                    date = itemDate;
                    showDate = true;
                  }
                  return (
                    <>
                      {showDate && (
                        <>
                          <div className="chatWeeks">
                            <h6>{itemDate === moment(Date()).format("DD MMMM YYYY") ? "Today" : itemDate}</h6>
                          </div>
                        </>
                      )}
                      {!(item.deleted_for?.includes("all") || item.deleted_for?.includes(user?._id)) && (
                        <div
                          id={"msg" + item._id}
                          className={
                            "d-flex messageBoxContent " +
                            (item.sender?._id === user?._id ? "rightSideMsg" : "leftSideMsg")
                          }
                        >
                          <div className="leftSideProfile">
                            {/* <img src="/images/img/profile-image.png" alt="profile-image" className="img-fluid" /> */}
                            <ProfileImage url={item.sender?.profile_img} />
                          </div>
                          {item.deleted_for?.includes("all") || item.deleted_for?.includes(user?._id) ? (
                            <div className="leftSideContant">
                              <div className="leftSideInner">
                                <div className="chatMsgGroup d-flex align-items-center">
                                  <div className="deleteMsg">
                                    <p className="mb-0">Message Deleted</p>
                                  </div>
                                </div>
                                <div className="chatMsgTime">
                                  {/* {<span>{moment(item.createdAt).format("HH:mm")}</span>} */}
                                  <ChatMsgTimeStamp dateTime={item.createdAt} onlyTime={true} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="leftSideContant">
                              {item.file?.length > 0 && (
                                <div className="chatGallery d-flex align-items-center">
                                  <div className="groupGallery">
                                    <div
                                      className={
                                        "chatGalleryInner d-flex flex-wrap " +
                                        (item.sender?._id === user?._id && "flex-row-reverse")
                                      }
                                    >
                                      {item.file.map((i, idx) => {
                                        return (
                                          // idx < 2 &&
                                          <div
                                            className="galleryImage galleryImageBig-custom"
                                            onClick={() => {
                                              setMediaFiles([...item.file]);
                                              setImageIdx(idx);
                                            }}
                                          >
                                            {isImage.includes(i.split(".").pop()) ? (
                                              <img src={i} alt="profile-image" className="img-fluid" />
                                            ) : (
                                              <VideoImageThumbnail videoUrl={i} alt="video" />
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <div className="chatMsgTime">
                                      {/* {<span>{moment(item.createdAt).format("HH:mm")}</span>} */}
                                      <ChatMsgTimeStamp dateTime={item.createdAt} onlyTime={true} />
                                    </div>
                                  </div>
                                  <div className="leftSideThreeDots messageDropDownCustom">
                                    <div className="dropdown">
                                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                                        <img src="/images/icons/dots.svg" alt="dots" className="img-fluid" />
                                      </a>
                                      <ul className="dropdown-menu">
                                        <li>
                                          <a
                                            className="dropdown-item"
                                            href="javascript:void(0);"
                                            onClick={() => navigator.clipboard.writeText(item.content)}
                                          >
                                            Copy
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="dropdown-item dropdown-item-red"
                                            href="javascript:void(0);"
                                            onClick={() => handleDelete(item)}
                                          >
                                            Delete
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {item?.content && (
                                <div className="leftSideInner">
                                  <div className="chatMsgGroup d-flex align-items-center">
                                    <div className="chatMsgLeft text-break whiteSpace">
                                      <Linkify
                                        // options={options}
                                        componentDecorator={(decoratedHref, decoratedText, key) => (
                                          <SecureLink
                                            href={decoratedHref}
                                            key={key}
                                            target="_self"
                                            className="messageLink-CustomColor"
                                          >
                                            {decoratedText}
                                          </SecureLink>
                                        )}
                                      >
                                        <p className="mb-0">{item.content}</p>
                                      </Linkify>
                                    </div>
                                    <div className="leftSideThreeDots messageDropDownCustom">
                                      <div className="dropdown">
                                        <a href="javascript:void(0);" data-bs-toggle="dropdown">
                                          <img src="/images/icons/dots.svg" alt="dots" className="img-fluid" />
                                        </a>
                                        <ul className="dropdown-menu">
                                          <li>
                                            <a
                                              className="dropdown-item"
                                              href="javascript:void(0);"
                                              onClick={() => navigator.clipboard.writeText(item.content)}
                                            >
                                              Copy
                                            </a>
                                          </li>
                                          <li>
                                            <a
                                              className="dropdown-item dropdown-item-red"
                                              href="javascript:void(0);"
                                              onClick={() => handleDelete(item)}
                                            >
                                              Delete
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="chatMsgTime">
                                    <span>{moment(item.createdAt).format("HH:mm")}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })}

                {/* <div className="leftSideMsg d-flex">
                                <div className="leftSideProfile">
                                    <img src="/images/img/profile-image.png" alt="profile-image" className="img-fluid" />
                                </div>
                                <div className="leftSideContant">
                                    <div className="leftSideInner">
                                        <div className="chatMsgGroup d-flex align-items-center">
                                            <div className="deleteMsg">
                                                <p className="mb-0">Message Deleted</p>
                                            </div>
                                        </div>
                                        <div className="chatMsgTime">
                                            <span>08:32</span>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                {/*<div className="rightSideMsg d-flex">
                                <div className="leftSideProfile">
                                    <img src="/images/img/profile-image5.png" alt="profile-image" className="img-fluid" />
                                </div>
                                <div className="leftSideContant">
                                    <div className="leftSideInner">
                                        <div className="chatMsgGroup d-flex align-items-center">
                                            <div className="chatMsgLeft">
                                                <p className="mb-0">Hi, How are things with our illustration builder?</p>
                                            </div>
                                            <div className="leftSideThreeDots">
                                                <div className="dropdown">
                                                    <a href="javascript:void(0);" data-bs-toggle="dropdown"><img src="/images/icons/dots.svg" alt="dots" className="img-fluid" /></a>
                                                    <ul className="dropdown-menu">
                                                        <li><a className="dropdown-item" href="javascript:void(0);">Copy</a></li>
                                                        <li><a className="dropdown-item" href="javascript:void(0);" style={{ color: '#CC1F29' }}>Delete</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chatMsgTime">
                                            <span>08:32</span>
                                        </div>
                                    </div>
                                    <div className="chatGallery d-flex align-items-center">
                                        <div className="groupGallery">
                                            <div className="chatGalleryInner d-flex">
                                                <div className="galleryImage">
                                                    <img src="/images/img/img15.png" alt="profile-image" className="img-fluid" />
                                                </div>
                                                <div className="galleryImage">
                                                    <img src="/images/img/img16.png" alt="profile-image" className="img-fluid" />
                                                </div>
                                            </div>
                                            <div className="chatMsgTime">
                                                <span>08:32</span>
                                            </div>
                                        </div>
                                        <div className="leftSideThreeDots">
                                            <div className="dropdown">
                                                <a href="javascript:void(0);" data-bs-toggle="dropdown"><img src="/images/icons/dots.svg" alt="dots" className="img-fluid" /></a>
                                                <ul className="dropdown-menu">
                                                    <li><a className="dropdown-item" href="javascript:void(0);">Link 1</a></li>
                                                    <li><a className="dropdown-item" href="javascript:void(0);">Link 2</a></li>
                                                    <li><a className="dropdown-item" href="javascript:void(0);">Link 3</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rightSideMsg d-flex">
                                <div className="leftSideProfile">
                                    <img src="/images/img/profile-image5.png" alt="profile-image" className="img-fluid" />
                                </div>
                                <div className="leftSideContant">
                                    <div className="leftSideInner">
                                        <div className="chatMsgGroup d-flex align-items-center">
                                            <div className="deleteMsg">
                                                <p className="mb-0">Message Deleted</p>
                                            </div>
                                        </div>
                                        <div className="chatMsgTime">
                                            <span>08:32</span>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
              </div>
            </div>
            {showEmoji && (
              <div className="picker-head emojiPicker emojiPicker-msg-custom">
                <div className="closeBtnPositionCustom display_none-custom close-btn-picker">
                  <button
                    type="button"
                    className="btn-close btn-close-inner-custom"
                    onClick={() => setShowEmoji(false)}
                  />
                </div>
                <Picker
                  data={data}
                  perLine={isMobile ? 7 : 9}
                  onClickOutside={(e) => {
                    if (!e.target.closest("#emojiPickerMessage-id-Custom")) {
                      setShowEmoji(false);
                    }
                  }}
                  onEmojiSelect={(e) => setMessage({ ...message, content: message.content + e.native })}
                />
              </div>
            )}
            {message.file && (
              <div className="imagePreview imagePreviewChatIn imagePreviewChatIn-custom">
                <button type="button" className="btn-close" onClick={() => setMessage({ ...message, file: "" })} />
                {message.file[0].type.includes("image") ? (
                  <img src={URL.createObjectURL(message.file[0])} className="img-fluid imagePreData" />
                ) : (
                  <VideoImageThumbnail
                    className="img-fluid imagePreData"
                    videoUrl={URL.createObjectURL(message.file[0])}
                    // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                    // width={120}
                    // height={80}
                    alt="video"
                  />
                )}
              </div>
            )}
            <div className="chatInputBox chatInputBoxCustom">
              <div className="chatInput">
                <div className="input-group" id="emojiPickerMessage-id-Custom">
                  <textarea
                    rows={message.content.length > 70 ? 2 : 1}
                    type="text"
                    style={{ height: "unset" }}
                    className="form-control allFeedUser resizeNone"
                    onChange={(e) => setMessage({ ...message, content: e.target.value })}
                    value={message.content}
                    onKeyDown={handleKeypress}
                    placeholder="Write your message..."
                  />
                  <input
                    style={{ display: "none" }}
                    type="file"
                    name="images"
                    id="images"
                    accept="image/*,video/mp4,video/x-m4v,video/*"
                    multiple={true}
                    onChange={(event) => {
                      setMessage({ ...message, file: [...message.file, ...event.currentTarget.files] });
                      event.target.value = null;
                    }}
                  />

                  <span
                    className="input-group-text bg-white emoji emoji-picker-customMobile"
                    id="emojiPicker-btn-id-Custom"
                  >
                    <a href="javascript:void(0);" onClick={() => setShowEmoji(!showEmoji)}>
                      <img src="/images/icons/emoji.png" alt className="img-fluid " />
                    </a>
                  </span>
                  <span className="input-group-text bg-white file-upload file-upload-customMobile">
                    <a href="javascript:void(0);">
                      <label htmlFor="images">
                        <img src="/images/icons/file-upload.svg" alt="file-upload" className="img-fluid" />
                      </label>
                    </a>
                  </span>
                </div>
              </div>
              <div className="sendBtn">
                <button type="button" onClick={sendMessage} className="btn" disabled={activeBtn}>
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
      {showDeleteMsgPopup && (
        <DeleteMessage
          onClose={() => setShowDeleteMsgPopup(null)}
          onFinish={() => {
            setShowDeleteMsgPopup(null);
            getMessage(showDeleteMsgPopup.chat, mUser, users);
          }}
          message={showDeleteMsgPopup}
        />
      )}
      {showDeleteChatPopup && (
        <DeleteChat
          onClose={() => setShowDeleteChatPopup(null)}
          onFinish={() => {
            setShowDeleteChatPopup(null);
            getChatList();
          }}
          chat={showDeleteChatPopup}
        />
      )}
      {showBlockUserPopup && (
        <BlockUser
          onClose={() => setShowBlockUserPopup(null)}
          onFinish={() => {
            setShowBlockUserPopup(null);
            getChatList();
          }}
          user={showBlockUserPopup}
        />
      )}
      {showComposeMsg && (
        <ComposeMessage
          onClose={() => {
            setShowComposeMsg(!showComposeMsg);
            getChatList();
          }}
          onFinish={() => {
            getChatList();
            setShowComposeMsg(!showComposeMsg);
            setShowSentMsg(!showSentMsg);
          }}
        />
      )}
      {showSentMsg && <SentMessage onClose={() => setShowSentMsg(!showSentMsg)} />}
      {mediaFiles && mediaFiles.length > 0 && (
        <ImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} imageIdx={imageIdx} />
      )}
    </>
  );
}
