import React, { useEffect, useState, useContext } from "react";
import ChatService from "../../services/chatService";
import UserFollowerService from "../../services/userFollowerService";
import GlobalContext from "../../context/GlobalContext";
import ProfileImage from "../../shared/ProfileImage";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Select from "react-select";
import SentMessage from "./SentMessage";
import Max from "../../assets/images/maximize.svg"
import Min from "../../assets/images/minimize.svg"
const serv = new ChatService();
const userFollowerServ = new UserFollowerService();
export default function ComposeMessage({ onClose, onFinish, deskView }) {
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [compUserList, setCompUserList] = useState([]);
  const [expend, setExpend] = useState(0);
  const [msg, setMsg] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSentMsg, setShowSentMsg] = useState(false);
  const [message, setMessage] = useState({
    content: "",
    file: "",
    sender: user._id,
  });
  const [chatId, setCaId] = useState("")
  const [activeBtn, setActiveBtn] = useState("")


  useEffect(() => {
    getFollowerList();
  }, []);

  const getFollowerList = async () => {
    try {
      let obj = {
        // filter: {
        //     listType: "follower",
        //     searchText: searchText
        // }
      };
      let resp = await userFollowerServ.listFriends(obj);
      if (resp.data) {
        setUserList([...resp.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompUserList = (item, type) => {
    if (type === "add") {
      setCompUserList([...compUserList, item]);
      setSearchText("");
    } else {
      setCompUserList([]);
    }
  };

  const sendMsg = async () => {
    try {
      let obj = {
        content: msg,
        users: compUserList,
      };
      await serv.composeMsg(obj).then((resp) => {
        if (resp.data) {
          // onFinish();
          msgSentMobile();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const msgSentMobile = () => {
    setShowSentMsg(!showSentMsg);
    setMsg("");

    setMessage({
      content: "",
      file: "",
      sender: user._id,
    });
    // setUserList([]);
  };

  const sendMessage = async () => {
    try {
      let obj = {
        content: message.content,
        // file: message.file,
        users: compUserList,
      };
      // const formData = new FormData();
      // formData.append("content", message.content);
      // if (Array.isArray(message.file)) {
      //   message.file.forEach((element) => {
      //     formData.append("file", element);
      //   });
      // }
      // if (Array.isArray(compUserList)) {
      //   compUserList.forEach((element) => {
      //     formData.append("users", element);
      //   });
      // }
      await serv.composeMsg(obj).then((resp) => {
        if (resp.data) {
          onFinish();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Just for testing below function

  // const getMsgList = async () => {
  //   try {
  //     let obj = {
  //       filter: {},
  //     };
  //     await serv.listAllChat(obj).then((resp) => {
  //       if (resp.data) {
  //         console.log("resp", resp.data);
  //         // onFinish();
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // getMsgList();


  const formatOptionLabel = ({ value, label, full_name, banner }, { context }) => {
    if (context === "value") {
      return label;
    } else {
      return (
        <div className="search-resultCustom-div">
          <div className="search-resultCustom-image">
            <ProfileImage url={banner} style={{ borderRadius: "30px" }} />
          </div>
          <div className="search-resultCustom-udata">
            <h4>
              {/* {item.userName}{" "} */}
              {label?.length > 25 ? label?.slice(0, 25) + "..." : label}{" "}
              {/* {item?.isPaid ? <img src="/images/icons/green-tick.svg" className="search-resultCustom-udata-paid" /> : ""}{" "} */}
            </h4>
            <p>{full_name}</p>
          </div>
        </div>
      );
    }
  };

  const customFilterOption = (option, searchText) => {
    if (option.label.toLowerCase().startsWith(searchText.toLowerCase())) {
      return true;
    }
    return false;
  };

  return (
    <>
      {!deskView && (
        <div className="modal shaw" style={{ display: "block" }}>
          <div className="new-message-heading_custom">
            {/* <div className="feedBoxHeadRight">
              <i class="fa fa-chevron-left" aria-hidden="true" onClick={onClose}></i>
              // <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
            </div> */}
            <div className="createPostHeading-backButton" onClick={onClose}>
              <img
                className="arrow"
                src="/images/icons/left-arrow.svg"
                alt=""
              // onClick={setShowNotification(false)}
              />
            </div>
            <h4>Message</h4>
          </div>

          <div className="modal shaw " style={{ display: "block" }}>
            <div className="vertical-alignment-helper">
              <div className="vertical-align-center vertical-align-center-custom">
                <div className="compose_message modal-dialog modal-lg compose_message-mobile-custom">
                  <div className="modal-content model-content_mobile-custom">
                    <div className="modal-header">
                      <div className="followesNav">
                        <h4 className="mb-0">New message</h4>
                      </div>
                      <div className="createPostRight d-flex align-items-center createPostRight-mobile-close-custom">
                        <div className="createPostDropDown d-flex align-items-center"></div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
                      </div>
                    </div>
                    <div className="composeSearching">
                      <div className="compose_Searchbar">
                        <img src="/images/icons/search.svg" alt="search" className="img-fluid search_Icon" />
                        <Select
                          isMulti
                          isClearable={false}
                          name="search"
                          options={userList.map((i) => {
                            return {
                              value: i.userId._id,
                              label: i.userId.user_name,
                              full_name: `${i.userId.first_name} ${i.userId.last_name}`,
                              banner: i.userId.profile_img,
                              ...i.userId,
                            };
                          })}
                          styles={{
                            control: (baseStyles, state) => ({
                              background: "#E7E7E7",
                              borderRadius: "0 35px 35px 0",
                              border: "none",
                              boxShadow: "none"
                            }),
                          }}
                          filterOption={customFilterOption}
                          //onChange={(e) => setCompUserList(e)}
                          onChange={(e) => setCompUserList([...compUserList, ...e])}
                          className="w-100 basic-multi-select"
                          classNamePrefix="Search"
                          formatOptionLabel={formatOptionLabel}
                          components={{
                            IndicatorSeparator: () => null,
                            DropdownIndicator: () => null,
                          }}
                        />
                      </div>
                      {searchText && (
                        <div className="searchListFlow">
                          <div className="search_dataList search_dataList-custom">
                            <div className="overflow_searchList followListsInner">
                              {userList.filter((i) => {
                                return i.userId?.user_name?.toLowerCase().startsWith(searchText);
                              }).length > 0 ? (
                                userList
                                  .filter((i) => {
                                    return i.userId?.user_name?.toLowerCase().startsWith(searchText);
                                  })
                                  .map((item) => {
                                    return (
                                      <div className="search_userCompose">
                                        <a
                                          href="javascript:void(0)"
                                          onClick={() => handleCompUserList(item.userId, "add")}
                                        >
                                          <div className="followOtherUser">
                                            <div className="followOtherUserPic">
                                              <ProfileImage url={item.userId.profile_img} />
                                            </div>
                                            <div className="followOtherUserName">
                                              <h5 className="mb-0">{item.userId?.user_name}</h5>
                                              <p className="mb-0">{item.userId?.title}</p>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                    );
                                  })
                              ) : (
                                <p class="px-3 noData_found">Sorry, no user found with this name</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Modal body */}
                    <div className="modal-body">
                      <div className="tabSendContent">
                        <div className="followersList">
                          <div className="createPostMind">
                            <div className="createPostTextarea">
                              <textarea
                                className="form-control"
                                rows={6}
                                id
                                name
                                placeholder="Message"
                                value={msg}
                                onChange={(e) => setMsg(e.currentTarget.value)}
                              />
                              <div className="postFile mt-3">
                                <div className="postBtn ms-auto">
                                  <a
                                    href="javascript:void(0)"
                                    className={
                                      "btn btnColor " + (compUserList.length > 0 && msg !== "" ? "" : "disabled")
                                    }
                                    onClick={sendMsg}
                                  >
                                    {" "}
                                    Send message
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSentMsg && (
        <div className="modal-backdrop-customlZindex">
          <SentMessage onClose={() => setShowSentMsg(!showSentMsg)} />
        </div>
      )}
      {showSentMsg && <div className="modal-backdrop show modal-backdrop-customZindex"></div>}
      {!deskView && <div className="modal-backdrop show"></div>}
      {deskView && (
        <div className={`chatBox chatBoxCustom position-relative ${expend == 1 ? "chatBoxLarge" : ""}`}>
          <div className="chatBoxHead position-relative chatBoxHead_Custom">
            <h4>New Message</h4>
            <div className="feedBoxHeadRight options">
              <a href="javascript:void(0);" onClick={() => setExpend(expend !== 0 ? 0 : 1)}>
                {expend === 0 && <img src={Max} alt="dots" className="img-fluid" />}
                {expend === 1 && <img src={Min} alt="dots" className="img-fluid" />}
              </a>
              <a href="javascript:void(0);" onClick={onClose}>
                <img src="images/profile/cross-icon.svg" className="search_cross" />
              </a>
            </div>
          </div>
          <div className="composeSearching" style={{ padding: "0rem 0.5rem 0.35rem 0.5rem" }}>
            <div className="compose_Searchbar compose_Searchbar-custom" style={{ paddingLeft: "10px", paddingTop: "0px", paddingBottom: "0px" }}>
              <Select
                isMulti
                isClearable={false}
                name="search"
                options={userList.map((i) => {
                  return {
                    value: i.userId._id,
                    label: i.userId.user_name,
                    full_name: `${i.userId.first_name} ${i.userId.last_name}`,
                    banner: i.userId.profile_img,
                    ...i.userId,
                  };
                })}
                onChange={(e) => setCompUserList(e)}
                // onChange={(e) => setCompUserList([...compUserList, ...e])}
                className="w-100 basic-multi-select basic-multi-select-input"
                classNamePrefix="Search"
                formatOptionLabel={formatOptionLabel}
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator: () => null,
                }}
              />
            </div>
            {searchText && (
              <div className="searchListFlow" style={{ width: "100%", border: "1px solid red" }}>
                <div className="search_dataList">
                  <div className="overflow_searchList followListsInner">
                    {userList.filter((i) => {
                      console.log(i.userId);
                      return (
                        // i.userId?.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
                        i.userId?.user_name?.toLowerCase().startsWith(searchText.toLowerCase())
                      );
                    }).length > 0 ? (
                      userList
                        .filter((i) => {
                          console.log(i.userId);
                          return (
                            // i.userId?.userId.toLowerCase().includes(searchText.toLowerCase()) ||
                            i.userId?.user_name?.toLowerCase().startsWith(searchText.toLowerCase())
                          );
                        })
                        .map((item) => {
                          return (
                            <div className="search_userCompose">
                              <a href="javascript:void(0)" onClick={() => handleCompUserList(item.userId, "add")}>
                                <div className="followOtherUser">
                                  <div className="followOtherUserPic">
                                    {/* <img src="images/img/profile-image2.png" alt="search" className="img-fluid" /> */}
                                    <ProfileImage url={item.userId.profile_img} />
                                  </div>
                                  <div className="followOtherUserName">
                                    <h5 className="mb-0">
                                      {item.userId?.first_name} {item.userId?.last_name}
                                    </h5>
                                    <p className="mb-0">{item.userId?.title}</p>
                                  </div>
                                </div>
                              </a>
                            </div>
                          );
                        })
                    ) : (
                      <p class="px-3 noData_found">Sorry, no user found with this name</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className={`messagess msgSection allFeedUser overflowScrollStop ${expend === 1 ? "msgSectionLarge-message" : "msgSectionLarge-message-sm"
              }`}
            id={`messagess`}
          ></div>
          {/* Modal body */}
          {showEmoji && (
            <div className="picker-head emojiPicker">
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
                onEmojiSelect={(e) => setMessage({ ...message, content: message.content + e.native })}
              />
            </div>
          )}
          <div
            className={`textArea chatInput ${expend ? "textAreaLarge" : ""} textAreaCustom`}
            id="emojiPickerChat-id-custom"
            style={{ backgroundColor: "white", marginTop: `${expend ? "100px" : "0px"}` }}
          >
            <textarea
              className="form-control gray-color-custom input-group-custom input-group-msg-custom allFeedUser"
              rows={message.content.length < 25 ? "1" : message.content.length < 60 ? "1" : "1"}
              type="text"
              // style={{height:"unset"}}
              placeholder="Type your message..."
              onChange={(e) => setMessage({ ...message, content: e.target.value })}
              // onKeyDown={handleKeypress}

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
                  <img src="/images/icons/smile.svg" width={expend ? "25px" : "20px"} className="img-fluid" alt="smile-emoji" />
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
      )}
    </>
  );
}
