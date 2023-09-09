import GlobalContext from "../../context/GlobalContext";
import UserFollowerService from "../../services/userFollowerService";
export default function Unfollow({ onClose, userData }) {
  const userFollowerServ = new UserFollowerService();
  const unfollowUser = async () => {
    try {
      await userFollowerServ
        .unfollowUser(userData.id)
        .then((resp) => {
          if (resp.message) {
            // getUserData()
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
      <div
        className="modal show modal-custom-zindex-bg"
        style={{ display: "block", background: "rgba(0, 0, 0, 0.35)" }}
        id="UnfollowModal"
      >
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center">
            <div className="unfollowModal modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header border-bottom-0 pb-0">
                  <button onClick={onClose} type="button" className="btn-close" data-bs-dismiss="modal" />
                </div>
                <div className="modal-body">
                  <div className="postShared text-center">
                    <h6>Unfollow @{userData.userName}?</h6>
                    <p>
                      Their posts will no longer show
                      <br /> up in your feed
                    </p>
                    <div className="unfollowBtn">
                      <a href="javascript:void(0);" className="btn btn-outline-dark" onClick={onClose}>
                        Cancel
                      </a>
                      <a href="javascript:void(0);" className="btn btn-outline-danger" onClick={unfollowUser}>
                        Unfollow
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
