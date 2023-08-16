import React, { useEffect, useState, useContext } from "react";
import ChatService from "../../services/chatService";
import GlobalContext from "../../context/GlobalContext";
const serv = new ChatService();
export default function DeleteGroupChat({ onClose, onFinish, chat }) {
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [groupExecutionSuccess, setGroupExecutionSuccess] = globalCtx.groupExecutionSuccess;
  const handleDelete = async () => {
    try {
      await serv.deleteChat(chat._id).then((resp) => {
        if (resp.message) {
          onFinish();
          setGroupExecutionSuccess(!groupExecutionSuccess);
        } else {
          onClose();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="modal" style={{ display: "block", background: "rgba(0, 0, 0, 0.4)" }}>
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
                    <h6>Delete ‘{chat?.chatName}’ group</h6>
                    <p>Are you sre you want to delete this group?</p>
                    <div className="unfollowBtn">
                      <a href="javascript:void(0);" className="btn btn-outline-dark" onClick={onClose}>
                        Cancel
                      </a>
                      <a href="javascript:void(0);" className="btn btn-outline-danger" onClick={handleDelete}>
                        Delete
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
}
