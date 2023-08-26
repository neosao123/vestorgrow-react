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

const serv = new ChatService();
const userServ = new UserService();
const chatServ = new ChatService()
let socket;
// let chatCompare = [];

export default function Chat({ setMediaFiles, setShowSentMsg }) {
  const navigate = useNavigate();
  const params = useParams();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [unreadMsgCount, setUnreadMsgCount] = globalCtx.unreadMsgCount;
  const [getMessageData, setGetMessageData] = globalCtx.getMessageData;
  const [chatList, setChatList] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState({});
  const [latestMsgList, setLatestMsgList] = useState({});
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
  useEffect(() => {
    getChatList();
    setShowMsg(false);
  }, [chatCompare, unreadCount, isGroupChat]);
  // useEffect(() => {
  //     if (params.id) {
  //         setTimeout(createChat(), 1000)
  //     }
  // }, [params.id])
  useEffect(() => {
    socket = io(process.env.REACT_APP_API_BASEURL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
  }, []);
  useEffect(() => {
    for (const item in unreadCount) {
      if (getMessageData.filter((i) => i.id == item).length > 0) {
        setUnreadCount({ ...unreadCount, [item]: 0 });
      }
    }
  }, [JSON.stringify(getMessageData)]);
  useEffect(() => {
    // document.getElementById('messages').scrollIntoView(false)
    var objDiv = document.getElementById("messages");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
    socket.on("messageRecieved", (newMessage) => {
      // console.log("socket", newMessage);
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
      console.log(error);
    }
  };
  // const createChat = async () => {
  //     try {
  //         let obj = {
  //             users: [params.id, user._id]
  //         }
  //         await serv.createChat(obj).then(resp => {
  //             if (resp.data) {
  //                 getChatList()
  //             }
  //         })
  //     } catch (error) {
  //         console.log(error);
  //     }
  // }







  const getChatList = async () => {

    try {
      let obj = {
        filter: {
          isGroupChat: isGroupChat,
        },
      };
      await serv.listAllChat(obj).then((resp) => {
        if (resp.data) {
          resp.data = resp.data.filter((i) => !i.deleted_for.includes(user._id));
          setChatList([...resp.data]);
          let unreadCountList = unreadCount;
          let latestMsgListTemp = latestMsgList;
          resp.data.map((item) => {
            if (item.latestMessage.sender !== user._id) {
              unreadCountList[item._id] = item.unreadCount;
            }
            latestMsgListTemp[item._id] = item.latestMessage;
          });
          // console.log("chat", unreadCountList, resp.data);
          setUnreadCount(unreadCountList);
          setLatestMsgList(latestMsgListTemp);
          // resp.data[0].users.forEach(element => {
          //     if (element._id !== user._id) {
          //         getMessage(resp.data[0]._id, element, resp.data[0].users)
          //     }
          // });

        }
      });
    } catch (err) {
      console.log(err);
      setisLoading(false)
    }
    setisLoading(false)
  };
  console.log("latestmsglist:", latestMsgList)

  const getMessage = async (id, oUser, users) => {
    if (getMessageData.findIndex((i) => i.id == id) == -1) {
      if (getMessageData.length > 4) {
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
      console.log(err);
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



  return (
    <>
      <div className="feedChatUser" style={{ width: "18em", height: "100%" }} >
        <div className="chatBoxGroupBottom" >
          <div className="feedChatHeading d-flex d-flex-Custom">
            <h5 className="mb-0">{isGroupChat ? "Groups" : "Messaging"}</h5>
            <div className="messageChatLeftHeadIcon" >
              {/* <div className="messageChatLeftHeadIcon ms-auto"> */}
              <div onClick={showComposeMsgHandler} >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_6323_52062)">
                    <path d="M20.9403 5.69162L23.3076 8.05771M22.4626 3.60719L16.0618 10.008C15.731 10.3383 15.5055 10.7591 15.4135 11.2173L14.8223 14.1769L17.7818 13.5846C18.2401 13.4929 18.6603 13.2683 18.9911 12.9374L25.392 6.53658C25.5843 6.34423 25.7369 6.11588 25.841 5.86457C25.9451 5.61326 25.9987 5.3439 25.9987 5.07188C25.9987 4.79986 25.9451 4.53051 25.841 4.27919C25.7369 4.02788 25.5843 3.79953 25.392 3.60719C25.1996 3.41484 24.9713 3.26226 24.72 3.15816C24.4687 3.05407 24.1993 3.00049 23.9273 3.00049C23.6553 3.00049 23.3859 3.05407 23.1346 3.15816C22.8833 3.26226 22.6549 3.41484 22.4626 3.60719V3.60719Z" stroke="#00808B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M23.7649 16.4115V19.7645C23.7649 20.3573 23.5294 20.9259 23.1102 21.3451C22.691 21.7643 22.1224 21.9998 21.5296 21.9998H9.23532C8.64248 21.9998 8.07392 21.7643 7.65471 21.3451C7.23551 20.9259 7 20.3573 7 19.7645V7.47019C7 6.87734 7.23551 6.30878 7.65471 5.88957C8.07392 5.47037 8.64248 5.23486 9.23532 5.23486H12.5883" stroke="#00808B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                  <defs>
                    <filter id="filter0_d_6323_52062" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="3" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6323_52062" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6323_52062" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
              <div className="gap" onClick={() => setShowChat(false)}>
                <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5002 6.35314C10.235 6.35314 9.98062 6.46217 9.79308 6.65623C9.60554 6.8503 9.50019 7.11351 9.50019 7.38796V9.03332L3.71019 3.03138C3.61695 2.9349 3.50626 2.85836 3.38443 2.80614C3.26261 2.75393 3.13204 2.72705 3.00019 2.72705C2.86833 2.72705 2.73776 2.75393 2.61594 2.80614C2.49411 2.85836 2.38342 2.9349 2.29019 3.03138C2.10188 3.22624 1.99609 3.49053 1.99609 3.7661C1.99609 4.04167 2.10188 4.30596 2.29019 4.50082L8.09019 10.4924H6.50019C6.23497 10.4924 5.98062 10.6014 5.79308 10.7955C5.60554 10.9896 5.50019 11.2528 5.50019 11.5272C5.50019 11.8017 5.60554 12.0649 5.79308 12.2589C5.98062 12.453 6.23497 12.562 6.50019 12.562H10.5002C10.6309 12.5604 10.76 12.5323 10.8802 12.4793C11.1245 12.3742 11.3187 12.1733 11.4202 11.9205C11.4714 11.796 11.4986 11.6624 11.5002 11.5272V7.38796C11.5002 7.11351 11.3948 6.8503 11.2073 6.65623C11.0198 6.46217 10.7654 6.35314 10.5002 6.35314ZM21.7102 21.6581L15.9102 15.6665H17.5002C17.7654 15.6665 18.0198 15.5575 18.2073 15.3634C18.3948 15.1693 18.5002 14.9061 18.5002 14.6317C18.5002 14.3572 18.3948 14.094 18.2073 13.8999C18.0198 13.7059 17.7654 13.5969 17.5002 13.5969H13.5002C13.3695 13.5985 13.2404 13.6266 13.1202 13.6796C12.8758 13.7846 12.6817 13.9856 12.5802 14.2384C12.5289 14.3628 12.5018 14.4964 12.5002 14.6317V18.7709C12.5002 19.0454 12.6055 19.3086 12.7931 19.5027C12.9806 19.6967 13.235 19.8058 13.5002 19.8058C13.7654 19.8058 14.0198 19.6967 14.2073 19.5027C14.3948 19.3086 14.5002 19.0454 14.5002 18.7709V17.1256L20.2902 23.1275C20.3831 23.2245 20.4937 23.3015 20.6156 23.354C20.7375 23.4066 20.8682 23.4336 21.0002 23.4336C21.1322 23.4336 21.2629 23.4066 21.3848 23.354C21.5066 23.3015 21.6172 23.2245 21.7102 23.1275C21.8039 23.0313 21.8783 22.9169 21.9291 22.7908C21.9798 22.6647 22.006 22.5294 22.006 22.3928C22.006 22.2562 21.9798 22.1209 21.9291 21.9948C21.8783 21.8687 21.8039 21.7543 21.7102 21.6581Z" fill="#465D61" />
                </svg>
              </div>
            </div>
          </div>
          {isloading ? (<div class="spinner-border text-primary" style={{ margin: "130px" }} role="status">
            <span class="visually-hidden">Loading...</span>
          </div>) : (<div className="feedChatUserMsgGroup" style={{ width: "18em", height: "100%" }}>
            <div className="allFeedUser allFeedUserCustom" style={{ height: "100%" }} >
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

                                const isPresent = newArr.some(el => el.chatId === obj.chatId)
                                if (!isPresent) {
                                  newArr.push(obj)
                                  localStorage.setItem("messageboxstate", JSON.stringify(newArr))
                                  setMessageBoxState(newArr)
                                }
                                console.log("chatitems:", item)
                                getMessage(item?._id, oUser, item?.users);
                                setShowMsg(true);
                              }
                            }}
                          >
                            {isGroupChat === false && (oUser?.user_name
                              ? oUser.user_name.length > 10
                                ? oUser?.user_name.slice(0, 10) + "..."
                                : oUser?.user_name
                              : "Vestorgrow user")}
                            {
                              isGroupChat && item?.chatName
                            }
                          </h6>

                          {/* {<span>{moment(latestMsgList[item?._id]?.createdAt).fromNow()}</span>} */}

                          <div style={{ fontSize: "16px" }}>
                            <ChatMsgTimeStamp dateTime={latestMsgList[item?._id]?.createdAt} onlyTime={false} />
                            <span>
                              <div class="btn-group">
                                <div type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                  <RiArrowDropDownLine style={{ fontSize: "30px", marginLeft: "px" }} />
                                </div>
                                <ul class="dropdown-menu dropdown-menu-end">
                                  <li><button class="dropdown-item" type="button" > <AiOutlineRead style={{ fontSize: "25px" }} /><span style={{ fontSize: "18px", marginLeft: "5px" }}>Mark as read</span></button></li>
                                  {item.isGroupChat && !item.groupAdmin.includes(user._id) && <li><button class="dropdown-item" type="button"><MdTimeToLeave /><span style={{ fontSize: "18px", marginLeft: "5px" }}>Leave Group</span></button></li>}
                                  <li><button class="dropdown-item" type="button" onClick={() => handleDeleteChat(item._id)}><MdDelete style={{ fontSize: "25px" }} /><span style={{ fontSize: "18px", marginLeft: "5px" }}>{item.isGroupChat ? "Delete Group" : "Delete Chat"}</span></button></li>
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
      </div>
      <div
        className={
          getMessageData.length === 4
            ? "chatBoxParent chatBoxParent-cust-four"
            : getMessageData.length === 5
              ? "chatBoxParent chatBoxParent-cust-five"
              : "chatBoxParent"
        }
        // style={{bottom:0}}
        style={{ position: "absolute", bottom: 0 }}
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
