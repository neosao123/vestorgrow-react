import React, { createContext, useState, useEffect } from "react";
import Logo1 from "../assets/Avatar/cryptoCurrency/c1.jpg";
import Logo2 from "../assets/Avatar/cryptoCurrency/c2.jpg";
import Logo3 from "../assets/Avatar/cryptoCurrency/c3.jpg";
import Logo4 from "../assets/Avatar/Meditation/Art_13-1.jpg";
import Logo5 from "../assets/Avatar/Meditation/Art_13.jpg";
import Logo6 from "../assets/Avatar/Meditation/Group.jpg";
import Logo7 from "../assets/Avatar/Commodities/Art_4-1.jpg";
import Logo8 from "../assets/Avatar/Commodities/Art_4.jpg";
import Logo9 from "../assets/Avatar/Commodities/Group.jpg";
import Logo10 from "../assets/Avatar/Fitness/Group-1.jpg";
import Logo11 from "../assets/Avatar/Fitness/Group-2.jpg";
import Logo12 from "../assets/Avatar/Fitness/Group.jpg";
import Logo13 from "../assets/Avatar/Art/Art_6-1.jpg";
import Logo14 from "../assets/Avatar/Art/Art_6.jpg";
import Logo15 from "../assets/Avatar/Art/Group.jpg";
import Logo16 from "../assets/Avatar/Cars/Art8.jpg";
import Logo17 from "../assets/Avatar/Cars/Group.jpg";
import Logo18 from "../assets/Avatar/Cars/woman.jpg";
import Logo19 from "../assets/Avatar/Forex/f1.jpg";
import Logo20 from "../assets/Avatar/Forex/f2.jpg";
import Logo21 from "../assets/Avatar/Forex/f3.jpg";
import Logo22 from "../assets/Avatar/Goal_setting/Art_12.jpg";
import Logo23 from "../assets/Avatar/Goal_setting/Group-1.jpg";
import Logo24 from "../assets/Avatar/Goal_setting/Group.jpg";
import Logo25 from "../assets/Avatar/Healthy_food/Group-1.jpg";
import Logo26 from "../assets/Avatar/Healthy_food/Group-2.jpg";
import Logo27 from "../assets/Avatar/Healthy_food/Group.jpg";
import Logo28 from "../assets/Avatar/Property/Art_1.jpg";
import Logo29 from "../assets/Avatar/Property/Group.jpg";
import Logo30 from "../assets/Avatar/Property/woman.jpg";
import Logo31 from "../assets/Avatar/Watches/Group-1.jpg";
import Logo32 from "../assets/Avatar/Watches/Group-2.jpg";
import Logo33 from "../assets/Avatar/Watches/Group.jpg";
import Logo34 from "../assets/Avatar/Wine/Art_5.jpg";
import Logo35 from "../assets/Avatar/Wine/Group-1.jpg";
import Logo36 from "../assets/Avatar/Wine/Group.jpg";
import Logo37 from "../assets/Avatar/self_help/Group-1.jpg";
import Logo38 from "../assets/Avatar/self_help/Group-2.jpg";
import Logo39 from "../assets/Avatar/self_help/Group.jpg";
import Logo40 from "../assets/Avatar/stocks_shares/ss1.jpg";
import Logo41 from "../assets/Avatar/stocks_shares/ss2.jpg";
import Logo42 from "../assets/Avatar/stocks_shares/ss3.jpg";

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
  const [loading, setLoading] = useState(false);
  const [shotChatlist, setShowChatList] = useState(false);
  const [groupChat, setgroupChat] = useState(false);
  const [personalUnreadCount, setPersonalUnreadCount] = useState(0)
  const [groupUnreadCount, setGroupUnreadCount] = useState(0);
  const [SliderHeaderTextIndex, setSliderHeaderTextIndex] = useState(0)
  const [slideHeader, setSliderHeader] = useState(
    [
      {
        id: 0, src1: Logo1, src2: Logo2, src3: Logo3, text: "Cryptocurrency"
      },
      {
        id: 1, src1: Logo4, src2: Logo5, src3: Logo6, text: "Meditation"
      },
      {
        id: 2, src1: Logo7, src2: Logo8, src3: Logo9, text: "Commodities"
      },
      {
        id: 3, src1: Logo10, src2: Logo11, src3: Logo12, text: "Fitness"
      },
      {
        id: 4, src1: Logo13, src2: Logo14, src3: Logo15, text: "Art"
      },
      {
        id: 5, src1: Logo16, src2: Logo17, src3: Logo18, text: "Cars"
      },
      {
        id: 6, src1: Logo19, src2: Logo20, src3: Logo21, text: "Forex"
      },
      {
        id: 7, src1: Logo22, src2: Logo23, src3: Logo24, text: "Goal Setting"
      },
      {
        id: 8, src1: Logo25, src2: Logo26, src3: Logo27, text: "Healthy Food"
      },
      {
        id: 9, src1: Logo28, src2: Logo29, src3: Logo30, text: "Property"
      },
      {
        id: 10, src1: Logo31, src2: Logo32, src3: Logo33, text: "Watches"
      },
      {
        id: 11, src1: Logo34, src2: Logo35, src3: Logo36, text: "Wine"
      },
      {
        id: 12, src1: Logo37, src2: Logo38, src3: Logo39, text: "Self Help"
      },
      {
        id: 13, src1: Logo40, src2: Logo41, src3: Logo42, text: "Stocks Shares"
      }
    ]
  );
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [tempUser, setTempUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [avatar, setAvatar] = useState(null);
  const [avatarIndex, setAvatarIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [emailPopup, setShowEmailPopup] = useState(false);

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
        groupInfoId: [groupInfoId, setGroupInfoId],
        Loading: [loading, setLoading],
        showChatList: [shotChatlist, setShowChatList],
        isThisGroupChat: [groupChat, setgroupChat],
        unreadGroupCount: [groupUnreadCount, setGroupUnreadCount],
        unreadPersonalCount: [personalUnreadCount, setPersonalUnreadCount],
        slideHeader: [slideHeader, setSliderHeader],
        SliderHeaderTextIndex: [SliderHeaderTextIndex, setSliderHeaderTextIndex],
        UserEmail: [userEmail, setUserEmail],
        emailverificationOTP: [otp, setOtp],
        tempUser: [tempUser, setTempUser],
        avatar: [avatar, setAvatar],
        avatarIndex: [avatarIndex, setAvatarIndex],
        currentSlide: [currentSlide, setCurrentSlide],
        emailPopup: [emailPopup, setShowEmailPopup],
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContext;
