import React from "react";
export default function News({ onClose, newsData }) {
    return (
        <>
            <div className="modal" style={{ display: "block" }}>
                <div className="vertical-alignment-helper">
                    <div className="vertical-align-center">
                        <div className="edit_profile editproBiomodal modal-dialog modal-lg">
                            <div className="modal-content">
                                {/* Modal Header */}
                                <div className="modal-header">
                                    <div className="followesNav">
                                        <h4 className="mb-0">{newsData?.title}</h4>
                                    </div>
                                    <div className="createPostRight d-flex align-items-center">
                                        <button type="button" className="btn-close" onClick={onClose} />
                                    </div>
                                </div>
                                {/* Modal body */}
                                <div className="modal-body px-0">
                                    <div className="tabSendContent">
                                        <div className="aboutboi_modaldata newsbodycustom">
                                            <p dangerouslySetInnerHTML={{ __html: newsData?.desc }}></p>
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