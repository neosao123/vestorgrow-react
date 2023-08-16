import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import moment from "moment";
export default function DetailAbout({ onClose, onEdit, user, isEditable }) {
    //console.log("users info", user);
    useEffect(() => {
        if (window.innerWidth > 768) {
            document.body.style.overflow = "hidden";
            document.body.style.marginRight = "20px";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, []);
    // const globalCtx = useContext(GlobalContext);
    // const [user, setUser] = globalCtx.user;
    return (
        <>
            <div className="modal modal-custom-zindex-bg" style={{ display: "block", background: "rgba(0, 0, 0, 0.35)" }}>
                <div className="vertical-alignment-helper">
                    <div className="vertical-align-center">
                        <div className="edit_profile editproBiomodal modal-dialog modal-lg">
                            <div className="modal-content">
                                {/* Modal Header */}
                                <div className="modal-header">
                                    <div className="followesNav">
                                        <h4 className="mb-0">About</h4>
                                    </div>
                                    <div className="createPostRight d-flex align-items-center">
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => {
                                                onClose();
                                                document.body.style.overflow = "";
                                                document.body.style.marginRight = "";
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* Modal body */}
                                <div className="modal-body px-0">
                                    <div className="tabSendContent">
                                        <div className="aboutboi_modaldata">
                                            <div className="other_option mb-3">
                                                <span style={{ fontWeight: "700" }}>
                                                    Bio
                                                </span>
                                                {
                                                    /* 
                                                        <textarea className="form-control" rows={5} id="useBio" defaultValue={user?.bio} /> 
                                                    */
                                                }
                                                <p className="whiteSpace aboutBio allFeedUser">{user?.bio}</p>
                                            </div>
                                            {
                                                /* 
                                                    <div className="other_option mb-4">
                                                        <img src="/images/profile/gift.svg" /> <span>{moment(user?.date_of_birth).format("DD[th] MMMM, YYYY")}</span>
                                                    </div> 
                                                */
                                            }
                                            <div className="other_option mb-3">
                                                <span style={{ fontWeight: "700" }}>
                                                    Gender
                                                </span>
                                                <p>{user?.gender}</p>
                                            </div>
                                            <div className="other_option mb-3">
                                                <span style={{ fontWeight: "700" }}>
                                                    Mail
                                                </span>
                                                <p>{user?.email}</p>
                                            </div>
                                            {isEditable && (
                                                <div className="userprof_btns justify-content-center">
                                                    <a href="javascript:void(0)" className="editComm_btn" onClick={onEdit}>
                                                        {" "}
                                                        <img src="/images/profile/editIcon.svg" /> Edit Profile
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="modal-backdrop show"></div> */}
        </>
    );
}
