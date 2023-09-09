export default function PostCreateSuccess({ onClose }) {
    setTimeout(() => {
        onClose();
    }, 3000);
    return (
        <>
            <div className="modal" style={{ display: "block" }}>
                <div className="vertical-alignment-helper">
                    <div className="vertical-align-center">
                        <div className="postSharedModel modal-dialog modal-sm">
                            <div className="modal-content">
                                {/* Modal Header */}
                                <div className="modal-header border-bottom-0 pb-0">
                                    <button type="button" onClick={onClose} className="btn-close" data-bs-dismiss="modal" />
                                </div>
                                {/* Modal body */}
                                <div className="modal-body">
                                    <div className="postShared text-center">
                                        <img src="/images/icons/share-post-tick.svg" alt="profile-img" className="img-fluid" />
                                        <h6>Post Created Successfully</h6>
                                        <p>Your post has been created</p>
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
