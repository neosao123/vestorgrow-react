import React, { useEffect, useState, useContext, useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useParams } from "react-router-dom";
import ProfileImage from "../../../shared/ProfileImage";
import GlobalMessageService from "../../../services/globalMessageService";
import UserService from "../../../services/UserService";
import GlobalContext from "../../../context/GlobalContext";
import ImageCarousel from "../../../popups/imageCarousel/ImageCarousel";
import moment from "moment";
const serv = new GlobalMessageService();
const userServ = new UserService();
export default function GlobalMessage({ setPremiumChat, setMediaFiles }) {
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [showEmoji, setShowEmoji] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const [isOnline, setIsOnline] = useState([]);
  const [activeBtn, setActiveBtn] = useState(false);
  const [message, setMessage] = useState({
    content: "",
    file: "",
    sender: user._id,
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getMessage();
    // var objDiv = document.getElementById("messagesEndRef");
    // objDiv.scrollTop = objDiv.scrollHeight;
    const interval = setInterval(getMessage, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // getMessageft();
    var objDiv = document.getElementById("messagesEndRef");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [scrollToBottom, messageList]);

  const sendMessage = async () => {
    setActiveBtn(true);
    setShowEmoji(false);
    if (message.content.trim() || message.file) {
      const formData = new FormData();
      formData.append("content", message.content);
      formData.append("sender", message.sender);
      formData.append("file", message.file);
      try {
        await serv.createMessage(formData).then((resp) => {
          if (resp.data) {
            setMessage({
              content: "",
              file: "",
              sender: user._id,
            });
            // getMessageft();
            setScrollToBottom((prevState) => !prevState);
            // var objDiv = document.getElementById("messagesEndRef");
            // objDiv.scrollTop = objDiv.scrollHeight;
            // setMessageList([...messageList, { ...resp.data, sender: user }]);
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
  async function getMessage(id, oUser, users) {
    try {
      let obj = {
        filter: {},
      };
      await serv.listAllMessage(obj).then((resp) => {
        if (resp.data) {
          setPremiumChat(resp.unreadCount);
          setMessageList([...resp.data]);
          getOnlineStatus(resp.data);
          // var objDiv = document.getElementById("messagesEndRef");
          // objDiv.scrollTop = objDiv.scrollHeight;
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
  const getOnlineStatus = async (data) => {
    try {
      let userList = [];
      data.forEach((item) => {
        userList.push(item?.sender?._id);
      });
      await userServ.getOnlineStatus({ users: userList }).then((resp) => {
        setIsOnline(resp.result);
      });
    } catch (error) {
      console.log(error);
    }
  };
  // async function getMessageft(id, oUser, users) {
  //   try {
  //     let obj = {
  //       filter: {},
  //     };
  //     await serv.listAllMessage(obj).then((resp) => {
  //       if (resp.data) {
  //         setPremiumChat(resp.unreadCount);
  //         setMessageList([...resp.data]);
  //       }
  //     });
  //     var objDiv = document.getElementById("messagesEndRef");
  //     objDiv.scrollTop = objDiv.scrollHeight;
  //     console.log("1111");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  const handleMarkAsRead = async () => {
    try {
      await serv.markAsRead({}).then((resp) => {
        if (resp.message) {
          setPremiumChat(0);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div id="feedChat" className="feedChatUser" onClick={handleMarkAsRead}>
        <div className="chatBoxGroupBottom">
          <div className="feedChatHeading">
            <h5 className="mb-0">Premium Chat</h5>
          </div>
          <div className="feedChatUserMsgGroup">
            {/* <div className="allFeedUser position-relative" id="messages"> */}
            <div
              className={
                message.content.length < 25
                  ? "allFeedUser allFeedUserOne position-relative"
                  : message.content.length < 48
                  ? "allFeedUserTwo allFeedUser position-relative"
                  : message.content.length < 70
                  ? "allFeedUserThree allFeedUser position-relative"
                  : message.content.length < 98
                  ? "allFeedUserFour allFeedUser position-relative"
                  : message.content.length < 125
                  ? "allFeedUserFive allFeedUser position-relative"
                  : "allFeedUserSix allFeedUser position-relative"
              }
              id="messagesEndRef"
              ref={messagesEndRef}
            >
              {/* <div className="feedUserChat">
                                <div className="replyDropdown">
                                    <div className="FeedUserChatProfile">
                                        <a href="javascript:void(0);"><img src="/images/img/profile-image1.png" alt="profile-img" className="img-fluid" /></a>
                                    </div>
                                    <div className="FeedUserChatHead">
                                        <div className="FeedUserChatName d-flex justify-content-between">
                                            <h6 className="mb-0">Elmer Laverty</h6>
                                            <div className="globalChatDropdown dropdown">
                                                <button type="button" className="btn p-0" data-bs-toggle="dropdown">
                                                    <img src="/images/icons/down-arrow.svg" alt="downarrow" />
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><a className="dropdown-item" href="javascript:void(0);"> Reply</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="FeedUserChatTxt">
                                            <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="replyUserBox">
                                <div className="repliedHead">
                                    <p className="mb-0">Replied</p>
                                </div>
                                <div className="replyBoxInner">
                                    <div className="FeedUserChatProfile">
                                        <img src="/images/img/profile-image.png" alt="profile-img" className="img-fluid" />
                                    </div>
                                    <div className="FeedUserChatHead">
                                        <div className="FeedUserChatTxt">
                                            <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
              {messageList.map((item) => {
                return (
                  <div className="feedUserChat">
                    <a href="javascript:void(0);" className="userFeedLink">
                      <div className="FeedUserChatProfile">
                        <div className="userProfileImg">
                          {/* <img src="/images/img/profile-image4.png" alt="profile-img" className="img-fluid" /> */}
                          <ProfileImage url={item?.sender?.profile_img} />
                          {isOnline.includes(item?.sender?._id) && <span className="msgOnline" />}
                        </div>
                      </div>
                      <div className="FeedUserChatHead">
                        <div className="FeedUserChatName FeedUserChatName-CustomWeb d-flex justify-content-between">
                          <h6
                            className="mb-0"
                            title={item?.sender?.user_name ? item?.sender?.user_name : "Vestorgrow user"}
                          >
                            {item?.sender?.user_name
                              ? item?.sender?.user_name.length > 20
                                ? item?.sender?.user_name.slice(0, 20) + "..."
                                : item?.sender?.user_name
                              : "Vestorgrow user"}
                          </h6>
                          <span>{moment(item?.updatedAt).fromNow()}</span>
                        </div>
                        <div className="FeedUserChatTxt">
                          {item.content && <p className="mb-0 whiteSpace text-break">{item.content}</p>}
                          {item.file && (
                            <img
                              src={item.file}
                              className="img-fluid"
                              onClick={() => {
                                setMediaFiles([item.file]);
                                setImageIdx(0);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
            <div
              className="feedChatSendMsgBox feedChatSendMsgBoxCustom p-0 position-relative border-white-custom"
              id="emojiPickerGlobal-id-custom"
            >
              {showEmoji && (
                <div
                  className={
                    "picker-head " +
                    (message.content.length < 25
                      ? "emojiPickerGlobal"
                      : message.content.length < 48
                      ? "emojiPickerGlobal emojiPickerGlobal-two"
                      : message.content.length < 70
                      ? "emojiPickerGlobal emojiPickerGlobal-three"
                      : message.content.length < 98
                      ? "emojiPickerGlobal emojiPickerGlobal-four"
                      : message.content.length < 125
                      ? "emojiPickerGlobal emojiPickerGlobal-five"
                      : "emojiPickerGlobal emojiPickerGlobal-six")
                  }
                >
                  <div className="closeBtnPositionCustom display_none-custom close-btn-picker">
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
                      if (!e.target.closest("#emojiPickerGlobal-id-custom")) {
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
                  <button type="button" className="btn-close" onClick={() => setMessage({ ...message, file: "" })} />
                  <img src={URL.createObjectURL(message.file)} className="img-fluid imagePreData" />
                </div>
              )}
              <div className="messageReplyOption position-relative">
                <div className="chatInput">
                  <div className="input-group input-group-custom">
                    <div className="input-group-custom-child">
                      <span className="input-group-text gray-color-custom emoji" id="emojiPickerGlobal-btn-id-custom">
                        <a href="javascript:void(0);" onClick={() => setShowEmoji(!showEmoji)}>
                          <img src="/images/icons/smile.svg" alt className="img-fluid" />
                        </a>
                      </span>
                      <span className="input-group-text file-upload gray-color-custom">
                        <a href="javascript:void(0);">
                          <label htmlFor="images">
                            <img src="/images/icons/img-upload.svg" alt="file-upload" className="img-fluid" />
                          </label>
                        </a>
                      </span>
                      {/* <textarea
                        rows={message.content.length > 80 ? 6 : message.content.length > 50 ? 2 : 1} */}
                      {/* <input
                        type="text"
                        className="form-control gray-color-custom"
                        onChange={(e) => setMessage({ ...message, content: e.target.value })}
                        value={message.content}
                        placeholder="Write your message..."
                      /> */}
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
                      id="images"
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
          </div>
        </div>
      </div>
    </>
  );
}
