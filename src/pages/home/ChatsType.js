import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ChatService from "../../services/chatService";
import GlobalContext from "../../context/GlobalContext";
import CreateGroup from "../../popups/groupChat/CreateGroup";
import DeleteGroupChat from "../../popups/groupChat/deleteGroupChat";
import GroupCreateSuccess from "../../popups/groupChat/GroupCreateSuccess";
import GroupInfo from "../../popups/groupChat/GroupInfo";
import Chat from "./chatType/Chat";
import GlobalMessage from "./chatType/GlobalMessage";
import GroupChat from "./chatType/GroupChat";
import ImageCarousel from "../../popups/imageCarousel/ImageCarousel";
import SentMessage from "../../popups/message/SentMessage";
import Suggested from "./Suggested";
import "./chattype.css"

function ChatsType() {
  const params = useParams();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [isAuthentiCated, setIsAuthentiCated] = globalCtx.auth;

  const serv = new ChatService();

  const [unreadMsgCount, setUnreadMsgCount] = globalCtx.unreadMsgCount;
  const [activeChat, setActiveChat] = globalCtx.activeChat;
  const [premiumChat, setPremiumChat] = useState(0);
  const [groupChat, setGroupChat] = useState(0);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateGroupSuccess, setShowCreateGroupSuccess] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showDeleteGroup, setShowDeleteGroup] = useState(false);
  const [groupChatRerender, setGroupChatRerender] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showSentMsg, setShowSentMsg] = useState(false);
  const [atTop, setAtTop] = useState(false)
  const [groupInfoId, setGroupInfoId] = globalCtx.groupInfoId;

  useEffect(() => {
    if (isAuthentiCated && window.location.pathname.includes("groupinvite") && params?.id) {
      sendInvitation();
    }
  }, [params]);
  const sendInvitation = async () => {
    try {
      let obj = {
        groupId: params.id,
      };
      await serv.acceptInvitationLink(obj).then((resp) => {
        if (resp.message) {
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const showSentMsgPopup = () => {
    setShowSentMsg(!showSentMsg);
  };


  const windowScale = window.devicePixelRatio
  var bottom = "88vh"

  if (windowScale === 1) {
    bottom = "90.8vh"
  }

  return (
    <>
      <div className="feedChatBox stickyChatBox" style={{ position: "fixed", right: 0, top: `${atTop ? "4.4em" : bottom}` }} >
        <div className="feedChatContent" style={{ height: "auto" }} >
          <div className="tab-content">
            {(user?.role?.includes("admin") || user?.role?.includes("userPaid")) && (
              <div className={`tab-pane ${activeChat === 0 ? "active" : ""}`}>
                <GlobalMessage setPremiumChat={setPremiumChat} setMediaFiles={setMediaFiles} />
              </div>
            )}
            <div className={`tab-pane ${activeChat === 1 ? "active" : ""} chattype-h`} >
              <Chat setMediaFiles={setMediaFiles} setShowSentMsg={showSentMsgPopup} setShowCreateGroup={setShowCreateGroup} atTop={atTop} setAtTop={setAtTop} setShowGroupInfo={setShowGroupInfo} />
            </div>
            <div className={`tab-pane ${activeChat === 2 ? "active" : ""}`} >
              <GroupChat
                groupChatRerendered={groupChatRerender}
                setShowDeleteGroup={setShowDeleteGroup}
                showCreateGroup={showCreateGroup}
                setShowCreateGroup={setShowCreateGroup}
                setShowGroupInfo={setShowGroupInfo}
                setMediaFiles={setMediaFiles}
                setGroupChat={setGroupChat}
                groupChat={groupChat}
              />
            </div>
          </div>
        </div>
      </div>

      {showCreateGroup && (
        <CreateGroup
          onClose={() => setShowCreateGroup(false)}
          onFinish={(type) => {
            setShowCreateGroup(false);
            setShowCreateGroupSuccess(type);
          }}
          groupId={showCreateGroup}
        />
      )}
      {showCreateGroupSuccess && (
        <GroupCreateSuccess
          onClose={() => {
            setShowCreateGroupSuccess(false);
            setGroupChatRerender(!groupChatRerender);
          }}
          type={showCreateGroupSuccess}
        />
      )}
      {showGroupInfo && (
        <GroupInfo
          onClose={() => setShowGroupInfo(false)}
          onFinish={() => {
            setShowGroupInfo(false);
            setGroupChatRerender(!groupChatRerender);
          }}
          onEdit={(id) => {
            setShowGroupInfo(false);
            setShowCreateGroup(id);
          }}
          groupId={groupInfoId}
        />
      )}
      {showDeleteGroup && (
        <DeleteGroupChat
          chat={showDeleteGroup}
          onClose={() => setShowDeleteGroup(false)}
          onFinish={() => {
            // handleShowDeleteGroup(data);
            setGroupChatRerender(!groupChatRerender);
            setShowDeleteGroup(false);
          }}
        />
      )}
      {mediaFiles && mediaFiles.length > 0 && (
        <ImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} imageIdx={0} />
      )}
      {showSentMsg && <SentMessage onClose={() => setShowSentMsg(!showSentMsg)} />}
    </>
  );
}

export default ChatsType;
