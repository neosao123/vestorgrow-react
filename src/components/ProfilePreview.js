import React, { useState, useEffect, useRef, useContext } from 'react';
import '../assets/previewprofile.css';
import GlobalContext from '../context/GlobalContext';
import { Link } from 'react-router-dom';
import Unfollow from '../popups/unfollow/Unfollow';
import UserFollowerService from '../services/userFollowerService';
import UserService from '../services/UserService';
import { toast } from 'react-toastify';

const ProfilePreview = ({ ...props }) => {
    const { userId, profile_img, section, refreshPost } = props;

    const followerServ = new UserFollowerService();
    const userServ = new UserService();

    const globalCtx = useContext(GlobalContext);
    const hideTimeoutRef = useRef(null);
    let hoverTimeout;
    const [open, setOpen] = useState();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState(0);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loginUser, setUser] = globalCtx.user;
    const [followingStatus, setFollowingStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getUserDataPreview = async () => {
        const result = await userServ.getUserDataPreview({ userId: userId });
        if (result.user) {
            setUserData(result.user);
            setPosts(result.postsCount);
            setMediaFiles(result.postsMediaFiles);
            setFollowingStatus(result.followingStatus);
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        } else {
            setIsLoading(false);
        }
    }

    const handleLeave = (e) => {
        e.preventDefault();
        if (open) {
            setOpen(false);
            clearTimeout(hoverTimeout);
        }
    }

    const handleHover = async (e) => {
        e.preventDefault();
        if (loginUser._id !== userId) {
            setTimeout(() => {
                setIsLoading(true);
                setOpen(true);
                getUserDataPreview();
            }, 1000);
        }
    }

    const handleSectionLeave = (e) => {
        e.preventDefault();
        if (open) {
            hideTimeoutRef.current = setTimeout(() => {
                setOpen(false);
            }, 1800);
        }
    }

    const handleSectionOver = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
    }

    const followUser = async (e, id, user_name, isRequested) => {
        e.preventDefault();
        try {
            let resp = await followerServ.sendFollowReq({ followingId: id });
            if (resp.data) {
                getUserDataPreview();
                const message = isRequested ? `You have requested to follow ${user_name}` : `You are now following ${user_name}`;
                toast.success(message, {
                    position: "top-center",
                    closeOnClick: true,
                    pauseOnHover: true
                });
                refreshPost();
            }
        } catch (err) {
            console.log("Failed");
        }
    };


    const Loading = () => {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: "100%" }}>
                <i className="fa fa-2x fa-circle-o-notch fa-spin vs-color"></i>
            </div>
        );
    }

    const handleClose = () => {

    }

    return (
        <div style={{ position: "relative" }}>
            <div style={{}}>
                <img
                    alt=""
                    src={profile_img !== "" ? profile_img : "/images/profile/default-profile.png"}
                    className="img-fluid"
                    style={{ cursor: "pointer", borderRadius: "50%", width: "48px", height: "48px" }}
                    onMouseEnter={handleHover}
                />
            </div>
            {
                open && (
                    <>
                        <div className={"hover-profile-container shadow p-2 " + section} onMouseOver={handleSectionOver} onMouseLeave={handleSectionLeave}>
                            {isLoading ? (
                                <Loading />
                            ) : (
                                <div>
                                    <div className='user-section'>
                                        <div className="d-flex align-items-start">
                                            <img
                                                src={userData?.profile_img ? userData.profile_img : "/images/profile/default-profile.png"}
                                                className="card-img-top hoverProfile"
                                                alt="Profile"
                                                style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "8px" }}
                                            />
                                            <div className=''>
                                                <div>{userData?.user_name}</div>
                                                <div>{userData?.first_name + " " + userData?.last_name}</div>
                                            </div>
                                        </div>
                                        <div className='my-3'>
                                            <div className="d-flex justify-content-around">
                                                <div className='text-center ms-2'>
                                                    <span className='count'>{posts}</span>
                                                    <br />
                                                    <span className='sb-title'>posts</span>
                                                </div>
                                                <div className='text-center ms-4'>
                                                    <span className='count'>{userData?.followers}</span>
                                                    <br />
                                                    <span className='sb-title'>followers</span>
                                                </div>
                                                <div className='text-center'>
                                                    <span className='count'>{userData?.following}</span>
                                                    <br />
                                                    <span className='sb-title'>following</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-around">
                                            {
                                                mediaFiles && mediaFiles?.map((data, index) => {
                                                    return <div key={index} className="square" style={{ width: "80px", height: "80px" }}>
                                                        <img src={data} alt="" style={{ width: "80px", height: "80px" }} />
                                                    </div>
                                                })
                                            }
                                        </div>
                                        <div className='mt-2'>
                                            {
                                                followingStatus && (
                                                    (followingStatus === "" || followingStatus === "notfollowing") ? (
                                                        <button type='button' onClick={(e) => followUser(e, userData?._id, userData?.user_name, false)} className="btn btnColor w-100">
                                                            Follow
                                                        </button>
                                                    ) : followingStatus === "requested" ? (
                                                        <Link className="btn btnColor bg-dark w-100">
                                                            Requested
                                                        </Link>
                                                    ) : (
                                                        <button className="btn btnColor bg-dark w-100">
                                                            Following
                                                        </button>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )
            }
        </div >

    )
}

export default ProfilePreview