import React, { useState, useContext, useEffect } from "react";
import UserService from "../../services/UserService";
import UserBlockedServ from "../../services/userBlockedService"
import ProfileImage from "../../shared/ProfileImage";
import { Link } from "react-router-dom";

const serv = new UserService();
const blockedServ = new UserBlockedServ();
export default function BlockAccountSetting() {
    const [userList, setUserList] = useState([])
    const [searchTxt, setSearchTxt] = useState("")
    useEffect(() => {
        getBlockedUserList()
    }, [searchTxt]);

    const getBlockedUserList = async () => {
        try {
            let obj = {
                filter: {
                    searchText: searchTxt
                }
            }
            let resp = await blockedServ.listUser(obj)
            if (resp.data) {
                setUserList(resp.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleUnblockUser = async (id) => {
        try {
            let resp = await blockedServ.unblockUser(id)
            if (resp.message) {
                getBlockedUserList()
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div className="tab-pane active">
                <div className="socialContant py-4">
                    <div className="settig_heading">
                        <h5>Blocking</h5>
                        <p>Edit your account settings and change your password</p>
                    </div>
                    <div className="sett_bocking commonSettgcard">
                        <div className="tabSendContent">
                            <div className="followersList">
                                <div className="followSearch px-0 mb-0">
                                    <div className="followSearchInner">
                                        <img src="/images/icons/search.svg" alt="search" className="img-fluid" />
                                        <input type="text" className="form-control" placeholder="Type a name" name="search" value={searchTxt} onChange={(e) => setSearchTxt(e.target.value)} />
                                    </div>
                                </div>
                                <div className="list_head my-4 pb-2">
                                    <h6>Block Users List</h6>
                                </div>
                                <div className="followListsInner px-0">
                                    {userList.length > 0 && userList.map((item, idx) => {
                                        return (item.blockedId &&
                                            <div className="otherUser">
                                                <div className="followOtherUser">
                                                    <div className="followOtherUserPic">
                                                        {/* <img src={} alt="search" className="img-fluid" /> */}
                                                        <Link to={"/userprofile/" + item.blockedId?._id}>
                                                            <ProfileImage url={item.blockedId?.profile_img} />
                                                        </Link>
                                                    </div>
                                                    <div className="followOtherUserName">
                                                        <Link to={"/userprofile/" + item.blockedId?._id}>
                                                            <h5 className="mb-0">{item.blockedId?.first_name ? `${item.blockedId?.first_name} ${item.blockedId.last_name}` : item.blockedId?.user_name} {item.blockedId?.role.includes("userPaid") ? <img src="/images/icons/green-tick.svg" alt="green-tick" /> : ""} </h5> {/** <img src="/images/icons/dot.svg" /> */}
                                                        </Link>
                                                        <p className="mb-0">{item.blockedId?.title}</p>
                                                    </div>
                                                </div>
                                                <div className="followBtn">
                                                    <Link onClick={() => handleUnblockUser(item.blockedId._id)} className="btn followingBtn">Unblock</Link>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}