import React, { useEffect, useState, useContext } from "react";
import ChatService from "../../services/chatService";
import UserFollowerService from "../../services/userFollowerService";
import GlobalContext from "../../context/GlobalContext";
import ProfileImage from "../../shared/ProfileImage";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Select from "react-select";
import SentMessage from "./SentMessage";
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
                              border:"none",
                              boxShadow:"none"
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
                                console.log(i.userId);
                                //return i.userId?.user_name?.toLowerCase().includes(searchText.toLowerCase());
                                return i.userId?.user_name?.toLowerCase().startsWith(searchText);
                              }).length > 0 ? (
                                userList
                                  .filter((i) => {
                                    console.log(i.userId);
                                    //return i.userId?.user_name?.toLowerCase().includes(searchText.toLowerCase());
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
                <img src="/images/icons/expend.svg" alt="dots" className="img-fluid" />
              </a>
              <a href="javascript:void(0);" onClick={onClose}>
                <img src="images/profile/cross-icon.svg" className="search_cross" />
              </a>
            </div>
          </div>
          <div className="composeSearching">
            <div className="compose_Searchbar compose_Searchbar-custom">
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
              {/* <input
                type="text"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                className="form-control"
                placeholder="Type a name or multiple names"
                name="search"
              />
              <div className="search_result_d">
                {compUserList.map((item) => {
                  return <span className="badge search_value">@{item.user_name}</span>;
                })}
              </div>
              {compUserList.length > 0 && (
                <img
                  src="/images/profile/cross-icon.svg"
                  className="search_cross"
                  onClick={() => handleCompUserList()}
                />
              )} */}
            </div>
            {searchText && (
              <div className="searchListFlow">
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
          <div className={`textArea chatInput ${expend == 1 ? "textAreaLarge" : ""} textAreaCustom`}>
            {/* <textarea
                              className="form-control"
                              rows={6}
                              id
                              name
                              placeholder="Message"
                              value={msg}
                              onChange={(e) => setMsg(e.currentTarget.value)}
                            /> */}
            <textarea
              className="form-control gray-color-custom input-group-custom input-group-msg-custom allFeedUser"
              rows={message.content.length < 25 ? "1" : message.content.length < 60 ? "2" : "3"}
              type="text"
              placeholder="Type your message..."
              onChange={(e) => setMessage({ ...message, content: e.target.value })}
              // onKeyDown={handleKeypress}
              value={message.content}
            />
            <div className="input-group-custom-child">
              <span className="input-group-text gray-color-custom emoji">
                <a href="javascript:void(0);" onClick={() => setShowEmoji(!showEmoji)}>
                  <img src="/images/icons/smile.svg" alt className="img-fluid" />
                </a>
              </span>
              {/* <span className="input-group-text gray-color-custom emoji"><a href="javascript:void(0);" ><img src="/images/icons/smile.svg" alt className="img-fluid" /></a></span> */}
              <span className="input-group-text file-upload gray-color-custom">
                <a href="javascript:void(0);">
                  <label htmlFor={`imagess`}>
                    <img src="/images/icons/img-upload.svg" alt="file-upload" className="img-fluid" />
                  </label>
                </a>
              </span>
              <div className="sendBtn sendBtnCustom message-btn-resize-custom">
                <button type="button" className="btn p-0" onClick={sendMessage}>
                  {/* <button type="button" className="btn p-0" > */}
                  <img src="/images/icons/send.svg" alt="send" className="img-fluid" />
                </button>
              </div>
            </div>
            <input
              style={{ display: "none" }}
              type="file"
              name="images"
              id={`imagess`}
              accept="image/*"
              multiple={true}
              onChange={(event) => {
                setMessage({ ...message, file: [...message.file, ...event.currentTarget.files] });
                event.target.value = null;
              }}
            />
            {/* <div className="postFile mt-3">
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
                            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
