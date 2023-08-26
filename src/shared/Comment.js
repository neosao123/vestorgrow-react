import ProfileImage from "./ProfileImage";
import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import moment from "moment";
import Reply from "./Reply";
import { Link } from "react-router-dom";
import PostCommentService from "../services/postCommentService";
import UserService from "../services/UserService";
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
      return res.data.map(user => (
        {
          display: user.user_name, id: user._id, img: user.profile_img, firstName: user.first_name ?? "", lastName: user.last_name ?? ""
        }
      ))
  }).then(callback);
}

export default function Comment({ post, showCommentList, updatePost, heightUnset, idx, postsLength, onClose }) {
  const commentServ = new PostCommentService();
  const helperFunction = new HelperFunctions();

  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [showReplyList, setShowReplyList] = globalCtx.showReplyList;
  const [showCommentPostList, setShowCommentPostList] = globalCtx.showCommentPostList;
  const [showReplyDirect, setShowReplyDirect] = useState(false);
  const [commentList, setCommentList] = useState(null);
  const [reply, setReply] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  // const [showReplyList, setShowReplyList] = useState([])
  const [showNewReplyList, setShowNewReplyList] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [value, setValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [mentionedUserList, setMentionedUserList] = useState([]);
  const [mentionedUser, setMentionedUser] = useState({});
  const [inputPost, setInputPost] = useState("");
  const [mentionedUserIds, setMentionedUserIds] = useState([]);

  const [initialValue, setInitialValue] = useState({
    comment: "",
    postId: post._id,
    createdBy: user._id,
  });

  const [message, setMessage] = useState({
    content: "",
    sender: user._id,
  });

  const handleResize = () => {
    if (window.innerWidth < 400) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener
  useEffect(() => {
    handleResize();
  });

  useEffect(() => {
    if (showCommentList) {
      getCommentList(0, 5);
    } else {
      setCommentList(null);
    }
  }, [showCommentList, post]);

  useEffect(() => {
    setFormikValue();
  }, [message]);

  const setFormikValue = () => {
    formik.values.comment = message.content;
  };

  const getCommentList = async (start, length) => {
    const obj = { filter: {} };
    obj.filter.is_active = true;
    obj.filter.postId = post._id;
    if (start !== undefined) {
      obj.start = start;
      obj.length = length ? length : 10;
    }
    try {
      let resp = await commentServ.commentList(obj);
      if (resp.data) {
        setCommentList(resp.data);
        let showRply = showReplyList;
        let showNewRply = showNewReplyList;
        resp.data.forEach((i) => {
          showRply = showRply.filter((item) => item !== i._id);
          showNewRply = showNewRply.filter((item) => item !== i._id + "_false");
        });
        setShowReplyList([...showRply]);
        setShowNewReplyList([...showNewRply]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const showReply = (commentId) => {
    if (showReplyList.includes(commentId)) {
      setShowReplyList(showReplyList.filter((i) => i !== commentId));
    } else {
      setShowReplyList([...showReplyList, commentId]);
    }
  };

  const showNewReply = (commentId) => {
    if (showNewReplyList.includes(commentId)) {
      setShowNewReplyList(showNewReplyList.filter((i) => i !== commentId));
    } else {
      setShowNewReplyList([...showNewReplyList, commentId]);
    }
  };

  const dislikeComment = async (commentId) => {
    try {
      let resp = await commentServ.dislikeComment(commentId);
      if (resp.message) {
        getCommentList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const likeComment = async (postId, commentId) => {
    try {
      let resp = await commentServ.likeComment({ postId: postId, commentId: commentId });
      if (resp.data) {
        getCommentList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const likeReply = async (postId, commentId, replyId) => {
    try {
      let resp = await commentServ.likeReply({ postId: postId, commentId: commentId, replyId: replyId });
      if (resp.data) {
        getCommentList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const dislikeReply = async (replyId) => {
    try {
      let resp = await commentServ.dislikeReply(replyId);
      if (resp.message) {
        getCommentList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      let resp = await commentServ.deleteComment(commentId);
      if (resp.message) {
        getCommentList();
        updatePost();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCommentReply = async (replyId) => {
    try {
      let resp = await commentServ.deleteCommentReply(replyId);
      if (resp.message) {
        getCommentList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendReply = async (commentId) => {
    try {
      let obj = {
        commentId: commentId,
        postId: post._id,
        createdBy: user._id,
        reply: reply,
      };
      const resp = await commentServ.sendCommentReply(obj);
      if (resp.data) {
        getCommentList();
        setReply("");
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values) => {
    setShowEmoji(false);
    values.postId = post._id;
    try {
      const dirtyHtmlPostMessage = helperFunction.mentionedUserLinkGenerator(inputPost);
      const mentionedUsers = helperFunction.idExtractor(inputPost);
      //console.log("Dirty HTML =>", dirtyHtmlPostMessage, "Ids=>", mentionedUsers);
      let obj = {
        comment: dirtyHtmlPostMessage,
        mentionedUsers: mentionedUsers,
        createdBy: values.createdBy,
        postId: post._id
      };
      const resp = await commentServ.sendComment(obj);
      if (resp.data) {
        getCommentList(0, 5);
        updatePost();
        setShowCommentPostList([...showCommentPostList, obj.postId]);
        formik.values.comment = "";
        setMessage({ ...message, content: "" });
        setShowEmoji(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: initialValue,
    validateOnBlur: true,
    onSubmit,
    validationSchema: ValidateSchema,
    enableReinitialize: true,
  });

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
    setMessage((prevData) => ({ ...prevData, content: newInputValue }));
  };

  const handleChange = (e, newValue) => {
    setValue(newValue);
    setInputPost(e.target.value);
    message.content = newValue;
    setMessage((prevData) => ({ ...prevData, content: newValue }));
  };

  const handleEmojiSelection = (e, emoji) => {
    const val = value + emoji;
    setValue(val)
    setInputPost(val);
    setMessage((prevData) => ({ ...prevData, content: val }));
  }

  const CustomSuggestion = ({ suggestion, ...props }) => (
    <div {...props} style={{ padding: "5px", display: "flex", alignItems: "center" }}>
      <img src={props.img !== "" ? props.img : "/images/profile/default-profile.png"} alt={props.display} style={{ width: "32px", height: "32px", borderRadius: "16px", marginRight: "5px" }} />
      <div>
        <div style={{ fontSize: "1.0rem" }}>{props.display}</div>
        <div style={{ fontSize: "0.8rem" }}>{props.firstName + " " + props.lastName}</div>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className="d-flex flex-column"
            style={{position:"relative",justifyContent:"center"}}
          >
            <div className="mb-1 mx-auto bg-transparent"
              style={{position:"absolute",bottom:"50px",left: "50%",
              transform: "translateX(-50%)"}}
            >
              {showEmoji && (
                <div className="picker-head emojiPicker-comment-up"
                  style={{position:"relative",width:"100%"}}
                >
                  <div /*className="closeBtnPositionCustom close-btn-picker"*/
                  style={{position:"absolute",top:"-20px",right:"-20px",zIndex:1}}
                  >
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
                      if (!e.target.closest("#emojiPickerComment-id-Custom")) {
                        setShowEmoji(false);
                      }
                    }}
                    onEmojiSelect={(e) => handleEmojiSelection(e, e.native)}
                    previewPosition={"none"}
                    searchPosition={"none"}
                    navPosition={"top"} 
                  />
                </div>
              )}
            </div>
            <div className="sendPost d-flex align-items-center sendPostHome " id="emojiPickerComment-id-Custom">
              <div className="mn-cmt-container ">
                <div className="prfimg" onClick={onClose}>
                  <Link to={"/userprofile/" + user?._id}>
                    <img src={user?.profile_img !== "" ? user.profile_img : "/images/profile/default-profile.png"} alt="" />
                  </Link>
                </div>
                <MentionsInput
                  value={message.content}
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
                <button type="submit" className="btn sendPostbtn">
                  <img src="/images/icons/send.svg" alt="like" className="img-fluid" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div
        className={
          heightUnset
            ? "allFeedUser commentHeightHome commentHeight-custom-bg-scroll"
            : "allFeedUser commentHeight commentHeight-custom-bg-scroll"
        }
      >
        {showCommentList &&
          commentList &&
          commentList.map((item, idx) => {
            return (
              <div className="userReplyOnPost">
                <div className="userRepliedProfile" onClick={onClose}>
                  <Link to={"/userprofile/" + item.createdBy?._id}>
                    <ProfileImage url={item.createdBy?.profile_img} style={{ borderRadius: "30px" }} />
                  </Link>
                </div>
                <div className="userRepliesInner">
                  <div className="userRepliedComment">
                    <div className="userRepliedName">
                      <div className="userRepliedName">
                        <Link to={"/userprofile/" + item.createdBy?._id} onClick={onClose}>
                          <h4 className="mb-0 username-title-custom" title={item?.createdBy?.user_name}>
                            {item?.createdBy?.user_name.length > 17
                              ? item?.createdBy?.user_name.slice(0, 17) + "..."
                              : item?.createdBy?.user_name}{" "}
                            {item.createdBy?.role.includes("userPaid") ? (
                              <img src="/images/icons/green-tick.svg" alt="" />
                            ) : (
                              ""
                            )}{" "}
                          </h4>
                        </Link>
                      </div>
                      <div className="userRepliedTime">
                        <div className="userReplyTime">
                          <span>{moment(item?.createdAt).fromNow()}</span>
                        </div>
                        <div className="userReplyDots">
                          <div className="commonDropDown dropdown">
                            <a data-bs-toggle="dropdown" href="javascript:void(0);">
                              <img src="/images/icons/dots.svg" alt="dots-white" className="img-fluid" />
                            </a>
                            <ul className="dropdown-menu">
                              {user._id!==item?.createdBy._id && <li>
                                <Link className="dropdown-item">
                                  Report
                                </Link>
                              </li>}
                              {item.createdBy?._id === user._id ? (
                                <li>
                                  <Link className="dropdown-item" onClick={() => deleteComment(item?._id)}>
                                    Delete
                                  </Link>
                                </li>
                              ) : (
                                ""
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="userRepliedTxt">
                      <p className="text-break" dangerouslySetInnerHTML={{ __html: item.comment }} />
                    </div>
                    <div className="userLikeReplyBtn">
                      <div className="replyBoxLike">
                        {item.likeCount > 0 ? (
                          <Link onClick={() => (item.isLiked ? dislikeComment(item._id) : likeComment(post._id, item._id))}>
                            {item.likeCount} {item.likeCount > 1 ? "Likes" : "Like"}
                          </Link>
                        ) : (
                          <Link onClick={() => (item.isLiked ? dislikeComment(item._id) : likeComment(post._id, item._id))}>
                            Like
                          </Link>
                        )}
                      </div>
                      <div className="replyBorder">|</div>
                      <div className="replyBoxReply">
                        <Link onClick={() => showNewReply(item._id + "_false")}>
                          Reply
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div>
                    {showNewReplyList.includes(item._id + "_false") && (
                      <div className="mt-3">
                        <Reply postId={post._id} comment={item} getCommentList={getCommentList} />
                      </div>
                    )}
                    <Link className="loadAllReplies" onClick={() => showReply(item._id)}>
                      {/* <a className="loadAllReplies" onClick={showReplyDirectHandler}> */}
                      Load {item.replies ? item.replies.length : 0} replies{" "}
                      <img src="/images/icons/down-arrow.svg" alt="downArrow" className="ms-1 img-fluid" />
                    </Link>
                    {/* reply */}
                    {showReplyList.includes(item._id) && (
                      <div className="userRepliesOnReply">
                        <div className="loadRepliesCollapse loadRepliesCollapseCustom">
                          {item.replies.length > 0 &&
                            item.replies.map((reply, rplyIdx) => (
                              <>
                                <div className="userReplyOnPost mb-2">
                                  <div className="userRepliedProfile" onClick={onClose}>
                                    <Link to={"/userprofile/" + reply.createdBy?._id}>
                                      <ProfileImage
                                        url={reply.createdBy?.profile_img}
                                        style={{ borderRadius: "30px" }}
                                      />
                                    </Link>
                                  </div>
                                  <div className="userRepliedComment userRepliedCommentCustom">
                                    <div className="userRepliedName">
                                      <div className="userRepliedName">
                                        <Link to={"/userprofile/" + reply.createdBy?._id} onClick={onClose}>
                                          <h4
                                            className="mb-0 username-title-custom"
                                            title={reply?.createdBy?.user_name}
                                          >
                                            {reply?.createdBy?.user_name.length > 17
                                              ? reply?.createdBy?.user_name.slice(0, 17) + "..."
                                              : reply?.createdBy?.user_name}{" "}
                                            {reply.createdBy?.role.includes("userPaid") ? (
                                              <img src="/images/icons/green-tick.svg" alt="" />
                                            ) : (
                                              // <img src="/images/icons/dot.svg" />
                                              ""
                                            )}{" "}
                                          </h4>
                                        </Link>
                                      </div>
                                      <div className="userRepliedTime">
                                        <div className="userReplyTime">
                                          <span>{moment(reply?.createdAt).fromNow()}</span>
                                        </div>
                                        <div className="userReplyDots">
                                          <div className="commonDropDown dropdown">
                                            <Link data-bs-toggle="dropdown">
                                              <img
                                                src="/images/icons/dots.svg"
                                                alt="dots-white"
                                                className="img-fluid"
                                              />
                                            </Link>
                                            <ul className="dropdown-menu">
                                              <li>
                                                <Link className="dropdown-item">
                                                  Report
                                                </Link>
                                              </li>
                                              {reply.createdBy?._id === user._id ? (
                                                <li onClick={() => deleteCommentReply(reply?._id)}>
                                                  <button type="button" className="dropdown-item">
                                                    Delete
                                                  </button>
                                                </li>
                                              ) : (
                                                ""
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="userRepliedTxt">
                                      <p className="text-break" dangerouslySetInnerHTML={{ __html: reply.reply }} />
                                    </div>
                                    <div className="userLikeReplyBtn">
                                      <div className="replyBoxLike">
                                        {reply.likeCount > 0 ? (
                                          <Link
                                            onClick={() =>
                                              reply.isLiked
                                                ? dislikeReply(reply._id)
                                                : likeReply(post._id, item._id, reply._id)
                                            }
                                          >
                                            {reply.likeCount} {reply.likeCount > 1 ? "Likes" : "Like"}
                                          </Link>
                                        ) : (
                                          <Link
                                            onClick={() =>
                                              reply.isLiked
                                                ? dislikeReply(reply._id)
                                                : likeReply(post._id, item._id, reply._id)
                                            }
                                          >
                                            Like
                                          </Link>
                                        )}
                                        {/* <a href="javascript:void(0);">Like</a> */}
                                      </div>
                                      <div className="replyBorder">|</div>
                                      <div className="replyBoxReply">
                                        <Link
                                          onClick={() => showNewReply(item._id + "_" + reply._id)}
                                        >
                                          Reply
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {showNewReplyList.includes(item._id + "_" + reply._id) && (
                                  <div className="mt-3">
                                    <Reply postId={post._id} comment={item} getCommentList={getCommentList} />
                                  </div>
                                )}
                              </>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        {post.commentCount > commentList?.length && (
          <Link className="showAllBtn" onClick={() => getCommentList()}>
            Show all
          </Link>
        )}
      </div>
    </>
  );
}
