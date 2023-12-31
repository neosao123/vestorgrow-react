import { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import GroupImage from "../../shared/GroupImage";
import GlobalContext from "../../context/GlobalContext";
import ChatService from "../../services/chatService";
import StepsService from "../../services/stepsService";
import UserService from "../../services/UserService";
import "./groupsuggestions.css"
import { IoChevronBackOutline } from "react-icons/io5";

const GroupSuggestion1 = () => {
    const serv = new ChatService();
    const stepServ = new StepsService();
    const userServ = new UserService();
    const globalCtx = useContext(GlobalContext);
    const navigate = useNavigate();
    const [curUser, setCurUser] = useState();
    const [user, setUser] = globalCtx.tempUser;
    const [user1, setUser1] = globalCtx.user;
    const [chatGroupList, setChatGroupList] = useState([]);
    const [reqPrivateId, setReqPrivateId] = useState([]);
    const [reqPublicId, setReqPublicId] = useState([]);
    const [showToolTip, setShowToolTip] = globalCtx.showToolTip;
    const [isAuthentiCated, setIsAuthentiCated] = globalCtx.auth;

    const getGroups = async () => {
        let response = await serv.getSuggestedGroups({
            "filter": {
                "isGroupChat": true
            }
        });
        setChatGroupList(response.data);
    };

    const handleJoinGroup = async (e, groupId, type) => {
        e.preventDefault();
        try {
            let obj = {
                groupId: groupId,
                id: user._id
            };
            await serv.tojoinGroup(obj).then(async (resp) => {
                if (resp.message) {
                    const element = document.querySelector("#group-" + groupId);
                    element.innerHTML = "Joined";
                    element.classList.add("btnColorBlack");
                    await userServ.getUser(user._id)
                        .then((res) => {
                            localStorage.setItem("user", JSON.stringify(res.data))
                            setUser({ ...res.data });
                            setUser1({ ...res.data });
                        })
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleRequestGroup = async (e, groupId, type) => {
        e.preventDefault();
        try {
            let obj = {
                groupId: groupId,
            };
            await serv.userInvitation(obj).then((resp) => {
                if (resp.message) {
                    const element = document.querySelector("#group-" + groupId);
                    element.innerHTML = "Requested";
                    element.classList.add("btnColorBlack");
                }
            });
            await serv.getUser(user._id)
                .then((res) => {
                    localStorage.setItem("user", JSON.stringify(res.data))
                    setUser({ ...res.data });
                    setUser1({ ...res.data });
                })
        } catch (err) {
            console.log(err);
        }
    };

    const handleRemoveGroup = (e, id) => {
        e.preventDefault();

        setChatGroupList(chatGroupList.filter((i) => i._id !== id));
    };

    const handleRedirect = (e) => {
        e.preventDefault();
        var hasGroupInvite = localStorage.getItem("group_invite");
        if (hasGroupInvite !== null && hasGroupInvite !== "") {
            localStorage.removeItem('group_invite');
            navigate(hasGroupInvite);
        } else {
            let deviceId = localStorage.getItem("device_id");
            let obj = {
                deviceId: deviceId,
                email: user.email
            }
            stepServ.updateGroupSuggestions(user._id, obj)
                .then((res) => {
                    setIsAuthentiCated(true)
                    localStorage.setItem("token", res.token)
                    setUser(res.data);
                    setUser1(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data))
                    setShowToolTip(1)
                    navigate("/", { replace: true });
                })
                .catch(error => console.log(error))

        }
    };

    useEffect(() => {
        getGroups();
    }, []);


    return (
        <main className="w-100 clearfix userSuggestion bgColor">
            <div className="signupLogo signupLogo_div_us" id="signupLogo_div_us1">
                <Link alt="logo" className="img-fluid signupLogo_a">
                    <img src="/images/profile/logo_image-main.svg" className="img-fluid img-logo" alt="vestorgrow-logo" />
                </Link>
            </div>
            <div className="sigUpSection2 signUp_Section signUp_Section-customPosition">
                <div className="main_container">
                    <div className="signUphead text-center mt-0 mb-2" style={{ position: "relative", maxWidth: "650px", width: "100%", textAlign: "center", margin: "auto" }}>
                        <h3 className="mb-2" style={{ fontSize: "50px" }}>Suggestions </h3>
                        <p style={{ fontSize: "16px", lineHeight: "22px", fontWeight: "400" }}>Groups you wish to join...</p>
                        <p onClick={() => navigate("/usersuggestions1")} style={{ position: "absolute", top: 12, left: 0, fontSize: "16px", color: "#000000" }}><IoChevronBackOutline style={{ marginBottom: "4px" }} />Back</p>
                    </div>
                    <div className="suggestion_sec">
                        <div className="row g-3" style={{ overflowY: "auto" }}>
                            {chatGroupList.map((item, index) => (
                                <div className="col-sm-6 col-lg-4" key={index}>
                                    <div className="suggestion_Card borderCard groupSuggestion_Card-custom" style={{ marginBottom: "0px" }}>
                                        <div className="seggestCardtop d-flex">
                                            <GroupImage url={item.chatLogo} style={{ width: "48px", height: "48px", borderRadius: "50%" }} />
                                            <div className="groupSuggestionText">
                                                <h6 className="mb-0" >
                                                    {item?.chatName}
                                                </h6>
                                                <div className="mb-1">
                                                    {item.users.length} members
                                                </div>
                                            </div>
                                        </div>
                                        <div className="seggestCardButton pt-4 mt-2 d-flex btnFollowDiv">
                                            <div
                                                className="editComm_btn editComm_btn-custom"
                                                onClick={(e) => handleRemoveGroup(e, item._id)}
                                            >
                                                Skip
                                            </div>
                                            {
                                                item.isPrivate ? (
                                                    <div
                                                        id={"group-" + item._id}
                                                        className={`btn btnColor btnFollow `}
                                                        onClick={(e) => handleRequestGroup(e, item._id, 'private')}
                                                    >
                                                        Request
                                                    </div>
                                                ) : (
                                                    <div
                                                        id={"group-" + item._id}
                                                        className={`btn btnColor btnFollow `}
                                                        onClick={(e) => handleJoinGroup(e, item._id, 'public')}
                                                    >
                                                        Join
                                                    </div>)
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ marginTop: "40px", display: "flex", gap: "5px", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        <button onClick={handleRedirect} style={{ maxWidth: "20em", width: "100%", color: "white", borderRadius: "20px", border: "1px solid #00808B", backgroundColor: "#00808B", padding: "8px 0px", fontWeight: "500", fontSize: "18px" }} >Finish</button>
                    </div>
                    {/* <div className="back_Skipbtn back_Skipbtn-customBtn d-flex justify-content-end" >
                        <div className="allViews followBtndiv">
                        </div>
                        <div className="skipBTn">
                            <NavLink className="editComm_btn" to={"/usersuggestions1"}>
                                Back
                            </NavLink>
                        </div>
                        <div className="skipBTn">
                            <NavLink className="btn btnColor" onClick={handleRedirect}>
                                Finish
                            </NavLink>
                        </div>
                    </div> */}
                </div>
            </div>
        </main>
    )
}

export default GroupSuggestion1