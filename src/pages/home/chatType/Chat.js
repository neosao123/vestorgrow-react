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

import "./chat.css";

const serv = new ChatService();
const userServ = new UserService();
const chatServ = new ChatService()
let socket;
// let chatCompare = [];

export default function Chat({ setMediaFiles, setShowSentMsg, setShowCreateGroup }) {
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

  useEffect(() => {
    socket = io(process.env.REACT_APP_API_BASEURL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

  }, []);
  useEffect(() => {
    for (const item in unreadCount) {
      if (getMessageData.filter((i) => i.id == item).length > 0) {
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
      console.log(error);
    }
  };
  

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
          setUnreadCount(unreadCountList);
          setLatestMsgList(latestMsgListTemp);
        }
      });
    } catch (err) {
      console.log(err);
      setisLoading(false)
    }
    setisLoading(false)
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
              {!isGroupChat && <div onClick={showComposeMsgHandler} >
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
              </div>}
              {isGroupChat && <div onClick={() => setShowCreateGroup(true)}>
                <svg width="32" height="31" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.2981 15.8119C18.8749 15.2521 19.3376 14.5596 19.6547 13.7816C19.9718 13.0036 20.1359 12.1582 20.1359 11.3028C20.1359 9.69543 19.5664 8.15389 18.5527 7.0173C17.539 5.88071 16.1642 5.24219 14.7306 5.24219C13.297 5.24219 11.9221 5.88071 10.9084 7.0173C9.89473 8.15389 9.32524 9.69543 9.32524 11.3028C9.32523 12.1582 9.48935 13.0036 9.80645 13.7816C10.1236 14.5596 10.5862 15.2521 11.1631 15.8119C9.64971 16.5802 8.36575 17.821 7.4647 19.3859C6.56364 20.9508 6.08362 22.7735 6.08203 24.6362C6.08203 24.9576 6.19593 25.2659 6.39867 25.4933C6.60141 25.7206 6.87638 25.8483 7.1631 25.8483C7.44982 25.8483 7.72479 25.7206 7.92753 25.4933C8.13027 25.2659 8.24417 24.9576 8.24417 24.6362C8.24417 22.7073 8.92756 20.8575 10.144 19.4936C11.3604 18.1296 13.0103 17.3634 14.7306 17.3634C16.4509 17.3634 18.1007 18.1296 19.3172 19.4936C20.5336 20.8575 21.217 22.7073 21.217 24.6362C21.217 24.9576 21.3309 25.2659 21.5336 25.4933C21.7364 25.7206 22.0114 25.8483 22.2981 25.8483C22.5848 25.8483 22.8598 25.7206 23.0625 25.4933C23.2652 25.2659 23.3791 24.9576 23.3791 24.6362C23.3776 22.7735 22.8975 20.9508 21.9965 19.3859C21.0954 17.821 19.8115 16.5802 18.2981 15.8119ZM14.7306 14.9392C14.0891 14.9392 13.4621 14.7259 12.9288 14.3263C12.3954 13.9268 11.9797 13.3588 11.7343 12.6944C11.4888 12.0299 11.4246 11.2988 11.5497 10.5934C11.6748 9.88799 11.9837 9.24006 12.4373 8.7315C12.8909 8.22295 13.4687 7.87662 14.0979 7.73631C14.727 7.596 15.3791 7.66801 15.9717 7.94324C16.5643 8.21846 17.0708 8.68455 17.4272 9.28254C17.7836 9.88054 17.9738 10.5836 17.9738 11.3028C17.9738 12.2672 17.6321 13.1922 17.0239 13.8741C16.4157 14.5561 15.5907 14.9392 14.7306 14.9392ZM25.2602 15.327C25.9521 14.4535 26.404 13.3744 26.5616 12.2196C26.7192 11.0648 26.5758 9.8835 26.1486 8.81795C25.7214 7.7524 25.0286 6.848 24.1537 6.21361C23.2788 5.57922 22.2589 5.24188 21.217 5.24219C20.9303 5.24219 20.6553 5.36989 20.4526 5.59721C20.2498 5.82453 20.1359 6.13284 20.1359 6.45431C20.1359 6.77579 20.2498 7.08409 20.4526 7.31141C20.6553 7.53873 20.9303 7.66643 21.217 7.66643C22.0772 7.66643 22.9021 8.04955 23.5103 8.7315C24.1185 9.41345 24.4602 10.3384 24.4602 11.3028C24.4587 11.9395 24.3081 12.5645 24.0235 13.1154C23.739 13.6664 23.3304 14.1239 22.8386 14.4422C22.6783 14.5459 22.5445 14.6939 22.4498 14.8722C22.3552 15.0505 22.3029 15.253 22.2981 15.4604C22.2935 15.6662 22.3358 15.8698 22.4209 16.0522C22.5061 16.2346 22.6312 16.3897 22.7846 16.5028L23.2062 16.818L23.3467 16.9028C24.6498 17.5958 25.7492 18.6919 26.5153 20.062C27.2814 21.4321 27.6824 23.0191 27.671 24.6362C27.671 24.9576 27.7849 25.2659 27.9876 25.4933C28.1904 25.7206 28.4653 25.8483 28.7521 25.8483C29.0388 25.8483 29.3137 25.7206 29.5165 25.4933C29.7192 25.2659 29.8331 24.9576 29.8331 24.6362C29.842 22.7761 29.4265 20.9443 28.6261 19.315C27.8257 17.6857 26.667 16.3129 25.2602 15.327Z" fill="#00808B" />
                  <path d="M4.573 16.2023C3.88115 15.2966 3.42922 14.1777 3.2716 12.9804C3.11399 11.7831 3.25741 10.5583 3.68461 9.45352C4.11181 8.34874 4.80457 7.41104 5.6795 6.75329C6.55444 6.09553 7.57425 5.74577 8.6162 5.74609C8.90291 5.74609 9.17789 5.8785 9.38063 6.11419C9.58337 6.34988 9.69727 6.66954 9.69727 7.00285C9.69727 7.33616 9.58337 7.65582 9.38063 7.89151C9.17789 8.1272 8.90291 8.2596 8.6162 8.2596C7.75604 8.2596 6.93112 8.65683 6.3229 9.36389C5.71468 10.071 5.37299 11.0299 5.37299 12.0299C5.37452 12.69 5.5251 13.338 5.80967 13.9092C6.09425 14.4805 6.50284 14.9548 6.99459 15.2849C7.15487 15.3923 7.28874 15.5458 7.38338 15.7307C7.47803 15.9155 7.53027 16.1255 7.53513 16.3405C7.53965 16.5539 7.49736 16.7651 7.41225 16.9542C7.32714 17.1433 7.202 17.304 7.04864 17.4213L6.62703 17.7481L6.48649 17.8361C5.18337 18.5546 4.08402 19.691 3.3179 21.1116C2.55178 22.5321 2.15081 24.1776 2.16221 25.8542C2.16221 26.1875 2.04831 26.5071 1.84557 26.7428C1.64283 26.9785 1.36786 27.1109 1.08114 27.1109C0.794425 27.1109 0.51945 26.9785 0.31671 26.7428C0.113971 26.5071 7.34329e-05 26.1875 7.34329e-05 25.8542C-0.00876427 23.9256 0.406746 22.0264 1.20712 20.3371C2.0075 18.6478 3.16615 17.2244 4.573 16.2023Z" fill="#00808B" />
                  <path d="M23 17.744C27.3055 17.744 30.75 14.133 30.75 9.73627C30.75 5.3395 27.3055 1.72852 23 1.72852C18.6945 1.72852 15.25 5.3395 15.25 9.73627C15.25 14.133 18.6945 17.744 23 17.744Z" fill="#00808B" stroke="white" stroke-width="1.5" />
                  <path d="M25.7852 9.4786H23.2477V6.84767C23.2477 6.73137 23.2031 6.61984 23.1238 6.53761C23.0445 6.45538 22.9369 6.40918 22.8247 6.40918C22.7126 6.40918 22.605 6.45538 22.5257 6.53761C22.4464 6.61984 22.4018 6.73137 22.4018 6.84767V9.4786H19.8643C19.7522 9.4786 19.6446 9.5248 19.5653 9.60703C19.486 9.68927 19.4414 9.8008 19.4414 9.91709C19.4414 10.0334 19.486 10.1449 19.5653 10.2272C19.6446 10.3094 19.7522 10.3556 19.8643 10.3556H22.4018V12.9865C22.4018 13.1028 22.4464 13.2143 22.5257 13.2966C22.605 13.3788 22.7126 13.425 22.8247 13.425C22.9369 13.425 23.0445 13.3788 23.1238 13.2966C23.2031 13.2143 23.2477 13.1028 23.2477 12.9865V10.3556H25.7852C25.8973 10.3556 26.0049 10.3094 26.0842 10.2272C26.1635 10.1449 26.2081 10.0334 26.2081 9.91709C26.2081 9.8008 26.1635 9.68927 26.0842 9.60703C26.0049 9.5248 25.8973 9.4786 25.7852 9.4786Z" fill="white" stroke="white" stroke-width="0.5" />
                </svg>

              </div>}
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
                console.log("item:",item)
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
                                <ul class="dropdown-menu dropdown-menu-end" style={{zIndex:999}}>
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
                                    <button class="dropdown-item" type="button" >
                                      <AiOutlineRead style={{ fontSize: "25px" }} />
                                      <span style={{ fontSize: "18px", marginLeft: "5px" }}>Mark as read</span>
                                    </button>
                                  </li>
                                  {isGroupChat && 
                                    <li>
                                      <button class="dropdown-item" type="button"><MdTimeToLeave style={{fontSize:"25px"}} />
                                        <span style={{ fontSize: "18px", marginLeft: "5px" }}>
                                          Leave Group
                                        </span>
                                      </button>
                                    </li>
                                  }
                                  {isGroupChat && (item.createdBy===user._id) && <li>
                                    <button class="dropdown-item" type="button" onClick={() => handleDeleteChat(item._id)}><MdDelete style={{ fontSize: "25px" }} />
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
