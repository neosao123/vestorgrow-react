import React, { useState } from "react";
import GroupChat from "./GroupChat";
import ImageCarousel from "../../../popups/imageCarousel/ImageCarousel";
import DeleteGroupChat from "../../../popups/groupChat/deleteGroupChat";
import CreateGroup from "../../../popups/groupChat/CreateGroup";
import GroupCreateSuccess from "../../../popups/groupChat/GroupCreateSuccess";
import GroupInfo from "../../../popups/groupChat/GroupInfo";

const GroupChatMobile = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateGroupSuccess, setShowCreateGroupSuccess] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showDeleteGroup, setShowDeleteGroup] = useState(false);
  const [groupChatRerender, setGroupChatRerender] = useState(false);
  const [groupChat, setGroupChat] = useState(0);
  return (
    <>
      <GroupChat
        groupChatRerendered={groupChatRerender}
        setShowDeleteGroup={setShowDeleteGroup}
        showCreateGroup={showCreateGroup}
        setShowCreateGroup={setShowCreateGroup}
        setShowGroupInfo={setShowGroupInfo}
        setMediaFiles={setMediaFiles}
        setGroupChat={setGroupChat}
      />
      {mediaFiles && mediaFiles.length > 0 && (
        <ImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} imageIdx={0} />
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
          groupId={showGroupInfo}
        />
      )}
    </>
  );
};

export default GroupChatMobile;
