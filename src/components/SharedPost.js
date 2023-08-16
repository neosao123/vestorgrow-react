import React from 'react';
import moment from 'moment';

const SharedPost = ({ ...props }) => {
    const { originalPostData, createdByUser, createdAt, shareType } = props;
    const postCreator = originalPostData?.createdBy;
    const postCreatorUserId = postCreator?._id ?? "";
    const postSharedUserId = createdByUser?._id ?? "";
    if (postCreatorUserId !== "" && postSharedUserId !== "") {
        if (postCreatorUserId !== postSharedUserId) {
            return (
                <div className="d-flex align-items-center border-bottom pb-2 mb-3">
                    <img src={createdByUser.profile_img} alt={createdByUser.user_name} className="me-3" style={{ width: "30px", height: "30px", borderRadius: "15px" }} />
                    <div>
                        <div>
                            <span style={{ fontWeight: "600" }} className="me-2">{createdByUser.user_name}</span>
                            <span style={{ fontSize: "12px", marginTop: "3px" }}>Reposted</span>
                        </div>
                        <div>
                            <span>{moment(createdAt).fromNow()}</span>
                            <span className="fa fa-circle mx-2" style={{ fontSize: "8px" }} aria-hidden="true" />
                            <span style={{color:"grey"}}>{shareType}</span>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<></>)
        }
    } else {
        return (<></>)
    }
}

export default SharedPost