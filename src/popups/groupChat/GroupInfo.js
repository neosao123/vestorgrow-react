import React, { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ChatService from "../../services/chatService";
import GlobalContext from "../../context/GlobalContext";
import InviteMembers from "./InviteMembers";
import moment from "moment";
import DeleteGroupChat from "./deleteGroupChat";
import GroupMembersList from "./GroupMembersList";
import { Link } from "react-router-dom";
const serv = new ChatService();
export default function GroupInfo({ onClose, onFinish, groupId, onEdit }) {
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [showInviteMembers, setShowInviteMembers] = useState(false);
  const [showDeleteGroup, setShowDeleteGroup] = useState(false);
  const [groupDetail, setGroupDetail] = useState({});
  const [showMemberList, setShowMemberList] = useState(false);
  const [groupInfoId, setGroupInfoId] = globalCtx.groupInfoId;

  useEffect(() => {
    getGroupDetails();
  }, [groupInfoId]);

  const getGroupDetails = async () => {
    try {
      await serv.getChat(groupInfoId).then((resp) => {
        setGroupDetail({ ...resp.data });
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleJoinGroup = async (groupInfoId) => {
    try {
      let obj = {
        groupId: groupInfoId,
      };
      await serv.joinGroup(obj).then((resp) => {
        if (resp.message) {
          onFinish();
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSendInvitation = async (invitedUser) => {
    try {
      let obj = {
        invitedUser: invitedUser,
        groupId: groupDetail?._id,
      };
      await serv.sendInvitation(obj).then((resp) => {
        if (resp.message) {
          // onFinish();
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteChat = async () => {
    setShowDeleteGroup({ _id: groupDetail?._id, chatName: groupDetail.chatName });
    try {
      await serv.deleteChat(groupInfoId).then((resp) => {
        if (resp.message) {
          onFinish();
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="modal shaw " style={{ display: "block" }}>
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center vertical-align-center-custom">
            <div className="edit-profile modal-dialog modal-lg modal-lg-custom modal-lg-customMobileInfo">
              <div className="modal-content">
                <div className="modal-header modal-headerInfoGroup-custom" style={{ overflow: "auto" }}>
                  <div className="modal-BackCreateGroup-custom" onClick={onClose}>
                    <img
                      className="arrow"
                      src="/images/icons/left-arrow.svg"
                      alt=""
                    />
                  </div>
                  <div className="followesNav groupInfo groupInfo-headingCustom">
                    <h4 className="mb-0">Group Infromation</h4>
                    {groupDetail?.createdBy?._id == user._id ? (
                      <button className="joinedButton">Created</button>
                    ) : (
                      groupDetail?.users?.includes(user._id) && <button className="joinedButton">Joined</button>
                    )}
                  </div>
                  <div className="createPostRight d-flex align-items-center createPostRight-mobile-close-custom">
                    <div className="createPostDropDown d-flex align-items-center"></div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
                  </div>
                </div>
                <div style={{ height: "calc(100vh - 150px)", overflowY: "auto", overflowX: "hidden", margin: "15px" }}>
                  <div className="groupMainDetail groupMainDetail-customPadding">
                    <div className="groupLogo m-3">
                      {groupDetail.chatLogo ? (
                        <img src={groupDetail.chatLogo} clasName="img-fluid" style={{ width: "100%", height: "auto" }} alt="" />
                      ) : (
                        <img src="/images/icons/group-logo.svg" clasName="img-fluid w-100" alt="" />
                      )}
                    </div>

                    <div className="col-sm-8 px-4 mb-1">
                      <p className="groupInfoName">{groupDetail.chatName}</p>
                    </div>
                    <p className="membersCount m-0 ms-3 mb-3">
                      <span style={{ color: "black" }} className="px-2">{groupDetail.isPrivate ? "Private" : "Public"} group </span>
                      <span>|</span>
                      <span onClick={() => setShowMemberList(true)} className="pointerA px-2">
                        <span className="fw-bold"> {groupDetail?.users?.length} </span> <span>{groupDetail?.users?.length > 1 ? "members" : "member"}</span>
                      </span>
                    </p>
                    <div className="col-sm-8 px-4 mb-2">
                      <p className="membersCount text-center" style={{ color: "black" }}>
                        <Link to={"/userprofile/" + groupDetail.createdBy?._id}>
                          <span className="membersCount">{groupDetail.createdBy?.user_name},</span>
                        </Link>
                        <span className="ms-2">{moment(groupDetail.createdAt).format("MMM DD, YYYY")}</span>
                      </p>
                    </div>
                  </div>
                  {/* Modal body */}
                  <div className="modal-body px-0">
                    <div className="tabSendContent">
                      <div className="myProfile_sec">
                        <div className="about_profile">
                          <div className="row pofiegrid pofiegrid-customInfo">
                            <div className="col-sm-12 px-4">
                              <div className="m-4 mb-sm-4 commonform">
                                <label>About our community</label>
                                <div className="bg-light p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                  <div dangerouslySetInnerHTML={{ __html: groupDetail.chatDesc }} />
                                </div>
                              </div>
                              <div className="m-4 mb-sm-4 commonform">
                                <label>Rules</label>
                                <div className="bg-light p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                  <div dangerouslySetInnerHTML={{ __html: groupDetail.chatRules }} />
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-12 px-4">
                              <div className="mx-4">
                                {groupDetail?.createdBy?._id === user._id ? (
                                  <div
                                    className="d-flex justify-content-between postBtnCustom-CustomBtnInfo"
                                    style={{ width: "100%" }}
                                  >
                                    <div>
                                      <button
                                        onClick={() => {
                                          handleDeleteChat();
                                        }}
                                        type="submit"
                                        className={"btn btnColor deleteBtnCustom"}
                                      >
                                        Delete group
                                      </button>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                      <button
                                        onClick={() => {
                                          onEdit(groupDetail._id);
                                        }}
                                        type="submit"
                                        className={"btn btnColor editBtnCustom"}
                                      >
                                        <img src="/images/profile/editIcon.svg" className="img-fluid me-1" alt="" />
                                        Edit group
                                      </button>
                                      <button
                                        onClick={() => setShowInviteMembers(true)}
                                        type="submit"
                                        className={"btn btnColor ms-3"}
                                      >
                                        Invite to group
                                      </button>
                                    </div>
                                  </div>
                                ) : groupDetail?.users?.includes(user._id) ? (
                                  <button
                                    onClick={() => setShowInviteMembers(true)}
                                    type="submit"
                                    className={"btn btnColor"}
                                  >
                                    Invite to group
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      handleJoinGroup(groupDetail._id);
                                    }}
                                    type="submit"
                                    className={"btn btnColor"}
                                  >
                                    Join
                                  </button>
                                )}
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
      {showInviteMembers && (
        <InviteMembers
          onClose={() => setShowInviteMembers(false)}
          chatId={groupId}
          existingUser={groupDetail.users}
          onConfirm={(data) => {
            // formik.setFieldValue("invitedUser", [...data]);
            handleSendInvitation(data);
            setShowInviteMembers(false);
          }}
        />
      )
      }
      {showMemberList && <GroupMembersList onClose={() => setShowMemberList(false)} chatId={groupId} adminUsers={groupDetail?.groupAdmin} />}
      {
        showDeleteGroup && (
          <DeleteGroupChat
            chat={showDeleteGroup}
            onClose={() => setShowDeleteGroup(false)}
            onFinish={() => {
              // handleShowDeleteGroup(data);
              setShowDeleteGroup(false);
              onClose();
            }}
          />
        )
      }
      {!(showInviteMembers || showDeleteGroup || showMemberList) && <div className="modal-backdrop show"></div>}
    </>
  );
}
