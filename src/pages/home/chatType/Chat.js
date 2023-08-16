import React, { useEffect, useState, useContext } from "react";
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
const serv = new ChatService();
const userServ = new UserService();
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
  useEffect(() => {
    getChatList();
    setShowMsg(false);
  }, [chatCompare, unreadCount]);
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
          isGroupChat: false,
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
    }
  };

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
    e.preventDefault();
    navigate(url);
  };

  return (
    <>
      <div id="feedChat" className="feedChatUser">
        <div className="chatBoxGroupBottom">
          <div className="feedChatHeading d-flex d-flex-Custom">
            <h5 className="mb-0">Messaging</h5>
            <div className="messageChatLeftHeadIcon ms-auto" onClick={showComposeMsgHandler}>
              {/* <div className="messageChatLeftHeadIcon ms-auto"> */}
              <img src="/images/icons/compose-button.svg" alt="compose-button" className="img-fluid composeButton" />
            </div>
          </div>
          <div className="feedChatUserMsgGroup">
            <div className="allFeedUser allFeedUserCustom">
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
                  <div className="feedUserChat" key={"feed-chat-" + idx}>
                    <Link
                      className="userFeedLink"
                      onClick={(e) => {
                        if (
                          // e.target.classList.contains("image-fluid-custom-message") ||
                          // e.target.classList.contains("FeedUserChatName-userName") ||
                          e.target.classList.contains("img-fluid")
                        ) {
                          e.preventDefault();
                        } else {
                          getMessage(item?._id, oUser, item?.users);
                          setShowMsg(true);
                        }
                      }}
                    >
                      <div
                        className="FeedUserChatProfile"
                        onClick={(e) => handleNavigate(e, "/userprofile/" + oUser?._id)}
                      >
                        <div className="userProfileImg">
                          <ProfileImage url={oUser?.profile_img} />
                          {isOnline.includes(oUser?._id) && <span className="msgOnline" />}
                          {/* <img src="/images/img/profile-image2.png" alt="profile-img" className="img-fluid" /> */}
                        </div>
                      </div>
                      <div className="FeedUserChatHead">
                        <div className="FeedUserChatName d-flex justify-content-between">
                          <h6
                            className="mb-0 FeedUserChatName-userName"
                            title={oUser?.user_name ? oUser?.user_name : "Vestorgrow user"}
                          // onClick={(e) => handleNavigate(e, "/userprofile/" + oUser?._id)}
                          >
                            {oUser?.user_name
                              ? oUser.user_name.length > 15
                                ? oUser?.user_name.slice(0, 15) + "..."
                                : oUser?.user_name
                              : "Vestorgrow user"}
                          </h6>

                          {/* {<span>{moment(latestMsgList[item?._id]?.createdAt).fromNow()}</span>} */}
                          <ChatMsgTimeStamp dateTime={latestMsgList[item?._id]?.createdAt} onlyTime={false} />

                          {/* {unreadCount[item._id] > 0 && (
                              <span className="badge rounded-pill notificationBadge notificationBadgeCustom">
                                {unreadCount[item._id]}
                              </span>
                            )} */}
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
          </div>
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
      >
        {getMessageData.map((item) => {
          return (
            <ChatMessage
              chatId={item.id}
              socket={socket}
              latestMsgList={latestMsgList}
              setLatestMsgList={setLatestMsgList}
              setChatId={setChatId}
              getMessageData={item}
              onClose={() => {
                setGetMessageData(getMessageData.filter((i) => i.id !== item.id));
                setChatCompare(chatCompare.filter((i) => i !== item.id));
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
