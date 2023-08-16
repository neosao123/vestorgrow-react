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
}) {
  let chatCompare = chatId;
  const navigate = useNavigate();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [mUser, setMUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [showDeleteMsgPopup, setShowDeleteMsgPopup] = useState(null);
  const [showBlockUserPopup, setShowBlockUserPopup] = useState(null);
  const [showDeleteChatPopup, setShowDeleteChatPopup] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const [activeBtn, setActiveBtn] = useState(false);
  // const [mediaFiles, setMediaFiles] = useState([]);
  const [expend, setExpend] = useState(0); //0 for normal 1 for expend 2 for minimize
  const [message, setMessage] = useState({
    content: "",
    file: "",
    sender: user?._id,
  });

  useEffect(() => {
    // var objDiv = document.getElementById(`messagess${chatId}`);
    // objDiv.scrollTop = objDiv.scrollHeight;
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
        // for (const item in unreadCount) {
        //     if (item == newMessage.chat) {
        //         setUnreadCount({ ...unreadCount, [item]: unreadCount[item] + 1 })
        //     }
        // }
      } else {
        setMessageList([...messageList, newMessage]);
      }
    });
  });
  useEffect(() => {
    getMessage(getMessageData.id, getMessageData.oUser, getMessageData.users);
  }, [getMessageData]);

  useEffect(() => {
    var objDiv = document.getElementById(`messagess${chatId}`);
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [messageList]);
  const getMessage = async (id, oUser, users) => {
    setMUser(oUser);
    // setChatId(id)
    // chatCompare = id
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
        objDiv.scrollTop = objDiv.scrollHeight;
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

  return (
    <>
      <div className={`chatBox chatBoxCustom position-relative ${expend === 1 ? "chatBoxLarge" : ""}`}>
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
                setExpend(0);
              }
            }
          }}
        >
          {/* <img src="/images/img/profile-image3.png" alt="profile-img" className="img-fluid" /> */}
          <div className="userProfileImg" onClick={() => handleNavigate("/userprofile/" + mUser?._id)}>
            <ProfileImage url={mUser?.profile_img} style={{ width: "32px", borderRadius: "50%" }} />
            {isOnline.includes(mUser?._id) && <span className="msgOnline" />}
          </div>
          <div className="chatBoxUser" onClick={() => handleNavigate("/userprofile/" + mUser?._id)}>
            <h6 className={`mb-0 ${expend === 1 ? "userName-custom-classExpand" : "userName-custom-class"}`}>
              <span className="mb-0" title={mUser?.user_name ? mUser?.user_name : "Vestorgrow user"}>
                {mUser?.user_name
                  ? mUser.user_name.length > 15
                    ? mUser?.user_name.slice(0, 15) + "..."
                    : mUser?.user_name
                  : "Vestorgrow user"}
              </span>{" "}
              {mUser?.role.includes("userPaid") ? <img src="/images/icons/green-tick.svg" alt="Subscribed User" /> : ""}
            </h6>
            <p>{isOnline.includes(mUser?._id) ? "Online" : "Offline"}</p>
          </div>
          <div className="options">
            <div className="dropdown">
              <Link data-bs-toggle="dropdown">
                <img src="/images/icons/dots.svg" alt="dots" className="img-fluid img-dots" />
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item">
                    Report
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" href="javascript:void(0);" onClick={() => handleBlockUser(mUser)}>
                    Block
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="javascript:void(0);" onClick={() => setExpend(2)}>
                    Minimize
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
            <a href="javascript:void(0);" onClick={() => setExpend(expend !== 0 ? 0 : 1)}>
              <img src="/images/icons/expend.svg" alt="dots" className="img-fluid" />
            </a>
            <a href="javascript:void(0);" onClick={onClose}>
              <img src="images/profile/cross-icon.svg" className="search_cross" alt="" />
            </a>
          </div>
        </div>
        {expend !== 2 && (
          <>
            <div
              className={`messagess msgSection msgSection-Custom allFeedUser overflowScrollStop ${expend === 1 ? "msgSectionLarge" : ""
                }`}
              id={`messagess${chatId}`}
            >
              <div className="userDetail">
                <div className="chatMainProfile">
                  <ProfileImage url={mUser?.profile_img} />
                  <div className="chatMainProfileContent">
                    <h6
                      className={`mb-0 ${expend === 1 ? "userNameIn-custom-classExpand" : "userNameIn-custom-class"}`}
                      title={mUser?.user_name ? mUser?.user_name : "Vestorgrow user"}
                    >
                      {/* {mUser?.user_name ? mUser?.user_name : "Vestorgrow user"} */}
                      {mUser?.user_name
                        ? mUser.user_name.length > 15
                          ? mUser?.user_name.slice(0, 15) + "..."
                          : mUser?.user_name
                        : "Vestorgrow user"}
                    </h6>
                    <p>
                      {mUser?.first_name} {mUser?.last_name}
                    </p>
                    <p>{mUser?.bio}</p>
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
                        <h6>{itemDate === moment(Date()).format("DD MMMM YYYY") ? "Today" : itemDate}</h6>
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
                              <div className={`msgContent h-100 ${expend === 1 ? "msgContentLarge" : ""}`}>
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
                                            // <div
                                            //   className="galleryImage"
                                            //   onClick={() => {
                                            //     setMediaFiles([...item.file]);
                                            //     setImageIdx(idx);
                                            //   }}
                                            // >
                                            //   <img src={i} alt="profile-image" className="img-fluid" />
                                            // </div>
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
                                  {item.content && <p className="whiteSpace text-break">{item.content}</p>}
                                </Linkify>
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
              className={`textArea chatInput ${expend === 1 ? "textAreaLarge" : ""} textAreaCustom`}
              id="emojiPickerChat-id-custom"
            >
              {/* <input type="text" className="form-control gray-color-custom" placeholder="Write your message..." /> */}
              {/* <input
            type="text"
            className="form-control gray-color-custom input-group-custom"
            onChange={(e) => setMessage({ ...message, content: e.target.value })}
            value={message.content}
            onKeyDown={handleKeypress}
            placeholder="Write your message..."
          /> */}
              <textarea
                className="form-control gray-color-custom input-group-custom input-group-msg-custom allFeedUser"
                rows={message.content.length < 25 ? "1" : message.content.length < 60 ? "2" : "3"}
                type="text"
                placeholder="Write a message..."
                onChange={(e) => setMessage({ ...message, content: e.target.value })}
                onKeyDown={handleKeypress}
                value={message.content}
              />
              <div className="input-group-custom-child">
                <span className="input-group-text gray-color-custom emoji" id="emojiPickerChat-btn-id-custom">
                  <a href="javascript:void(0);" onClick={() => setShowEmoji(!showEmoji)}>
                    <img src="/images/icons/smile.svg" className="img-fluid" alt="smile-emoji" />
                  </a>
                </span>
                {/* <span className="input-group-text gray-color-custom emoji"><a href="javascript:void(0);" ><img src="/images/icons/smile.svg" alt className="img-fluid" /></a></span> */}
                <span className="input-group-text file-upload gray-color-custom">
                  <a href="javascript:void(0);">
                    <label htmlFor={`imagess${chatId}`}>
                      <img src="/images/icons/img-upload.svg" alt="file-upload" className="img-fluid" />
                    </label>
                  </a>
                </span>
                <div className="sendBtn sendBtnCustom message-btn-resize-custom">
                  {/* <button type="button" className="btn p-0" onClick={sendMessage}>
                    <img src="/images/icons/send.svg" alt="send" className="img-fluid" />
                  </button> */}
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
          </>
        )}
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
            onClose();
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
            onClose();
          }}
          user={showBlockUserPopup}
        />
      )}
      {/* {mediaFiles && mediaFiles.length > 0 && (
        <ImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} imageIdx={imageIdx} />
      )} */}
    </>
  );
}
