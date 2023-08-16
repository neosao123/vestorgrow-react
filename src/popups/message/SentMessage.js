import React, { useEffect, useState, useContext } from "react";
export default function SentMessage({ onClose }) {
  setTimeout(() => {
    onClose();
  }, 3000);
  return (
    <>
      <div className="modal" style={{ display: "block" }}>
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div className="message_sendModal modal-dialog modal-sm">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header border-bottom-0 pb-0">
                  <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
                </div>
                {/* Modal body */}
                <div className="modal-body">
                  <div className="postShared text-center">
                    <img src="images/icons/share-post-tick.svg" alt="profile-img" className="img-fluid" />
                    <h6>Message Sent</h6>
                    <p className="mb-0">
                      Your message has been successfully sent <br />
                      to selected users
                    </p>
                  </div>
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
