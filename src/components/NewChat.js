import React, { useState, useContext, useRef } from 'react';
import GlobalContext from "../context/GlobalContext";
import ChatService from "../services/chatService";
import UserService from "../services/UserService";
import ProfileImage from '../shared/ProfileImage';
import Select from "react-select";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import VideoImageThumbnail from "react-video-thumbnail-image";

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];

const NewChat = ({ ...props }) => {

    const { userList, handleChatBlock, refreshChatList } = props;

    const serv = new ChatService();
    const userServ = new UserService();

    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;

    const selectRef = useRef(null);
    const [compUserList, setCompUserList] = useState([]);
    const [searchUserText, setSearchUserText] = useState("");
    const [loadingState, setLoadingState] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [msg, setMsg] = useState({
        content: "",
        file: "",
        sender: user._id,
    });

    const sendNewMessage = async (e) => {
        e.preventDefault();
        const messageReceivingUsers = compUserList.map((rev) => { return rev.value });
        const formData = new FormData();
        formData.append("content", msg.content);
        formData.append("sender", msg.sender);
        formData.append("users", messageReceivingUsers);
        if (Array.isArray(msg.file)) {
            msg.file.forEach((element) => {
                formData.append("file", element);
            });
        }
        try {
            const resp = await serv.composeNewMsg(formData);
            if (resp.data) {
                if (selectRef.current) {
                    selectRef.current.clearValue();
                }
                setMsg({
                    content: "",
                    file: "",
                    sender: user._id
                });
                setCompUserList([]);
                refreshChatList();
            } else {
                console.log(resp);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleCompUserList = (item, type) => {
        if (type === "add") {
            setCompUserList([...compUserList, item]);
            setSearchUserText("");
        } else {
            setCompUserList([]);
        }
    };

    const handleBlur = () => {
        setCompUserList((prevSelectedOptions) => {
            // Remove duplicates from the selectedOptions array
            const uniqueOptions = [...new Set(prevSelectedOptions)];
            return uniqueOptions;
        });
    };

    const handleKeypress = (e) => {
        if (e.keyCode === 13 && e.shiftKey) {
            sendNewMessage();
        }
    };

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
                            {label?.length > 25 ? label?.slice(0, 25) + "..." : label}{" "}
                        </h4>
                        <p>{full_name}</p>
                    </div>
                </div>
            );
        }
    };

    return (
        <div>
            <div className="messageRightHeader">
                <div className="messageHeading">
                    <div onClick={handleChatBlock} className="ChatBoxBackBtn d-md-none d-lg-none d-xl-none me-2">
                        <i className="fa fa-chevron-left" aria-hidden="true" />
                    </div>
                    <h4>New Message</h4>
                </div>
                <div className="composeSearching border-top border-1" >
                    <div className="compose_Searchbar" >
                        <img src="/images/icons/search.svg" alt="search" className="img-fluid search_Icon" />
                        <Select
                            isMulti
                            isClearable={false}
                            name="search"
                            ref={selectRef}
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
                                }),
                            }}
                            onBlur={handleBlur}
                            onChange={(e) => setCompUserList([...e])}
                            className="w-100 basic-multi-select"
                            classNamePrefix="Search"
                            formatOptionLabel={formatOptionLabel}
                            components={{
                                IndicatorSeparator: () => null,
                                DropdownIndicator: () => null,
                            }}
                            placeholder="Type a name"
                        />
                    </div>
                    {searchUserText && (
                        <div className="searchListFlow">
                            <div className="search_dataList search_dataList-custom">
                                <div className="overflow_searchList followListsInner">
                                    {userList.filter((i) => {
                                        return i.userId?.user_name?.toLowerCase().includes(searchUserText.toLowerCase());
                                    }).length > 0 ? (
                                        userList
                                            .filter((i) => {
                                                return i.userId?.user_name?.toLowerCase().includes(searchUserText.toLowerCase());
                                            })
                                            .map((item) => {
                                                return (
                                                    <div className="search_userCompose">
                                                        <div
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
                                                        </div>
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
                <div className="chatInputBox chatInputBoxCustom">
                    <div className="chatInput">
                        <div className="input-group" id="emojiPickerMessage-id-Custom">
                            <textarea
                                rows={msg.content.length > 70 ? 2 : 1}
                                type="text"
                                style={{ height: "unset" }}
                                className="form-control allFeedUser resizeNone"
                                onChange={(e) => setMsg({ ...msg, content: e.target.value })}
                                value={msg.content}
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
                                    setMsg({ ...msg, file: [...msg.file, ...event.currentTarget.files] });
                                    event.target.value = null;
                                }}
                            />

                            <span
                                className="input-group-text bg-white emoji emoji-picker-customMobile"
                                id="emojiPicker-btn-id-Custom"
                            >
                                <a href="javascript:void(0);" onClick={() => setShowEmoji(!showEmoji)}>
                                    <img src="/images/icons/bw-emoji.svg" alt className="img-fluid " />
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
                        <button type="button" onClick={sendNewMessage} className="btn" disabled={loadingState}>
                            {loadingState ? (
                                <i className="fa-solid fa-spinner"></i>
                            ) : (
                                <img src="/images/icons/send.svg" alt="send" className="img-fluid" />
                            )}
                        </button>
                    </div>
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
                        onEmojiSelect={(e) => setMsg({ ...msg, content: msg.content + e.native })}
                    />
                </div>
            )}
            {msg.file && (
                <div className="imagePreview imagePreviewChatIn imagePreviewChatIn-custom">
                    <button type="button" className="btn-close" onClick={() => setMsg({ ...msg, file: "" })} />
                    {msg.file[0].type.includes("image") ? (
                        <img alt="" src={URL.createObjectURL(msg.file[0])} className="img-fluid imagePreData" />
                    ) : (
                        <VideoImageThumbnail
                            className="img-fluid imagePreData"
                            videoUrl={URL.createObjectURL(msg.file[0])}
                            alt="video"
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default NewChat