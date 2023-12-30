import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import UserFollowerServ from "../../services/userFollowerService";
import ProfileImage from "../../shared/ProfileImage";
import GlobalContext from "../../context/GlobalContext";
import { NavLink, Link } from 'react-router-dom';
import StepsService from "../../services/stepsService";
import { toast } from "react-toastify";
import "./usersuggestion1.css";

function UserSuggestion1() {
    const serv = new UserService();
    const followServ = new UserFollowerServ();
    const stepServ = new StepsService();
    const globalCtx = useContext(GlobalContext);
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [reqPrivateId, setReqPrivateId] = useState([]);
    const [reqPublicId, setReqPublicId] = useState([]);
    const [curUser, setCurUser] = useState();
    const [user, setUser] = globalCtx.tempUser;
    const [user1, setUser1] = globalCtx.user;

    useEffect(() => {
        getUserList();
    }, []);

    const getUserList = async () => {
        let data = await serv.getMostFollowedUsers({ id: user._id });
        setUserList(data.data.filter((usr) => usr._id !== user._id));
    };


    const handleUserSuggestion = async () => {
        try {
            if (user.following > 0) {
                await stepServ.updateUserSuggestions(user._id)
                    .then(async () => {
                        const res = await serv.getUser(user._id)
                        if (res.data) {
                            localStorage.setItem("user", JSON.stringify(res.data))
                            setUser({ ...res.data })
                            setUser1({ ...res.data })
                            navigate("/groupsuggestion1", { replace: true })
                        }
                    })


            }

        } catch (err) {
            throw err
        }
    }


    const handleFollowReq = async (id) => {
        try {
            if (reqPrivateId.find((i) => i === id) === undefined && reqPublicId.find((i) => i === id) === undefined) {
                let followingIdUser = await serv.getUser(id);
                let resp = await followServ.sendFollowtoReq({
                    followingId: id,
                    userId: user._id
                });
                if (followingIdUser.data.setting.private) {
                    setReqPrivateId((oldId) => [...oldId, resp.data.followingId]);
                } else if (!followingIdUser.data.setting.private) {
                    setReqPublicId((oldId) => [...oldId, resp.data.followingId]);
                }
                setCurUser(resp.data.userId);
            } else if (reqPrivateId.find((i) => i === id) !== undefined) {
                let res = await followServ.deleteFollowReq({
                    userId: curUser,
                    followingId: id,
                });
                setReqPrivateId((oldId) => [...oldId.filter((i) => i !== res.result.followingId)]);
            } else if (reqPublicId.find((i) => i === id) !== undefined) {
                let res = await followServ.unfollowUser(id);
                setReqPublicId((oldId) => [...oldId.filter((i) => i !== id)]);
            }
            await serv.getUser(user._id)
                .then((res) => {
                    localStorage.setItem("user", JSON.stringify(res.data))
                    setUser({ ...res.data })
                    setUser1({ ...res.data })
                })

        } catch (err) {
            console.log(err);
        }
    };


    const handleRemoveUser = (id) => {
        setUserList(userList.filter((i) => i._id !== id));
    };

    return (
        <main className="w-100 clearfix userSuggestion bgColor">
            <div className="signupLogo signupLogo_div_us" id="signupLogo_div_us1">
                <Link alt="logo" className="img-fluid signupLogo_a">
                    <img src="/images/profile/logo_image-main.svg" className="img-fluid img-logo" alt="vestorgrow-logo" />
                </Link>
            </div>
            <div className="sigUpSection2 signUp_Section signUp_Section-customPosition">
                <div className="main_container">
                    <div className="signUphead text-center mt-0 mb-2">
                        <h3 className="mb-2">Follow 1 or more accounts</h3>
                        <p>People you may want to follow</p>
                    </div>
                    <div className="suggestion_sec">
                        <div className="row allFeedUser">
                            {userList?.map((item, index) => (
                                <div className="col-sm-6 col-lg-4" key={index}>
                                    <div className="suggestion_Card borderCard suggestion_Card-custom">
                                        <div className="seggestCardtop d-flex">
                                            <div className="suggstCardProfie">
                                                <ProfileImage url={item.profile_img} style={{ width: "70px", height: "70px" }} />
                                            </div>
                                            <div className="aboutSuggestion aboutSuggestion-custom">
                                                <h6 className="mb-0 aboutSuggestion-customHeading">
                                                    <span className="mb-0">{item?.user_name} </span>
                                                    {item.role.includes("userPaid") ? <img src="/images/icons/green-tick.svg" alt="green-tick" /> : ""}{" "}
                                                </h6>
                                                <p className="mb-1">
                                                    {item?.first_name} {item?.last_name}
                                                </p>
                                                <p className="mb-1">{item.title} </p>
                                                <p className="mb-0">{item.followers} Followers</p>
                                            </div>
                                        </div>
                                        <div className="seggestCardButton pt-4 mt-2 d-flex btnFollowDiv">
                                            <Link
                                                className="editComm_btn editComm_btn-custom"
                                                onClick={() => handleRemoveUser(item._id)}
                                            >
                                                Skip
                                            </Link>
                                            <Link
                                                className={`btn btnColor btnFollow ${reqPrivateId.find((i) => i === item._id) !== undefined ||
                                                    reqPublicId.find((i) => i === item._id) !== undefined
                                                    ? "btnColorBlack"
                                                    : ""
                                                    }`}
                                                onClick={() => handleFollowReq(item._id)}
                                            >
                                                {reqPrivateId.find((i) => i === item._id) === undefined &&
                                                    reqPublicId.find((i) => i === item._id) === undefined
                                                    ? "Follow"
                                                    : reqPrivateId.find((i) => i === item._id) !== undefined
                                                        ? "Requested"
                                                        : reqPublicId.find((i) => i === item._id) !== undefined
                                                            ? "Following"
                                                            : "Follow"}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="back_Skipbtn back_Skipbtn-customBtn d-flex justify-content-end" >
                        <div className="allViews followBtndiv">
                        </div>
                        <div className="skipBTn" onClick={handleUserSuggestion}>
                            <NavLink className="btn btnColor">
                                Next
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
export default UserSuggestion1;
