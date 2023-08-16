import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import UserService from "../../services/UserService";
export default function DeleteAccount({ onClose }) {
    const userServ = new UserService()
    const navigate = useNavigate()
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const handleDelete = async () => {
        try {
            let resp = await userServ.deleteUser(user._id)
            if (resp.message) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login")
                window.location.reload(true)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div className="modal" style={{ display: "block" }}>
                <div className="vertical-alignment-helper">
                    <div className="vertical-align-center">
                        <div className="unfollowModal modal-dialog modal-sm">
                            <div className="modal-content">
                                {/* Modal Header */}
                                <div className="modal-header border-bottom-0 pb-0">
                                    <button type="button" className="btn-close" onClick={onClose} />
                                </div>
                                {/* Modal body */}
                                <div className="modal-body">
                                    <div className="postShared text-center">
                                        <h6>Delete Account</h6>
                                        <p>By clicking on delete your account will be deleted
                                            {/* <br />You will never get back data */}
                                        </p>
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