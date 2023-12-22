import { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import GroupImage from "../../shared/GroupImage";
import GlobalContext from "../../context/GlobalContext";
import ChatService from "../../services/chatService";
import StepsService from "../../services/stepsService";

const GroupSuggestion1 = () => {
    const serv = new ChatService();
    const stepServ = new StepsService()
    const globalCtx = useContext(GlobalContext);
    const navigate = useNavigate();
    const [curUser, setCurUser] = useState();
    const [user, setUser] = globalCtx.tempUser;
    const [chatGroupList, setChatGroupList] = useState([]);
    const [reqPrivateId, setReqPrivateId] = useState([]);
    const [reqPublicId, setReqPublicId] = useState([]);
    const [showToolTip, setShowToolTip] = globalCtx.showToolTip;
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
            await serv.tojoinGroup(obj).then((resp) => {
                if (resp.message) {
                    const element = document.querySelector("#group-" + groupId);
                    element.innerHTML = "Joined";
                    element.classList.add("btnColorBlack");
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
                    setUser({ ...res.data })
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
            stepServ.updateGroupSuggestions(user._id)
                .then((res) => {
                    setShowToolTip(1)
                    navigate("/", { replace: true });
                })

        }
    };

    useEffect(() => {
        getGroups();
    }, []);


    return (
        <main className="w-100 clearfix userSuggestion bgColor">
            <div className="signupLogo signupLogo_div_us">
                <Link alt="logo" className="img-fluid signupLogo_a">
                    <img src="/images/profile/logo_image-main.svg" className="img-fluid img-logo" alt="vestorgrow-logo" />
                </Link>
            </div>
            <div className="sigUpSection2 signUp_Section signUp_Section-customPosition">
                <div className="main_container">
                    <div className="signUphead text-center mt-0 mb-2">
                        <h3 className="mb-2">Suggestions </h3>
                        <p>Groups you wish to join...</p>
                    </div>
                    <div className="suggestion_sec">
                        <div className="row g-3">
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
                    <div className="back_Skipbtn back_Skipbtn-customBtn d-flex justify-content-end" >
                        <div className="allViews followBtndiv">
                        </div>
                        <div className="skipBTn">
                            <NavLink className="editComm_btn" to={"/usersuggestion"}>
                                Back
                            </NavLink>
                        </div>
                        <div className="skipBTn">
                            <NavLink className="btn btnColor" onClick={handleRedirect}>
                                Next
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default GroupSuggestion1