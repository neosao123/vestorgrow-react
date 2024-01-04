import React from 'react';
import { MdOutlineMarkEmailUnread } from "react-icons/md";

const EmailVerification = (setShowEmailPopup) => {

    const handleClose = () => {
        setShowEmailPopup(false);
    };

    return (
        <>
            <div className="modal" style={{ display: "block" }}>
                <div className="vertical-alignment-helper">
                    <div className="vertical-align-center">
                        <div className="delete_message modal-dialog modal-sm">
                            <div className="modal-content">
                                {/* Modal Header */}
                                <div className="modal-header border-bottom-0 pb-0">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={handleClose} />
                                </div>
                                {/* Modal body */}
                                <div className="modal-body" >
                                    <div className="postShared text-center" >
                                        <MdOutlineMarkEmailUnread fontSize={"50px"} color={"#00808b"} />
                                    </div>
                                    <div className="postShared text-center">
                                        <h2 style={{ fontWeight: "600" }}>We have sent you a confirmation email</h2>
                                        <p>Click on the link we have sent you to activate your account. If you don’t have it in your inbox please check spam/junk folder.</p>
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

export default EmailVerification