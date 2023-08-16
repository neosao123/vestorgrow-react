import ProfileImage from "./ProfileImage";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import GlobalContext from "../context/GlobalContext";
import * as Yup from "yup";
import PostCommentService from "../services/postCommentService";

const ValidateSchema = Yup.object().shape({
  comment: Yup.string().required("Required"),
});

export default function ReplyOrg({ postId, comment, getCommentList }) {
  const commentServ = new PostCommentService();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [showReplyList, setShowReplyList] = globalCtx.showReplyList;
  const [reply, setReply] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const sendReply = async (commentId) => {
    setShowEmoji(false);
    try {
      let obj = {
        commentId: commentId,
        postId: postId,
        createdBy: user._id,
        reply: reply,
      };
      const resp = await commentServ.sendCommentReply(obj);
      if (resp.data) {
        getCommentList();
        setReply("");
        setShowReplyList([...showReplyList, commentId]);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 400) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
  });

  return (
    <div className="sendPost d-flex align-items-center position-relative-class" id="emojiPickerReply-id-Custom">
      <div className="sendPostProfile">
        <Link to={"/userprofile/" + user?._id}>
          <ProfileImage url={user?.profile_img} style={{ borderRadius: "30px" }} />
        </Link>
      </div>
      <div className="postInput postInputCustomCmnt">
        <textarea
          className="form-control form-control-custom-cmnt allFeedUser"
          rows={reply.length < 80 ? "1" : "2"}
          id="reply"
          name="reply"
          placeholder="Write a repy"
          onChange={(e) => setReply(e.target.value)}
          value={reply}
        />
        <span className="input-group-text bg-white emoji emoji-cmnt-custom" id="emojiPickerReply-btn-id-Custom">
          <a href="javascript:void(0);" onClick={() => setShowEmoji(!showEmoji)}>
            <img src="/images/icons/emoji.png" alt className="img-fluid img-emoji-dummy" />
          </a>
        </span>
      </div>
      <div className="sendPostBtn">
        <button type="button" onClick={() => sendReply(comment._id)} className="btn">
          <img src="/images/icons/send.svg" alt="like" className="img-fluid" />
        </button>
      </div>
      {showEmoji && (
        <div className="emojiPicker-reply">
          {
            <Picker
              data={data}
              perLine={isMobile ? 7 : 9}
              onClickOutside={(e) => {
                if (!e.target.closest("#emojiPickerReply-id-Custom")) {
                  setShowEmoji(false);
                }
              }}
              onEmojiSelect={(e) => setReply(reply + e.native)}
              previewPosition={"none"}
              searchPosition={"none"}
              navPosition={"none"}
            />
          }
        </div>
      )}
    </div>
  );
}
