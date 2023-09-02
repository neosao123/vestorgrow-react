import React, { useEffect, useState, useContext, useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChatService from "../../../services/chatService";
import ProfileImage from "../../../shared/ProfileImage";
import GlobalContext from "../../../context/GlobalContext";
import moment from "moment";
import io from "socket.io-client";
import ComposeMessage from "../../../popups/message/ComposeMessage";
import SentMessage from "../../../popups/message/SentMessage";
import DeleteMessage from "../../../popups/message/DeleteMessage";
import BlockUser from "../../../popups/user/BlockUser";
import DeleteChat from "../../../popups/message/DeleteChat";
import ChatMessage from "./ChatMessage";
import UserService from "../../../services/UserService";
import ChatMsgTimeStamp from "../../../components/ChatMsgTimeStamp";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri"
import { MdDelete } from "react-icons/md"
import { AiOutlineRead } from "react-icons/ai"
import { MdTimeToLeave } from "react-icons/md"
import groupImage from "../../../assets/images/groups.svg"
import PersonalChatImage from "../../../assets/images/messaging.svg"
import CreategroupImage from "../../../assets/images/create_group (4).svg"
import PersonalChatCreate from "../../../assets/images/createpersonalchat.svg"
import MiniIcon from "../../../assets/images/minimize.svg"
import MaxIcon from "../../../assets//images/maximize.svg"
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi"

import "./chat.css";
// import GroupChat from "./GroupChat";

const serv = new ChatService();
const userServ = new UserService();
const chatServ = new ChatService()
let socket;
// let chatCompare = [];

export default function Chat({ atTop, setAtTop, setMediaFiles, setShowSentMsg, setShowCreateGroup }) {
  const navigate = useNavigate();
  const params = useParams();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [unreadMsgCount, setUnreadMsgCount] = globalCtx.unreadMsgCount;
  const [getMessageData, setGetMessageData] = globalCtx.getMessageData;
  const [chatId, setChatId] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [showComposeMsgDkst, setShowComposeMsgDkst] = useState(false);
  // const [getMessageData, setGetMessageData] = useState([]);
  const [showComposeMsg, setShowComposeMsg] = useState(false);
  // const [showSentMsg, setShowSentMsg] = useState(false);
  const [isOnline, setIsOnline] = useState([]);
  const [chatCompare, setChatCompare] = useState([]);
  const [ToggleDropdown, setToggleDropdown] = useState(false)
  const [dropdownId, setDropdownId] = useState(null)
  const dropdownRef = useRef(null)
  const [showChat, setShowChat] = globalCtx.ChatBoxVisibily;
  const [messageBoxState, setMessageBoxState] = globalCtx.MessageBoxStateMaintainance;
  const [isGroupChat, setisGroupChat] = globalCtx.isGroupChat;
  const [isloading, setisLoading] = globalCtx.isLoading;
  const [unreadCount, setUnreadCount] = globalCtx.UnReadCount;
  const [latestMsgList, setLatestMsgList] = globalCtx.LatestmsgList;
  const [chatList, setChatList] = globalCtx.ChatList;
  const [chatData, setChatData] = globalCtx.ChatDATA;
  const [groupChat, setgroupChat] = useState(false)
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getChatList();
    setShowMsg(false);
  }, [unreadCount, groupChat, searchText]);

  useEffect(() => {
    socket = io(process.env.REACT_APP_API_BASEURL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

  }, []);

  useEffect(() => {
    for (const item in unreadCount) {
      if (getMessageData.filter((i) => i.id === item).length > 0) {
        setUnreadCount({ ...unreadCount, [item]: 0 });
      }
    }
  }, [JSON.stringify(getMessageData)]);

  useEffect(() => {
    var objDiv = document.getElementById("messages");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
    socket.on("messageRecieved", (newMessage) => {
      for (const item in latestMsgList) {
        if (item === newMessage.chat) {
          setLatestMsgList({ ...latestMsgList, [item]: newMessage });
        }
      }
      if (
        !chatCompare || // if chat is not selected or doesn't match current chat
        !chatCompare.includes(newMessage.chat)
      ) {
        for (const item in unreadCount) {
          if (item === newMessage.chat) {
            setUnreadCount({ ...unreadCount, [item]: unreadCount[item] + 1 });
          }
        }
      } else {
        setMessageList([...messageList, newMessage]);
      }
    });
    let count = 0;
    for (const item in unreadCount) {
      count += unreadCount[item];
    }
    if (unreadMsgCount.messageChat !== count) {
      setUnreadMsgCount({ ...unreadMsgCount, messageChat: count });
    }
  });

  useEffect(() => {
    getOnlineStatus();
    const interval = setInterval(getOnlineStatus, 5000);
    return () => clearInterval(interval);
  }, [chatList]);

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
      //console.log(error);
    }
  };


  const getChatList = async () => {

    try {
      let obj = {
        filter: {
          isGroupChat: groupChat,
          search: searchText
        },
      };
      await serv.listAllChat(obj).then((resp) => {
        if (resp.data) {
          resp.data = resp.data.filter((i) => !i.deleted_for.includes(user._id));
          setChatList([...resp.data]);
          let unreadCountList = unreadCount;
          let latestMsgListTemp = latestMsgList;
          resp?.data?.map((item) => {
            if (item.latestMessage?.sender !== user._id) {
              unreadCountList[item._id] = item.unreadCount;
            }
            latestMsgListTemp[item._id] = item.latestMessage;
          });
          setUnreadCount(unreadCountList);
          setLatestMsgList(latestMsgListTemp);
        }
      });
    } catch (err) {
      //console.log(err);
      setisLoading(false)
    }
    setisLoading(false)
  };

  const getMessage = async (id, oUser, users) => {
    if (getMessageData.findIndex((i) => i.id === id) === -1) {
      if (getMessageData?.length > 4) {
        let msgData = getMessageData;
        msgData.shift();
        setGetMessageData([...msgData, { id, oUser, users }]);
      } else {
        setGetMessageData([...getMessageData, { id, oUser, users }]);
      }
    }

    setChatId(id);
    setChatCompare([...chatCompare, id]);

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
      //console.log(err);
    }
  };

  const showComposeMsgHandler = () => {
    setShowComposeMsg(!showComposeMsg);
    setShowComposeMsgDkst(!showComposeMsgDkst);
  };

  const handleNavigate = (e, url) => {
    if (!isGroupChat) {
      e.preventDefault();
      navigate(url);
    }

  };

  const handleClickOutSide = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setToggleDropdown(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutSide);
    return () => {
      document.removeEventListener('click', handleClickOutSide);
    };
  }, []);


  const handleDeleteChat = async (id) => {
    await chatServ.deleteChat(id)
      .then((res) => {
        getChatList()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    handlePersonalChat()
  }, [])

  const handlePersonalChat = () => {
    if (groupChat) {
      setisLoading(true)
      setisGroupChat(false)
      setgroupChat(false)
    }

  }

  const handleGroupChat = () => {
    if (!groupChat) {
      setisLoading(true)
      setisGroupChat(true)
      setgroupChat(true)
    }

  }



  return (
    <>
      <div className="feedChatUser" style={{ width: "18em", height: "100%", width: '100%', paddingTop: "10px" }} >
        <div className="chatBoxGroupBottom"  >
          <div style={{ textAlign: "center", display: "flex", alignItems: "Center", justifyContent: "center" }} onClick={() => setAtTop(prev => !prev)}>
            {atTop && <h6 style={{ color: "#08808b" }} >Collapse <span><PiCaretDownBold color="#08808b" fontSize={"20px"} /></span></h6>}
            {
              !atTop && <h6 style={{ color: "#08808b" }} >Collapse <span><PiCaretUpBold color="#08808b" fontSize={"20px"} /></span></h6>
            }
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "50%", padding: "5px", borderBottom: `${groupChat ? "4px solid #00808b" : "none"}`, display: "flex", justifyContent: "center", alignItems: "center" }} ><img style={{ color: "black" }} src={groupImage} /><span style={{ fontWeight: "600", marginLeft: "5px", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={handleGroupChat} >Group Chat</span></div>
            <div style={{ width: "50%", padding: "10px", borderBottom: `${!groupChat ? "4px solid #00808b" : "none"}` }} onClick={handlePersonalChat} ><img src={PersonalChatImage} /><span style={{ fontWeight: "600", marginLeft: "5px" }} >Messages</span></div>
          </div>
          <div className="feedChatHeading d-flex d-flex-Custom " style={{ marginTop: "10px", marginBottom: "10px" }} >
            <div className="input-container" style={{ backgroundColor: "#E7E7E7", margin: "0px 20px", marginBottom: "15px" }}>
              <i className="fas fa-search" style={{ paddingLeft: "10px" }}></i>
              <input onChange={(e) => {
                setTimeout(() => {
                  setSearchText(e.target.value)
                }, 350);
              }} className="input-field" type="text" placeholder={`${groupChat ? "Search Groups" : "Search Chats"}`} style={{ border: "none", backgroundColor: "#E7E7E7" }} />
            </div>
            <div className="messageChatLeftHeadIcon" style={{ marginBottom: "10px", marginLeft: "-10px" }}>
              {!groupChat && <div onClick={showComposeMsgHandler} >
                <img src={PersonalChatCreate} />
              </div>}
              {groupChat && <div onClick={() => setShowCreateGroup(true)}>
                <img src={CreategroupImage} />
              </div>}
            </div>
          </div>
          {isloading ? (<div className="spinner-border text-primary" style={{ margin: "130px" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>) : (<div className="feedChatUserMsgGroup" style={{ width: "18em", paddingBottom: "10px", height: "85vh" }}>
            <div className="allFeedUser allFeedUserCustom" style={{ height: "80%" }} >              
              {chatList?.length > 0 && chatList?.map((item, idx) => {
                let time = moment(item?.updatedAt).fromNow(true).split(" ");
                time = `${time[0]} ${time[1].slice(0, 1)}`;
                let oUser;
                item.users.forEach((element) => {
                  if (element?._id !== user?._id) {
                    oUser = element;
                  }
                });
                return (
                  <div className="feedUserChat" key={"feed-chat-" + idx} >
                    <Link
                      className="userFeedLink"
                    >
                      <div
                        className="FeedUserChatProfile"
                        onClick={(e) => handleNavigate(e, "/userprofile/" + oUser?._id)}
                      >
                        <div className="userProfileImg">
                          <ProfileImage url={isGroupChat ? item?.chatLogo : oUser?.profile_img} />
                          {isOnline.includes(oUser?._id) && <span className="msgOnline" />}
                          {/* <img src="/images/img/profile-image2.png" alt="profile-img" className="img-fluid" /> */}
                        </div>
                      </div>
                      <div className="FeedUserChatHead">
                        <div className="FeedUserChatName d-flex justify-content-between">
                          <h6
                            className="mb-0 FeedUserChatName-userName"
                            style={{ fontSize: "16px" }}
                            title={oUser?.user_name ? oUser?.user_name : "Vestorgrow user"}
                            // title={"Gangaram"}
                            // onClick={(e) => handleNavigate(e, "/userprofile/" + oUser?._id)}
                            onClick={(e) => {
                              if (
                                // e.target.classList.contains("image-fluid-custom-message") ||
                                // e.target.classList.contains("FeedUserChatName-userName") ||
                                e.target.classList.contains("img-fluid")
                              ) {
                                e.preventDefault();
                              } else {
                                let newArr = JSON.parse(localStorage.getItem("messageboxstate")) || [];
                                let obj = {
                                  chatId: item._id,
                                  isExpanded: false,
                                  isminimize: false,
                                  index: idx
                                }
                                let isPresent;
                                if (newArr) {
                                  isPresent = newArr.some(el => el.chatId === obj.chatId)
                                }
                                if (!isPresent) {
                                  newArr.push(obj)
                                  localStorage.setItem("messageboxstate", JSON.stringify(newArr))
                                  setMessageBoxState(newArr)
                                }
                                //console.log("ITEM:", item)
                                getMessage(item?._id, oUser, item?.users);
                                setShowMsg(true);
                              }
                            }}
                          >
                            {groupChat === false && (oUser?.user_name
                              ? oUser?.user_name?.length > 10
                                ? oUser?.user_name.slice(0, 10) + "..."
                                : oUser?.user_name
                              : "Vestorgrow user")}
                            {
                              groupChat && (item?.chatName.length > 10 ? item?.chatName.slice(0, 10) + "..." : item?.chatName)
                            }
                          </h6>

                          {/* {<span>{moment(latestMsgList[item?._id]?.createdAt).fromNow()}</span>} */}

                          <div style={{ fontSize: "16px" }}>
                            <ChatMsgTimeStamp dateTime={latestMsgList[item?._id]?.createdAt} onlyTime={false} />
                            <span>
                              <div className="btn-group">
                                <div type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                  <RiArrowDropDownLine style={{ fontSize: "30px", marginLeft: "px" }} />
                                </div>
                                <ul className="dropdown-menu dropdown-menu-end" style={{ zIndex: 999 }}>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="javascript:void(0);"
                                    >
                                      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.9196 7.6C18.8996 2.91 15.0996 0 10.9996 0C6.89958 0 3.09958 2.91 1.07958 7.6C1.02452 7.72617 0.996094 7.86234 0.996094 8C0.996094 8.13766 1.02452 8.27383 1.07958 8.4C3.09958 13.09 6.89958 16 10.9996 16C15.0996 16 18.8996 13.09 20.9196 8.4C20.9746 8.27383 21.0031 8.13766 21.0031 8C21.0031 7.86234 20.9746 7.72617 20.9196 7.6ZM10.9996 14C7.82958 14 4.82958 11.71 3.09958 8C4.82958 4.29 7.82958 2 10.9996 2C14.1696 2 17.1696 4.29 18.8996 8C17.1696 11.71 14.1696 14 10.9996 14ZM10.9996 4C10.2085 4 9.43509 4.2346 8.7773 4.67412C8.1195 5.11365 7.60681 5.73836 7.30406 6.46927C7.00131 7.20017 6.9221 8.00444 7.07644 8.78036C7.23078 9.55628 7.61174 10.269 8.17115 10.8284C8.73056 11.3878 9.44329 11.7688 10.2192 11.9231C10.9951 12.0775 11.7994 11.9983 12.5303 11.6955C13.2612 11.3928 13.8859 10.8801 14.3255 10.2223C14.765 9.56448 14.9996 8.79113 14.9996 8C14.9996 6.93913 14.5782 5.92172 13.828 5.17157C13.0779 4.42143 12.0604 4 10.9996 4ZM10.9996 10C10.604 10 10.2173 9.8827 9.88844 9.66294C9.55954 9.44318 9.30319 9.13082 9.15182 8.76537C9.00044 8.39991 8.96084 7.99778 9.03801 7.60982C9.11518 7.22186 9.30566 6.86549 9.58537 6.58579C9.86507 6.30608 10.2214 6.1156 10.6094 6.03843C10.9974 5.96126 11.3995 6.00087 11.7649 6.15224C12.1304 6.30362 12.4428 6.55996 12.6625 6.88886C12.8823 7.21776 12.9996 7.60444 12.9996 8C12.9996 8.53043 12.7889 9.03914 12.4138 9.41421C12.0387 9.78929 11.53 10 10.9996 10Z" fill="black" />
                                      </svg>
                                      <span style={{ fontSize: "18px", marginLeft: "5px" }}>View group info</span>

                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="javascript:void(0);"

                                    >
                                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.1098 13.3901L6.22984 17.2701C5.76007 17.7235 5.1327 17.9768 4.47984 17.9768C3.82698 17.9768 3.1996 17.7235 2.72984 17.2701C2.49944 17.0406 2.31663 16.7679 2.19189 16.4676C2.06715 16.1673 2.00294 15.8453 2.00294 15.5201C2.00294 15.1949 2.06715 14.8729 2.19189 14.5726C2.31663 14.2723 2.49944 13.9996 2.72984 13.7701L6.60984 9.89009C6.79814 9.70179 6.90393 9.4464 6.90393 9.18009C6.90393 8.91379 6.79814 8.6584 6.60984 8.47009C6.42153 8.28179 6.16614 8.176 5.89984 8.176C5.63353 8.176 5.37814 8.28179 5.18984 8.47009L1.30984 12.3601C0.528193 13.2109 0.105457 14.3308 0.129911 15.4858C0.154365 16.6409 0.624118 17.7419 1.44107 18.5589C2.25802 19.3758 3.359 19.8456 4.51408 19.87C5.66917 19.8945 6.78904 19.4717 7.63984 18.6901L11.5298 14.8101C11.7181 14.6218 11.8239 14.3664 11.8239 14.1001C11.8239 13.8338 11.7181 13.5784 11.5298 13.3901C11.3415 13.2018 11.0861 13.096 10.8198 13.096C10.5535 13.096 10.2981 13.2018 10.1098 13.3901ZM18.6898 1.31009C17.8486 0.474102 16.7108 0.00488281 15.5248 0.00488281C14.3389 0.00488281 13.2011 0.474102 12.3598 1.31009L8.46984 5.19009C8.3766 5.28333 8.30264 5.39402 8.25218 5.51585C8.20172 5.63767 8.17575 5.76824 8.17575 5.90009C8.17575 6.03195 8.20172 6.16252 8.25218 6.28434C8.30264 6.40617 8.3766 6.51686 8.46984 6.61009C8.56308 6.70333 8.67377 6.77729 8.79559 6.82775C8.91741 6.87821 9.04798 6.90419 9.17984 6.90419C9.3117 6.90419 9.44226 6.87821 9.56409 6.82775C9.68591 6.77729 9.7966 6.70333 9.88984 6.61009L13.7698 2.73009C14.2396 2.27672 14.867 2.02335 15.5198 2.02335C16.1727 2.02335 16.8001 2.27672 17.2698 2.73009C17.5002 2.95958 17.683 3.2323 17.8078 3.53261C17.9325 3.83292 17.9967 4.15491 17.9967 4.48009C17.9967 4.80528 17.9325 5.12727 17.8078 5.42758C17.683 5.72789 17.5002 6.00061 17.2698 6.23009L13.3898 10.1101C13.2961 10.2031 13.2217 10.3137 13.1709 10.4355C13.1202 10.5574 13.094 10.6881 13.094 10.8201C13.094 10.9521 13.1202 11.0828 13.1709 11.2047C13.2217 11.3265 13.2961 11.4371 13.3898 11.5301C13.4828 11.6238 13.5934 11.6982 13.7153 11.749C13.8371 11.7998 13.9678 11.8259 14.0998 11.8259C14.2318 11.8259 14.3626 11.7998 14.4844 11.749C14.6063 11.6982 14.7169 11.6238 14.8098 11.5301L18.6898 7.64009C19.5258 6.79887 19.995 5.66107 19.995 4.47509C19.995 3.28912 19.5258 2.15131 18.6898 1.31009ZM6.82984 13.1701C6.92328 13.2628 7.03409 13.3361 7.15593 13.3859C7.27777 13.4356 7.40823 13.4609 7.53984 13.4601C7.67144 13.4609 7.80191 13.4356 7.92374 13.3859C8.04558 13.3361 8.1564 13.2628 8.24984 13.1701L13.1698 8.25009C13.3581 8.06179 13.4639 7.8064 13.4639 7.54009C13.4639 7.27379 13.3581 7.0184 13.1698 6.83009C12.9815 6.64179 12.7261 6.536 12.4598 6.536C12.1935 6.536 11.9381 6.64179 11.7498 6.83009L6.82984 11.7501C6.73611 11.8431 6.66171 11.9537 6.61095 12.0755C6.56018 12.1974 6.53404 12.3281 6.53404 12.4601C6.53404 12.5921 6.56018 12.7228 6.61095 12.8447C6.66171 12.9665 6.73611 13.0771 6.82984 13.1701Z" fill="#0D1B1D" />
                                      </svg>
                                      <span style={{ fontSize: "18px", marginLeft: "5px" }}>copy link</span>
                                    </a>
                                  </li>
                                  <li>
                                    <button className="dropdown-item" type="button" >
                                      <AiOutlineRead style={{ fontSize: "25px" }} />
                                      <span style={{ fontSize: "18px", marginLeft: "5px" }}>Mark as read</span>
                                    </button>
                                  </li>
                                  {isGroupChat &&
                                    <li>
                                      <button className="dropdown-item" type="button"><MdTimeToLeave style={{ fontSize: "25px" }} />
                                        <span style={{ fontSize: "18px", marginLeft: "5px" }}>
                                          Leave Group
                                        </span>
                                      </button>
                                    </li>
                                  }
                                  {isGroupChat && (item.createdBy === user._id) && <li>
                                    <button className="dropdown-item" type="button" onClick={() => handleDeleteChat(item._id)}><MdDelete style={{ fontSize: "25px" }} />
                                      <span style={{ fontSize: "18px", marginLeft: "5px" }}>
                                        Delete Group
                                      </span>
                                    </button>
                                  </li>}
                                </ul>
                              </div>
                            </span>
                          </div>

                        </div>
                        <div className="FeedUserChatTxt FeedUserChatTxt-CustomWeb">
                          <p className="mb-0 text-break">
                            {latestMsgList[item?._id]?.content.length > 25
                              ? latestMsgList[item?._id]?.content.slice(0, 25) + "..."
                              : latestMsgList[item?._id]?.content}
                          </p>
                          {unreadCount[item?._id] > 0 && (
                            <span className="badge rounded-pill notificationBadge notificationBadgeCustom">
                              {unreadCount[item?._id]}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>)}
        </div>
      </div >
      <div
        className={
          getMessageData.length === 4
            ? "chatBoxParent chatBoxParent-cust-four"
            : getMessageData.length === 5
              ? "chatBoxParent chatBoxParent-cust-five"
              : "chatBoxParent"
        }
        style={{ position: "fixed", bottom: 0, right: "18.8em", zIndex: 9000, height: "auto", width: "auto" }}

      >
        {getMessageData.map((item, i) => {
          return (
            <ChatMessage
              index={i}
              chatId={item.id}
              socket={socket}
              latestMsgList={latestMsgList}
              setLatestMsgList={setLatestMsgList}
              setChatId={setChatId}
              getMessageData={item}
              onClose={() => {
                let newArray = messageBoxState?.filter((el) => el.chatId !== item?.id)
                localStorage.setItem("messageboxstate", JSON.stringify(newArray))
                setMessageBoxState(newArray);
                setGetMessageData(getMessageData.filter((i) => i.id !== item?.id));
                setChatCompare(chatCompare.filter((i) => i !== item?.id));
              }}
              getChatList={getChatList}
              setMediaFiles={setMediaFiles}
              isOnline={isOnline}

            />
          );
        })}
        {showComposeMsg && (
          <ComposeMessage
            onClose={() => {
              setShowComposeMsgDkst(false);
              setShowComposeMsg(!showComposeMsg);
              getChatList();
            }}
            onFinish={() => {
              getChatList();
              setShowComposeMsgDkst(false);
              setShowComposeMsg(!showComposeMsg);
              // setShowSentMsg(!showSentMsg);
              setShowSentMsg();
            }}
            deskView={showComposeMsgDkst}
          />
        )}
        {/* {showSentMsg && <SentMessage onClose={() => setShowSentMsg(!showSentMsg)} />} */}
      </div>
    </>
  );
}
