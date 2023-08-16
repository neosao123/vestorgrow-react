

import React, { useEffect, useState } from "react";
import noProfile from "../../assets/images/noprofile.png";
import "../../assets/Suggested.css";
import SuggestedService from "../../services/suggestedService";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import UserFollowerService from "../../services/userFollowerService";
import Loader from "../../components/Loader";
import '../../assets/Suggested.css';

function AllSuggestions({ showModal, closeSuggestionModal }) {
    const suggestedServ = new SuggestedService();
    const followerServ = new UserFollowerService();
    const [modalShow, setModalShow] = useState(false);
    const [suggestedHome, setsuggestedHome] = useState([]);
    const [suggestedTab, setsuggestedTab] = useState([]);
    const [category, setCategory] = useState("trending_people");
    const [tabRequest, setTabRequest] = useState({
        searchText: "",
        tab: "trending_people",
    });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const suggestTabBtn = [
        { key: 1, tab: "trending_people", value: "Trending People" },
        { key: 2, tab: "you_may_know", value: "People You May Know" },
        { key: 3, tab: "new", value: "New to VestorGrow" },
    ];

    useEffect(() => {
        getSuggestedHome();
        getSuggestedTab();
    }, [category, search]);

    const getSuggestedHome = async () => {
        try {
            let res = await suggestedServ.suggestListHome();
            setsuggestedHome(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    const getSuggestedTab = async () => {
        setLoading(true);
        try {
            let res = await suggestedServ.suggestListTab(tabRequest);
            setsuggestedTab(res.users);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteSuggestedHome = (id) => {
        const updatedItems = suggestedHome.filter((item) => item._id !== id);
        setsuggestedHome(updatedItems);
    };
    const deleteSuggested = (id) => {
        const updatedItems = suggestedTab.filter((item) => item._id !== id);
        setsuggestedTab(updatedItems);
    };

    const handleClick = async (newCategory) => {
        setCategory(newCategory);
        setSearch("");
        setTabRequest({ tab: newCategory });
    };

    const handleSearch = async (e) => {
        const newSearch = await e.target.value;
        setSearch(newSearch);
        setTabRequest({ searchText: newSearch, tab: category });
        getSuggestedTab();
    };

    const filteredSuggested = suggestedTab.filter((user) => {
        return user?.user_name.toString().toLowerCase().includes(search);
    });
    //for follow request
    const handleFollowRequest = async (id) => {
        try {
            let resp = await followerServ.sendFollowReq({ followingId: id });
            return resp.data;
        } catch (err) {
        }
    };
    return (
        <>
            <div className="modal show" style={{ display: "block" }}>
                <div className="vertical-alignment-helper">
                    <div className="vertical-align-center">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                                        Suggestions
                                    </h1>
                                    <div className="suggestInputGroup">
                                        <img
                                            src="/images/icons/search.svg"
                                            alt="search-icon"
                                            className="img-fluid"
                                        />
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search"
                                            name="search"
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <button type="button" onClick={closeSuggestionModal} className="btn-close" />
                                </div>
                                <div className="button-header hscroll" style={{ borderBottom: "0" }}>
                                    {suggestTabBtn.map((tab) => {
                                        return (
                                            <>
                                                <button
                                                    key={tab.key}
                                                    className={category === tab.tab ? "active-tab" : ""}
                                                    onClick={() => handleClick(tab.tab)}
                                                >
                                                    {tab.value}
                                                </button>
                                            </>
                                        );
                                    })}
                                </div>
                                <div className="modal-body">
                                    <div
                                        className="suggestionModalBody"
                                    >
                                        {loading ? (
                                            // Display loader while loading is true
                                            <div className="suggest-load">
                                                <Loader />
                                            </div>
                                        ) : filteredSuggested?.length === 0 ? (
                                            "No users Found"
                                        ) : (
                                            <div className="row" style={{ width: "100%" }}>
                                                {
                                                    filteredSuggested?.map((user) => {
                                                        return (
                                                            <div className="col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
                                                                <div className="profileBox">
                                                                    <Link to={"/userprofile/" + user?._id}>
                                                                        <div className="profile-image">
                                                                            <img
                                                                                src={
                                                                                    user?.profile_img
                                                                                        ? user.profile_img
                                                                                        : "/images/profile/default-profile.png"
                                                                                }
                                                                                alt="profile"
                                                                            />
                                                                        </div>
                                                                        <div className="profile-content">
                                                                            <span className="name">
                                                                                {user?.user_name?.length > 18
                                                                                    ? user?.user_name?.slice(0, 18) + "..."
                                                                                    : user.user_name}
                                                                            </span>
                                                                            <span className="title">
                                                                                {user?.title !== "" ? user?.title?.length > 18
                                                                                    ? user?.title?.slice(0, 18) + "..."
                                                                                    : user.title : ""}
                                                                            </span>
                                                                            <span className="followers">
                                                                                {user.followers} Followers
                                                                            </span>
                                                                        </div>
                                                                    </Link>
                                                                    <div className="suggst-btns">
                                                                        <button
                                                                            className="skip"
                                                                            onClick={() => deleteSuggested(user._id)}
                                                                        >
                                                                            Skip
                                                                        </button>
                                                                        {user.isFollowing === "following" ? (
                                                                            <button className="follow">Following</button>
                                                                        ) : user.isFollowing === "requested" ? (
                                                                            <button className="follow">Requested</button>
                                                                        ) : (
                                                                            <button
                                                                                className="follow"
                                                                                onClick={() => {
                                                                                    handleFollowRequest(user._id);
                                                                                }}
                                                                            >
                                                                                Follow
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    );
}

export default AllSuggestions;

