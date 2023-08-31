import React, { useEffect, useState, useContext } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useParams, useNavigate, Link } from "react-router-dom";
import GlobalContext from "../../../context/GlobalContext";
import ChatService from "../../../services/chatService";
import ProfileImage from "../../../shared/ProfileImage";
import moment from "moment";
import DeleteMessage from "../../../popups/message/DeleteMessage";
import BlockUser from "../../../popups/user/BlockUser";
import DeleteChat from "../../../popups/message/DeleteChat";
import ImageCarousel from "../../../popups/imageCarousel/ImageCarousel";
import VideoImageThumbnail from "react-video-thumbnail-image";
import Linkify from "react-linkify";
import { SecureLink } from "react-secure-link";
import { AiOutlineMinus } from "react-icons/ai"
import { RiArrowDropDownLine } from "react-icons/ri"
import { motion } from 'framer-motion';
import maxIcon from "../../../assets/images/maximize.svg"
import minIcon from "../../../assets/images/minimize.svg"
const serv = new ChatService();
const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];
export default function ChatMessage({
  chatId,
  socket,
  latestMsgList,
  setLatestMsgList,
  setChatId,
  getMessageData,
  getChatList,
  onClose,
  setMediaFiles,
  isOnline,
  index,
  item
}) {
  let chatCompare = chatId;
  const navigate = useNavigate();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [messageData, setMessageData] = globalCtx.getMessageData;
  const [mUser, setMUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [showDeleteMsgPopup, setShowDeleteMsgPopup] = useState(null);
  const [showBlockUserPopup, setShowBlockUserPopup] = useState(null);
  const [showDeleteChatPopup, setShowDeleteChatPopup] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const [activeBtn, setActiveBtn] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [expanded, setExpanded] = globalCtx.expandedArray;
  const [messageBoxState, setMessageBoxState] = globalCtx.MessageBoxStateMaintainance;

  // const [mediaFiles, setMediaFiles] = useState([]);
  const [expend, setExpend] = useState(false); //0 for normal 1 for expend 2 for minimize
  const [message, setMessage] = useState({
    content: "",
    file: "",
    sender: user?._id,
  });
  const [isGroupChat, setisGroupChat] = globalCtx.isGroupChat;
  const [chatName, setChatName] = useState(null)
  const [chatLogo, setChatLogo] = useState(null)



  useEffect(() => {
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
      } else {
        setMessageList([...messageList, newMessage]);
      }
    });
  });
  useEffect(() => {
    getMessage(getMessageData.id, getMessageData.oUser, getMessageData.users);
  }, [getMessageData]);

  // console.log("messageData:",messageData)

  const getChat = async () => {
    try {
      const res = await serv.getChat(chatId)
      return res.data;
    } catch (err) {
      console.log(err)
    }
  }



  useEffect(() => {
    getChat()
      .then((res) => {
        setChatName(res.chatName)
        setChatLogo(res.chatLogo)
      })
  }, [])



  useEffect(() => {
    let newArr = JSON.parse(localStorage.getItem("messageboxstate"))
    if (messageData.length >= 4) {
      newArr.forEach((el, i) => {
        if (i === 0) {
          el.isminimize = true
        }
      })
    }
    if (messageData.length >= 5) {

      newArr.forEach((el, i) => {
        if (i === 1) {
          el.isminimize = true
        }
      })
    }
    if (newArr.length > 5) {
      newArr = newArr.slice(1)
    }
    localStorage.setItem("messageboxstate", JSON.stringify(newArr))
    setMessageBoxState(newArr)

  }, [messageData])

  useEffect(() => {
    messageBoxState.filter((el) => {
      if (el.chatId === chatCompare) {
        setMinimize(el.isminimize)
        setExpend(el.isExpanded)
      }
    })

  }, [messageBoxState])
  useEffect(() => {
    var objDiv = document.getElementById(`messagess${chatId}`);
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [messageList]);
  const getMessage = async (id, oUser, users) => {
    setMUser(oUser);
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
        }


        var objDiv = document.getElementById(`messagess${chatId}`);
        if (objDiv) {
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      });
    } catch (err) {
      console.log(err);
    }
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
              if (item === payload.chat) {
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

  let date = moment(Date()).format("DD MMMM YYYY");
  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  };
  const handleNavigate = (url) => {
    navigate(url);
  };
  const handleMaximize = (currChatId) => {

    let existingArr = JSON.parse(localStorage.getItem("messageboxstate"));


    // console.log(currChatId, existingArr)
    if (expend) {
      console.log(expend)
      existingArr.forEach((el) => {
        if (el.chatId === currChatId) {
          el.isExpanded = false;
        }
      })
      localStorage.setItem("messageboxstate", JSON.stringify(existingArr))
      setMessageBoxState(existingArr)
    } else {
      if (messageData.length >= 3) {
        existingArr.forEach((el) => {
          if (el.chatId === currChatId) {
            el.isExpanded = true;
          }
          else {
            el.isminimize = true;
            el.isExpanded = false
          }
        })
        localStorage.setItem("messageboxstate", JSON.stringify(existingArr))
        setMessageBoxState(existingArr)
      } else {
        existingArr.forEach((el) => {
          if (el.chatId === currChatId) {
            el.isExpanded = true;
          }
        })
        localStorage.setItem("messageboxstate", JSON.stringify(existingArr))
        setMessageBoxState(existingArr)
      }
    }

  }

  return (
    <>
      {!minimize ? (<motion.div
        initial={!minimize ? 'hidden' : 'visible'}
        animate={!minimize ? 'visible' : 'hidden'}
        exit="hidden"
        variants={{
          visible: { opacity: 1, scale: 1, x: 0, y: 0 },
          hidden: { opacity: 0, scale: 0, x: 0, y: 0 },
        }}
        transition={{ duration: 0.3 }}
      ><div className={`chatBox chatBoxCustom position-relative  ${expend ? "chatBoxLarge" : ""}`} style={{ border: "1px solid white", borderRadius: "15px 15px 5px 5px" }} >
          <div
            className="chatBoxHead position-relative"
            onClick={(e) => {
              if (
                e.target.classList.contains("img-dots") ||
                e.target.classList.contains("search_cross") ||
                e.target.classList.contains("chatBoxUser") ||
                e.target.classList.contains("userProfileImg")
              ) {
                e.preventDefault();
              } else {
                if (expend == 2) {
                  let existingArr = JSON.parse(localStorage.getItem("messageboxstate"))
                  let newArr = existingArr.map((el, i) => {
                    if (el.chatId === chatCompare) {
                      el.isExpanded = false
                    }
                  })
                  localStorage.setItem("messageboxstate", JSON.stringify(newArr))
                  // setExpend(0);
                }
              }
            }}
          >

            <div className="userProfileImg" onClick={() => { handleNavigate("/userprofile/" + mUser?._id) }}>
              <ProfileImage url={isGroupChat ? chatLogo : mUser?.profile_img} style={{ width: "32px", borderRadius: "50%" }} />
              {isOnline.includes(mUser?._id) && <span className="msgOnline" />}
            </div>
            <div className="chatBoxUser" onClick={() => handleNavigate("/userprofile/" + mUser?._id)}>
              <h6 className={`mb-0 ${expend ? "userName-custom-classExpand" : "userName-custom-class"}`}>
                <span className="mb-0" title={mUser?.user_name ? mUser?.user_name : "Vestorgrow user"}>
                  {!isGroupChat && (mUser?.user_name
                    ? mUser.user_name.length > 15
                      ? mUser?.user_name.slice(0, 15) + "..."
                      : mUser?.user_name
                    : "Vestorgrow user")}
                  {
                    isGroupChat && chatName
                  }
                </span>{" "}
                {mUser?.role.includes("userPaid") ? <img src="/images/icons/green-tick.svg" alt="Subscribed User" /> : ""}
              </h6>
              <p>{isOnline.includes(mUser?._id) ? "Online" : "Offline"}</p>
            </div>
            <div className="options">
              <div className="dropdown">
                <div onClick={() => {
                  // setMinimize(true)
                  let existingArr = JSON.parse(localStorage.getItem("messageboxstate")) || [];
                  existingArr.forEach((el) => {
                    if (el.chatId === chatCompare) {
                      el.isminimize = true
                    }
                  })
                  localStorage.setItem("messageboxstate", JSON.stringify(existingArr))
                  setMessageBoxState(existingArr)
                }}>
                  <AiOutlineMinus style={{ color: "black" }} />
                </div>
              </div>
              <span onClick={() => handleMaximize(chatCompare)}>
                {expend && <img src={maxIcon} alt="dots" className="img-fluid" />}
                {!expend && <img src={minIcon} alt="dots" className="img-fluid" />}
              </span>
              <span onClick={onClose}>
                <img src="images/profile/cross-icon.svg" className="search_cross" alt="" />
              </span>
            </div>
          </div>
          <div>
            <div
              className={`messagess msgSection msgSection-Custom allFeedUser overflowScrollStop ${expend ? "msgSectionLarge" : ""
                }`}
              id={`messagess${chatId}`}
            >
              <div className="userDetail">
                <div className="chatMainProfile">
                  <ProfileImage url={isGroupChat ? chatLogo : mUser?.profile_img} />
                  <div className="chatMainProfileContent">
                    <h6
                      className={`mb-0 ${expend ? "userNameIn-custom-classExpand" : "userNameIn-custom-class"}`}
                      title={mUser?.user_name ? mUser?.user_name : "Vestorgrow user"}
                    >
                      {!isGroupChat && (mUser?.user_name
                        ? mUser.user_name.length > 15
                          ? mUser?.user_name.slice(0, 15) + "..."
                          : mUser?.user_name
                        : "Vestorgrow user")}
                      {
                        isGroupChat && chatName
                      }
                    </h6>
                    {!isGroupChat && <p>
                      {mUser?.first_name} {mUser?.last_name}
                    </p>}
                    {isGroupChat && <p>
                      {user?.first_name} {user?.last_name}
                    </p>}
                    {!isGroupChat && <p>{mUser?.bio}</p>}
                    {isGroupChat && <p></p>}
                  </div>
                </div>
              </div>
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
                      <div className="chatWeeks chatWeeksMargin">
                        <h6 style={{ color: "#d1d1d1" }}>{itemDate === moment(Date()).format("DD MMMM YYYY") ? "Today" : itemDate}</h6>
                      </div>
                    )}
                    {!(item.deleted_for?.includes("all") || item.deleted_for?.includes(user?._id)) && (
                      <div
                        className={
                          "messgage-sectionCustom left-section " +
                          (item.sender?._id == user?._id ? "right-section" : "")
                        }
                      >
                        <div className="chatprofileImg">
                          <ProfileImage url={item.sender?.profile_img} />
                        </div>
                        {item.deleted_for?.includes("all") || item.deleted_for?.includes(user?._id) ? (
                          <div className="position-relative">
                            <div className="msgContentHead">
                              <div className=" deleteMsg w-100">
                                <p className="mb-0">Message Deleted</p>
                              </div>
                              {/* <a href="javascript:void(0);" data-bs-toggle="dropdown"><img src="/images/icons/dots.svg" alt="dots" className="img-fluid" /></a> */}
                              <div className="messageDropDownCustom-web">
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
                            <span className="msgTime msgTime-autoCustom">{moment(item.createdAt).format("HH:mm")}</span>
                          </div>
                        ) : (
                          <div className="position-relative messgage-sectionCustom">
                            <div className="msgContentHead">
                              <div className={`msgContent h-100 ${expend ? "msgContentLarge" : ""}`}>

                                {item.file?.length > 0 && (
                                  <div className="chatGallery d-flex align-items-center">
                                    <div className="groupGallery" >
                                      <div
                                        className={
                                          "chatGalleryInner d-flex flex-wrap " +
                                          (item.sender?._id === user?._id && "flex-row-reverse")
                                        }

                                      >

                                        {item.file.map((i, idx) => {
                                          return (

                                            <div
                                              className="galleryImage"
                                              onClick={() => {
                                                setMediaFiles([...item.file]);
                                                setImageIdx(idx);
                                              }}
                                            >
                                              {isImage.includes(i.split(".").pop()) ? (
                                                <img src={i} alt="profile-img" className="img-fluid" />
                                              ) : (
                                                <VideoImageThumbnail videoUrl={i} alt="video" />
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                )}
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
                                  {/* */}
                                  {/* EDEDED */}
                                  {item.content && <p
                                    className="whiteSpace text-break"
                                    style={{ color: `${item.sender?._id === user?._id ? "#ffffff" : "#282828"}`, fontSize: "16px" }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        display: "flex",
                                        justifyContent: "space-between"
                                      }}
                                    >
                                      <span> {item.sender?._id !== user?._id &&
                                        <span style={{ color: `${!isGroupChat && "#00808B"}`, marginRight: "0.3rem" }}>
                                          {mUser?.user_name.length <= 15 ? mUser?.user_name : mUser?.user_name.slice(0, 15) + "..."}</span>
                                      }{moment(item.createdAt).format("HH:mm")}
                                      </span>
                                      <span className="dropdown" >
                                        <a href="javascript:void(0);" data-bs-toggle="dropdown">
                                          {item.sender?._id !== user?._id && <RiArrowDropDownLine style={{ fontSize: "14px", color: `${item.sender?._id !== user?._id ? "#282828" : "#ffffff"}` }} />}
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
                                      </span>
                                    </span>
                                    <br />
                                    {item.content}
                                  </p>}
                                </Linkify>
                              </div>
                              {/* <a href="javascript:void(0);" data-bs-toggle="dropdown"><img src="/images/icons/dots.svg" alt="dots" className="img-fluid" /></a> */}
                              <div className="messageDropDownCustom-web">

                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              })}
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
                  perLine={6}
                  onClickOutside={(e) => {
                    if (!e.target.closest("#emojiPickerChat-id-custom")) {
                      setShowEmoji(false);
                    }
                  }}
                  onEmojiSelect={(e) => setMessage({ ...message, content: message.content + e.native })}
                />
              </div>
            )}
            {message.file && (
              <div
                // className="imagePreview imagePreviewChat"
                className={
                  message.content.length < 25
                    ? "imagePreview imagePreviewChat"
                    : message.content.length < 60
                      ? "imagePreview imagePreviewChat imagePreviewChat-two"
                      : "imagePreview imagePreviewChat imagePreviewChat-three"
                }
              >
                <button type="button" className="btn-close" onClick={() => setMessage({ ...message, file: "" })} />
                <img src={URL.createObjectURL(message.file[0])} className="img-fluid imagePreData" alt="" />
              </div>
            )}
            <div
              className={`textArea chatInput ${expend ? "textAreaLarge" : ""} textAreaCustom`}
              id="emojiPickerChat-id-custom"
              style={{ backgroundColor: "white" }}
            >
              <textarea
                className="form-control gray-color-custom input-group-custom input-group-msg-custom allFeedUser"
                rows={message.content.length < 25 ? "1" : message.content.length < 60 ? "1" : "1"}
                type="text"
                // style={{height:"unset"}}
                placeholder="Type your message..."
                onChange={(e) => setMessage({ ...message, content: e.target.value })}
                onKeyDown={handleKeypress}

                value={message.content}
                style={{ height: "unset", borderRadius: `${expend ? "30px" : "25px"}`, paddingRight: `${expend ? "25px" : "20px"}`, paddingLeft: `${expend ? "25px" : "20px"}`, paddingTop: `${expend ? "12px" : "8px"}`, paddingBottom: `${expend ? "12px" : "8px"}`, width: "100%", marginBottom: "5px", fontSize: `${expend ? "20px" : "18px"}`, resize: "none" }}
              />
              <div style={{ backgroundColor: "white", display: "flex", position: "relative" }}>
                <span className="input-group-text file-upload gray-color-custom" style={{ backgroundColor: "white" }} >
                  <a href="javascript:void(0);">
                    <label htmlFor={`imagess${chatId}`}>
                      {/* <img src="/images/icons/img-upload.svg" width={expend && "25px"} alt="file-upload" className="img-fluid" /> */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_6517_57009)">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.58845 18.5196C1.60661 16.2176 1.8661 12.7449 4.16806 10.7631L6.6689 8.60997C7.12929 8.2136 7.82383 8.26549 8.2202 8.72588C8.61657 9.18627 8.56467 9.88081 8.10428 10.2772L5.60344 12.4303C4.22227 13.6194 4.06657 15.703 5.25568 17.0842C6.44479 18.4653 8.52841 18.621 9.90959 17.4319L12.4104 15.2788C12.8708 14.8824 13.5654 14.9343 13.9617 15.3947C14.3581 15.8551 14.3062 16.5496 13.8458 16.946L11.345 19.0991C9.04301 21.081 5.5703 20.8215 3.58845 18.5196Z" fill="#222222" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.88761 7.29063C9.49124 6.83025 9.54314 6.13571 10.0035 5.73933L12.5044 3.58624C14.8063 1.60437 18.279 1.86383 20.2609 4.16576C22.2427 6.46769 21.9832 9.9404 19.6813 11.9223L17.1804 14.0754C16.7201 14.4717 16.0255 14.4198 15.6291 13.9595C15.2328 13.4991 15.2847 12.8045 15.7451 12.4082L18.2459 10.2551C19.6271 9.06594 19.7828 6.98232 18.5937 5.60116C17.4046 4.22 15.3209 4.06432 13.9398 5.25344L11.4389 7.40654C10.9785 7.80291 10.284 7.75102 9.88761 7.29063Z" fill="#222222" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.59074 14.2135C8.19437 13.7531 8.24627 13.0586 8.70666 12.6622L13.7083 8.35599C14.1687 7.95962 14.8633 8.01151 15.2596 8.4719C15.656 8.93228 15.6041 9.62683 15.1437 10.0232L10.142 14.3294C9.68165 14.7258 8.98711 14.6739 8.59074 14.2135Z" fill="#222222" />
                        </g>
                        <defs>
                          <clipPath id="clip0_6517_57009">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </label>
                  </a>
                </span>
                <span className="input-group-text gray-color-custom emoji" id="emojiPickerChat-btn-id-custom" style={{ backgroundColor: "white" }} >
                  <a href="javascript:void(0);" onClick={() => setShowEmoji(!showEmoji)}>
                    <img src="/images/icons/smile.svg" width={expend && "25px"} className="img-fluid" alt="smile-emoji" />
                  </a>
                </span>
                <div className="sendBtn sendBtnCustom message-btn-resize-custom" style={{ position: "absolute", right: 0 }}>
                  <button type="button" onClick={sendMessage} className="btn p-0" disabled={activeBtn}>
                    {activeBtn ? (
                      <i className="fa-solid fa-spinner"></i>
                    ) : (
                      <img src="/images/icons/send.svg" alt="send" className="img-fluid" />
                    )}
                  </button>
                </div>
              </div>
              <input
                style={{ display: "none" }}
                type="file"
                name="images"
                id={`imagess${chatId}`}
                accept="image/*"
                multiple={true}
                onChange={(event) => {
                  setMessage({ ...message, file: [...message.file, ...event.currentTarget.files] });
                  event.target.value = null;
                }}
              />
            </div>
          </div>
        </div></motion.div >) : (
        <motion.div
          initial={minimize ? 'hidden' : 'visible'}
          animate={minimize ? 'visible' : 'hidden'}
          exit="hidden"
          variants={{
            visible: { opacity: 1, scale: 1, x: 0, y: 0 },
            hidden: { opacity: 0, scale: 1, x: '100%', y: '100%' },
          }}
          transition={{ duration: 1 }}
        >
          <div style={{ zIndex: 300, width: "60px", margin: "0.5rem" }} onClick={() => {
            // setMinimize(false)
            let existingArr = JSON.parse(localStorage.getItem("messageboxstate")) || [];
            existingArr.forEach((el) => {
              if (el.chatId === chatCompare) {
                el.isminimize = false
              }
            })
            localStorage.setItem("messageboxstate", JSON.stringify(existingArr))
            setMessageBoxState(existingArr)
          }}>
            <ProfileImage url={isGroupChat ? chatLogo : mUser?.profile_img} style={{ width: "60px", borderRadius: "50%" }} />
          </div>
        </motion.div>
      )
      }
      {
        showDeleteMsgPopup && (
          <DeleteMessage
            onClose={() => setShowDeleteMsgPopup(null)}
            onFinish={() => {
              setShowDeleteMsgPopup(null);
              getMessage(showDeleteMsgPopup.chat, mUser, users);
            }}
            message={showDeleteMsgPopup}
          />
        )
      }
      {
        showDeleteChatPopup && (
          <DeleteChat
            onClose={() => setShowDeleteChatPopup(null)}
            onFinish={() => {
              setShowDeleteChatPopup(null);
              getChatList();
              onClose();
            }}
            chat={showDeleteChatPopup}
          />
        )
      }
      {
        showBlockUserPopup && (
          <BlockUser
            onClose={() => setShowBlockUserPopup(null)}
            onFinish={() => {
              setShowBlockUserPopup(null);
              getChatList();
              onClose();
            }}
            user={showBlockUserPopup}
          />
        )
      }
      {/* {mediaFiles && mediaFiles.length > 0 && (
        <ImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} imageIdx={imageIdx} />
      )} */}
    </>
  );
}
