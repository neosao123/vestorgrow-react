import React from "react";
import ReportService from "../../services/reportService";

const Report = ({ onClose, object }) => {
  const reportServ = new ReportService();
  const reportUser = async () => {
    try {
      await reportServ
        .reportPost(object)
        .then((resp) => {
          if (resp.message) {
            onClose();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <>
        <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.35)" }} id="reportModal">
          <div className="vertical-alignment-helper">
            <div className="vertical-align-center">
              <div className="unfollowModal modal-dialog modal-sm">
                <div className="modal-content">
                  <div className="modal-header border-bottom-0 pb-0">
                    <button onClick={onClose} type="button" className="btn-close" data-bs-dismiss="modal" />
                  </div>
                  <div className="modal-body">
                    <div className="postShared text-center">
                      <h6>Report</h6>
                      <p>
                        This posts will be reported
                        <br /> to our admin team
                      </p>
                      <div className="unfollowBtn">
                        <a href="javascript:void(0);" className="btn btn-outline-dark" onClick={onClose}>
                          Cancel
                        </a>
                        <a href="javascript:void(0);" className="btn btn-outline-danger" onClick={reportUser}>
                          Report
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
    </>
  );
};

export default Report;
