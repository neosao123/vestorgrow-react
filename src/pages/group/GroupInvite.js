import React, { useContext, useEffect, useState } from 'react';
import GlobalContext from "../../context/GlobalContext";
import { Link, useParams, useNavigate } from 'react-router-dom';
import ChatService from '../../services/chatService';
import moment from 'moment';
import InviteMembers from '../../popups/groupChat/InviteMembers';
import GroupMembersList from '../../popups/groupChat/GroupMembersList';

const GroupInvite = ({ onClose, onFinish, groupId, onEdit }) => {
    const [groupDetail, setGroupDetail] = useState();
    const [showInviteMembers, setShowInviteMembers] = useState(false);
    const [showMemberList, setShowMemberList] = useState(false);
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const serv = new ChatService();
    let { id } = useParams();
    const handleJoinGroup = async (groupId) => {
        try {
            let obj = {
                groupId: groupId,
            };
            const resp = await serv.joinGroup(obj);
            if (resp.message) {
                //onFinish();
                navigate("/");
            }
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
                    onFinish();
                }
            });
        } catch (err) {
            console.log(err);
        }
    };
    const getGroupDetails = async () => {
        try {
            await serv.getChat(id).then((resp) => {
                console.log(resp);
                setGroupDetail({ ...resp.data });
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteChat = async () => {
        // setShowDeleteGroup({ _id: groupDetail?._id, chatName: groupDetail.chatName });
        // try {
        //   await serv.deleteChat(id).then((resp) => {
        //     if (resp.message) {
        //       // onFinish();
        //     }
        //   });
        // } catch (err) {
        //   console.log(err);
        // }
    };

    useEffect(() => {
        getGroupDetails();
        localStorage.setItem("groupInviteId", id);
    }, [groupId]);

    return (
        <>
            <div className="mt-5">
                <div className="card mx-auto p-4" style={{ maxWidth: "50rem", borderRadius: "20px" }}>
                    <div className="mb-3 mt-3 text-center align-items-center">
                        {groupDetail?.chatLogo ? (
                            <img src={groupDetail?.chatLogo} className="img-fluid " style={{
                                "width": "96px",
                                "height": "96px",
                                "background": "#d9d9d9",
                                "borderRadius": "50%"
                            }} alt="" />
                        ) : (
                            <img src="/images/icons/group-logo.svg" className="img-fluid" style={{
                                "width": "96px",
                                "height": "96px",
                                "background": "#d9d9d9",
                                "borderRadius": "50%"
                            }} alt="" />
                        )}
                        <div className=" mb-3">
                            <p className="groupInfoName">{groupDetail?.chatName}</p>
                        </div>
                        <div className=" mb-3">
                            <span style={{ color: "black" }}>{groupDetail?.isPrivate ? "Private" : "Public"} group |</span>
                            <span onClick={() => setShowMemberList(true)} className="pointerA">
                                <Link>
                                    <span className="fw-bold"> {groupDetail?.users?.length}</span> members
                                </Link>
                            </span>
                        </div>
                        <div className="mb-3">
                            <Link to={"/userprofile/" + groupDetail?.createdBy?._id}>
                                <span className="">{groupDetail?.createdBy?.user_name},</span>
                            </Link>
                            {moment(groupDetail?.createdAt).format("MMM DD, YYYY")}
                        </div>
                    </div>
                    <div className="card-body commonform">
                        <div className='mb-3'>
                            <label>About our community</label>
                            <div
                                className="bg-light p-3"
                            >
                                <div dangerouslySetInnerHTML={{ __html: groupDetail?.chatDesc }} />
                            </div>
                        </div>
                        <div className="mb-3">

                            <label>Rules</label>
                            <div
                                className="bg-light p-3"
                            >
                                <div dangerouslySetInnerHTML={{ __html: groupDetail?.chatRules }} />
                            </div>
                        </div>
                        <div className='mt-3 mb-3'>
                            {groupDetail?.createdBy?._id === user._id ? (
                                <>
                                    <button
                                        onClick={() => setShowInviteMembers(true)}
                                        type="submit"
                                        className={"btn btnColor ms-3 mb-5"}
                                    >
                                        Invite to group
                                    </button>

                                </>
                            ) : groupDetail?.users?.includes(user?._id) ? (
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
                                        handleJoinGroup(groupDetail?._id);
                                    }}
                                    type="submit"
                                    className={"btn btnColor"}
                                >
                                    Join group
                                </button>
                            )}
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
            {showMemberList && <GroupMembersList onClose={() => setShowMemberList(false)} chatId={id} />}
        </>
    )
}

export default GroupInvite;

