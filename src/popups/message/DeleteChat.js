import React, { useEffect, useState, useContext } from "react";
import ChatService from "../../services/chatService";
import GlobalContext from "../../context/GlobalContext";
const serv = new ChatService()
export default function DeleteChat({ onClose, onFinish, chat }) {
    const globalCtx = useContext(GlobalContext)
    const [user, setUser] = globalCtx.user
    const handleDelete = async () => {
        try {
            let obj = {
                _id: chat,
                deleted_for: user._id
            }
            await serv.deleteChat(chat).then(resp => {
                if (resp.message) {
                    onFinish()
                } else {
                    onClose()
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
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
                                        <h6>Delete this entire conversation?</h6>
                                        <p>Your conversation will be permanently deleted</p>
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