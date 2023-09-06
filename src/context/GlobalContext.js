import React, { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isAuthentiCated, setIsAuthentiCated] = useState(localStorage.getItem("token") ? true : false);
  const [showToolTip, setShowToolTip] = useState(0);
  const [showCommentPostList, setShowCommentPostList] = useState([]);
  const [showReplyList, setShowReplyList] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [searchText, setSearchText] = useState("");
  const [createPostPopup, setCreatePostPopup] = useState(false);
  const [postSuccessPopup, setPostSuccessPopup] = useState(false);
  const [postFailPopup, setPostFailPopup] = useState(false);
  const [groupExecutionSuccess, setGroupExecutionSuccess] = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  const [groupJoinedByNoti, setGroupJoinedByNoti] = useState("");
  const [getMessageData, setGetMessageData] = useState([]);
  const [expandedArr, setExpandedArr] = useState([]);
  const [unreadMsgCount, setUnreadMsgCount] = useState({
    messageChat: 0,
    premiumChat: 0,
    groupChat: 0,
  });
  const [showChat, setShowChat] = useState(true)
  const [messageBoxState, setMessageBoxState] = useState(JSON.parse(localStorage.getItem("messageboxstate")) || [])
  const [isGroupChat, setIsGroupChat] = useState(JSON.parse(localStorage.getItem("isgroupchat")) || true)
  const [isloading, setisLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState({});
  const [latestMsgList, setLatestMsgList] = useState({});
  const [chatList, setChatList] = useState([]);
  const [chatData, setChatData] = useState([])
  const [updateChatList, setUpdateChatList] = useState(false)
  const [groupInfoId, setGroupInfoId] = useState("")

  return (
    <GlobalContext.Provider
      value={{
        auth: [isAuthentiCated, setIsAuthentiCated],
        user: [user, setUser],
        searchText: [searchText, setSearchText],
        createPostPopup: [createPostPopup, setCreatePostPopup],
        postSuccessPopup: [postSuccessPopup, setPostSuccessPopup],
        postFailPopup: [postFailPopup, setPostFailPopup],
        showReplyList: [showReplyList, setShowReplyList],
        showCommentPostList: [showCommentPostList, setShowCommentPostList],
        showToolTip: [showToolTip, setShowToolTip],
        unreadMsgCount: [unreadMsgCount, setUnreadMsgCount],
        activeChat: [activeChat, setActiveChat],
        getMessageData: [getMessageData, setGetMessageData],
        groupExecutionSuccess: [groupExecutionSuccess, setGroupExecutionSuccess],
        groupJoinedByNoti: [groupJoinedByNoti, setGroupJoinedByNoti],
        ChatBoxVisibily: [showChat, setShowChat],
        expandedArray: [expandedArr, setExpandedArr],
        MessageBoxStateMaintainance: [messageBoxState, setMessageBoxState],
        isGroupChat: [isGroupChat, setIsGroupChat],
        isLoading: [isloading, setisLoading],
        UnReadCount: [unreadCount, setUnreadCount],
        LatestmsgList: [latestMsgList, setLatestMsgList],
        ChatList: [chatList, setChatList],
        ChatDATA: [chatData, setChatData],
        UpdateChat: [updateChatList, setUpdateChatList],
        groupInfoId: [groupInfoId, setGroupInfoId]
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContext;
