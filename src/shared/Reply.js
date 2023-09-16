import ProfileImage from "./ProfileImage";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import GlobalContext from "../context/GlobalContext";
import * as Yup from "yup";
import UserService from "../services/UserService";
import PostCommentService from "../services/postCommentService";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "../assets/mentions/comment/defaultStyle";
import defaultMention from "../assets/mentions/comment/defaultMention";
import "./styleComment.css";
import HelperFunctions from "../services/helperFunctions";

const ValidateSchema = Yup.object().shape({
  comment: Yup.string().required("Required"),
});

const serv = new UserService();
function fetchUsers(query, callback) {
  if (!query) return
  let obj = { searchText: query };

  serv.getMentionUsers(obj).then((res) => {
    if (res.data?.length > 0)
      return res.data.map(user => ({ display: user.user_name, id: user._id, img: user.profile_img }))
  }).then(callback);
}

export default function Reply({ postId, comment, getCommentList }) {
  const commentServ = new PostCommentService();
  const helperFunction = new HelperFunctions();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [showReplyList, setShowReplyList] = globalCtx.showReplyList;
  const [reply, setReply] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [value, setValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [inputPost, setInputPost] = useState("");
  const [activeBtn, setActiveBtn] = useState(false);

  const sendReply = async (commentId) => {
    if (inputPost !== "") {
      setShowEmoji(false);
      setActiveBtn(true)
      try {
        const dirtyHtmlPostMessage = helperFunction.mentionedUserLinkGenerator(inputPost);
        const mentionedUsers = helperFunction.idExtractor(inputPost);
        let obj = {
          commentId: commentId,
          postId: postId,
          createdBy: user._id,
          reply: dirtyHtmlPostMessage,
          mentionedUsers: mentionedUsers
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
      setActiveBtn(false)
    }

  };

  const handleResize = () => {
    if (window.innerWidth < 400) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const handleChangeInput = (e, newInputValue) => {
    if (e.target.value.includes(" @")) {
      const strAfter = e.target.value.substring(e.target.value.indexOf("@") + 1);
      if (strAfter.includes(" ")) {
        setSearchText("");
      } else {
        setSearchText(strAfter);
      }
    }
    setValue(newInputValue);
    setInputPost(e.target.value);
    setReply((prevData) => ({ ...prevData, content: newInputValue }));
  };

  const handleChange = (e, newValue) => {
    setValue(newValue);
    setInputPost(e.target.value);
    setReply((prevData) => ({ ...prevData, content: newValue }));
  };

  const handleEmojiSelection = (e, emoji) => {
    const val = value + emoji;
    setValue(val)
    setInputPost(val);
    setReply((prevData) => ({ ...prevData, content: val }));
  }

  const CustomSuggestion = ({ suggestion, ...props }) => (
    <div {...props} style={{ padding: "5px", display: "flex", alignItems: "center" }}>
      <img src={props.img !== "" ? props.img : "/images/user.png"} alt={props.display} style={{ width: "32px", height: "32px", borderRadius: "16px", marginRight: "5px" }} />
      <div style={{ fontSize: "1.0rem" }}>{props.display}</div>
    </div>
  );


  useEffect(() => {
    handleResize();
  });

  return (
    <div className="sendPost d-flex align-items-center position-relative-class" id="emojiPickerReply-id-Custom">
      {
        showEmoji && (
          <div className="emojiPicker-reply">
            <div className="closeBtnPositionCustom close-btn-picker">
              <button
                type="button"
                className="btn-close btn-close-inner-custom"
                onClick={() => setShowEmoji(false)}
              />
            </div>
            {
              <Picker
                data={data}
                perLine={isMobile ? 7 : 9}
                onClickOutside={(e) => {
                  if (!e.target.closest("#emojiPickerReply-id-Custom")) {
                    setShowEmoji(false);
                  }
                }}
                onEmojiSelect={(e) => handleEmojiSelection(e, e.native)}
                previewPosition={"none"}
                searchPosition={"none"}
                navPosition={"none"}
              />
            }
          </div>
        )
      }
      <div className="mn-cmt-container">
        <div className="prfimg">
          <Link to={"/userprofile/" + user?._id}>
            <img src={user?.profile_img !== "" ? user.profile_img : "/images/profile/default-profile.png"} alt="" />
          </Link>
        </div>
        <MentionsInput
          value={value}
          onChange={handleChange}
          style={defaultStyle}
          className="asd"
          placeholder="Write a comment"
        >
          <Mention
            trigger="@"
            id="comment"
            name="comment"
            onChange={handleChangeInput}
            markup="@@@____id__^^__display__@@@"
            data={fetchUsers}
            style={defaultMention}
            renderSuggestion={CustomSuggestion}
            appendSpaceOnAdd={true}
          />
        </MentionsInput>
        <div className="emojiBtn" id="emojiPickerComment-btn-id-Custom" onClick={() => setShowEmoji(!showEmoji)}>
          <img src="/images/icons/emoji.png" alt="" className="img-fluid img-emoji-dummy" />
        </div>
        {activeBtn ? (
          <i className="fa-solid fa-spinner"></i>
        ) : (
          <button onClick={() => sendReply(comment._id)} className="btn sendPostbtn">
            <img src="/images/icons/send.svg" alt="like" className="img-fluid" />
          </button>
        )}
      </div>
    </div>
  );
}
