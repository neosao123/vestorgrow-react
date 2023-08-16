import React from "react";

const RetrieveSubscription = ({ onClose, onSubmit }) => {
  return (
    <>
      <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.35)" }} id="UnfollowModal">
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div className="unfollowModal modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header border-bottom-0 pb-0">
                  <button onClick={onClose} type="button" className="btn-close" data-bs-dismiss="modal" />
                </div>
                <div className="modal-body">
                  <div className="postShared text-center">
                    <h6>Restart Subscription?</h6>
                    <p>Click to restart subscription again</p>
                    <div className="unfollowBtn">
                      <a href="javascript:void(0);" className="btn btn-outline-dark" onClick={onClose}>
                        Cancel
                      </a>
                      <a href="javascript:void(0);" className="btn btn-outline-danger" onClick={onSubmit}>
                        Resume Again
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RetrieveSubscription;
