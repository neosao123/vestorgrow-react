import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../../context/GlobalContext";
import ProfileImage from "../../../shared/ProfileImage";
import { Link, NavLink, useNavigate } from "react-router-dom";
import FollowerFollowingList from "../../../popups/followerFollowingList/FollowerFollowingList";
import UserService from "../../../services/UserService";



const ProfileCard = ({ ...props }) => {
    const { handleClickFollowersCount } = props;
    const userServ = new UserService();

    const globalCtx = useContext(GlobalContext);
    const navigate = useNavigate();
    const [user, setUser] = globalCtx.user;
    const [showToolTip, setShowToolTip] = globalCtx.showToolTip;
    const [showUserList, setShowUserList] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        try {
            let resp = userServ.getUser(user?._id);
            if (resp.data) {
                setUserData(resp.data);
                if (!resp.data?.first_view?.includes("home")) {
                    setShowToolTip(1);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <div className="aboutUserBox d-none d-md-block mb-3">
            {
                user?.cover_img ? (
                    <div className="profileCoverPic" style={{ backgroundImage: `url(${user.cover_img})` }} />
                ) : (
                    <div className="profileCoverPic" style={{ backgroundImage: `url(./images/profile/image_cover_profile.png)` }} />
                )
            }
            <div className="profilePic profilePic-custom">
                <NavLink to={"/userprofile/" + user?._id}>
                    <ProfileImage url={user?.profile_img} />
                </NavLink>
            </div>
            <div className="profileTxt text-center profileTxt-custom-flex">
                <NavLink to={"/userprofile/" + user?._id}>
                    <h4 className="mb-0" title={user?.user_name}>
                        {user?.user_name.length > 20 ? user?.user_name.slice(0, 20) + "..." : user?.user_name}
                        {user.role.includes("userPaid") ? <img src="/images/icons/green-tick.svg" alt="" /> : ""}{" "}
                    </h4>
                </NavLink>
                <p className="txtOne mb-0">
                    {user?.first_name} {user?.last_name}
                </p>
                <p className="txtOne mb-0 overflow-hidden word-wrapCustom">{user?.title !== undefined ? user?.title : "Vestorgrow User"}</p>
                <p className="txtTwo mb-0">{user?.location}</p>
            </div>
            <div className="userFollowerCounter">
                <Link onClick={() => handleClickFollowersCount("follower")} className="userFollowers">
                    <div className="userFollowersInner">
                        <h6>{user.followers}</h6>
                        <span>Followers</span>
                    </div>
                </Link>
                <Link onClick={() => handleClickFollowersCount("following")} className="userFollowing">
                    <div className="userFollowingInner">
                        <h6>{user.following}</h6>
                        <span>Following</span>
                    </div>
                </Link>
            </div>
        </div>

    )
}

export default ProfileCard