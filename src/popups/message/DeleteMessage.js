import React, { useEffect, useState, useContext } from "react";
import ChatService from "../../services/chatService";
import GlobalContext from "../../context/GlobalContext";
const serv = new ChatService()
export default function DeleteMessage({ onClose, onFinish, message }) {
    const globalCtx = useContext(GlobalContext)
    const [user, setUser] = globalCtx.user
    const handleDelete = async () => {
        try {
            let obj = {
                _id: message._id,
                deleted_for: user._id
            }
            if (message.sender._id == user._id) {
                obj.deleted_for = "all"
            }
            await serv.deleteMessageTemp(obj).then(resp => {
                if (resp.result.data) {
                    onFinish()
                } else {
                    onClose()
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    console.log(message);
    return (
        <>
            <div className="modal" style={{ display: "block" }}>
                <div className="vertical-alignment-helper">
                    <div className="vertical-align-center">
                        <div className="delete_message modal-dialog modal-sm">
                            <div className="modal-content">
                                {/* Modal Header */}
                                <div className="modal-header border-bottom-0 pb-0">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
                                </div>
                                {/* Modal body */}
                                <div className="modal-body">
                                    <div className="postShared text-center">
                                        <h6>Delete this message?</h6>
                                        {message.sender._id == user._id ?
                                            <p>Your message will be permanently deleted</p>
                                            :
                                            <p>This message will be deleted for you.
                                                Other chat member will still be able to see it.</p>
                                        }
                                        <div className="unfollowBtn">
                                            <a href="javascript:void(0);" className="btn btn-outline-dark" onClick={onClose}>Cancel</a>
                                            <a href="javascript:void(0);" className="btn btn-outline-danger" onClick={handleDelete}>Delete</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    )
}