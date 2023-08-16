export default function OtherPostShareFail({ onClose }) {
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
                <div className="modal-header border-bottom-0 pb-0">
                  <button type="button" className="btn-close" onClick={onClose} />
                </div>
                <div className="modal-body">
                  <div className="postShared text-center">
                    <img src="/images/icons/error.svg" alt="profile-img" className="img-fluid" />
                    <h6>Ooopsss! Post Error</h6>
                    <p>Your post has'nt been shared</p>
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
