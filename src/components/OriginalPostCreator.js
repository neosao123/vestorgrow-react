import React from 'react';
import moment from 'moment';

const OriginalPostCreator = ({ ...props }) => {
    const { originalPostData, createdByUser } = props;
    const postCreator = originalPostData?.createdBy;
    const postCreatorUserId = postCreator?._id ?? "";
    const postSharedUserId = createdByUser?._id ?? "";
    if (postCreatorUserId !== "" && postSharedUserId !== "") {
        if (postCreatorUserId !== postSharedUserId) {
            return (
                <div className="d-flex align-items-center border-bottom pb-2 mb-3">
                    <img src={postCreator.profile_img} alt={postCreator.user_name} className="me-3" style={{ width: "30px", height: "30px", borderRadius: "15px" }} />
                    <div>
                        <span style={{ fontWeight: "600" }} className="me-2">{postCreator.user_name}'s</span>
                        <small>Post</small>
                    </div>
                </div>
            )
        }
    }
}

export default OriginalPostCreator