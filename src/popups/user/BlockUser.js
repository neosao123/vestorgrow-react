import React, { useEffect, useState, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import UserBlockedServ from "../../services/userBlockedService"
const blockedServ = new UserBlockedServ();
export default function BlockUser({ onClose, onFinish, user }) {
    const blockUser = async (userId) => {
        try {
            let obj = {
                blockedId: user._id
            }
            let resp = await blockedServ.sendBlockReq(obj)
            if (resp.data) {
                onFinish()
            } else {
                onClose()
            }
        } catch (err) {
            console.log(err);
        }
    }
    console.log(user);
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
                                        <h6>Block @{user?.first_name} {user?.last_name}?</h6>
                                        <p>This user will be blocked</p>
                                        <div className="unfollowBtn">
                                            <a href="javascript:void(0);" className="btn btn-outline-dark" onClick={onClose}>Cancel</a>
                                            <a href="javascript:void(0);" className="btn btn-outline-danger" onClick={blockUser}>Delete</a>
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