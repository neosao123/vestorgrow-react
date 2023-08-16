import React from 'react'

const ReactionFilledIcon = ({ ...props }) => {

    const likeImage = "/images/icons/filled-thumbs-up.svg";
    const loveImage = "/images/icons/filled-heart.svg";
    const insightImage = "/images/icons/filled-insightfull.svg";

    const { type } = props;

    if (type === "like") {
        return (
            <div><img src={likeImage} alt="" className='rc-icon' /></div>
        )
    } else if (type === "love") {
        return (
            <div><img src={loveImage} alt="" className='rc-icon' /></div>
        )
    } else {
        return (
            <div><img src={insightImage} alt="" className='rc-icon' /></div>
        )
    }


}

export default ReactionFilledIcon