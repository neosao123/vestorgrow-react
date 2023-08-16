import React from "react";

function EnlargeImage({ imgUrl, onClose }) {
    return (
        <>
            <div className="modal" style={{ display: "block" }}>
                <div className="vertical-alignment-helper">
                    <div className="vertical-align-center">
                        <div className="modal-dialog modal-md bg-white" style={{ borderRadius: "15px" }}>
                            <div className="modal-content">
                                <div className="modal-header text-end" style={{ border: "none", padding: "1rem" }}>
                                    <h5>Profile Picture</h5>
                                    <button type="button" className="btn-close" onClick={onClose} />
                                </div>
                                <div className="modal-body text-center">
                                    <img src={imgUrl} alt="" style={{ borderRadius: "15px", border: "2px solid #f2f2f2", background: "#f2f2f2", width: "100%" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    );
}

export default EnlargeImage;