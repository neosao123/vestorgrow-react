import React, { useEffect, useState } from "react";
import noProfile from "../../assets/images/noprofile.png";
import "../../assets/Suggested.css";
import SuggestedService from "../../services/suggestedService";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import UserFollowerService from "../../services/userFollowerService";
import Loader from "../../components/Loader";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import UserService from "../../services/UserService";

const serv = new UserService()

function Suggested() {
  const globalCtx = useContext(GlobalContext)
  const [user, setUser] = globalCtx.user;
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
      setsuggestedTab(res?.users);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteSuggestedHome = (id) => {
    const updatedItems = suggestedHome.filter((item) => item?._id !== id);
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

  const getUserData = async () => {
    // setUserList([]);
    try {
      let resp = await serv.getUser(user?._id);
      if (resp.data) {
        setUser({ ...resp.data });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredSuggested = suggestedTab.filter((user) => {
    return user?.user_name.toString().toLowerCase().includes(search);
  });

  //for follow request
  const handleFollowRequest = async (id) => {
    try {
      let resp = await followerServ.sendFollowReq({ followingId: id });
      getSuggestedHome()
      getUserData()
      return resp.data;
    } catch (err) { console.log("ERROR:", err) }
  };

  return (
    <>
      <div className="suggestionBox mb-3 " style={{ top: "66px", paddingBottom: "15px" }}>
        <div className="suggestionHead">
          <span>Suggested for You</span>
          <span
            onClick={() => {
              setModalShow(true);
              setSearch("");
            }}
          >
            See All
          </span>
        </div>
        <div style={{ backgroundColor: "#d1d1d1", height: "1px", width: "100%", }}></div>
        <div className="suggestionBody" style={{ padding: "0px 0px  0px 0px", display: "flex", flexDirection: "column" }}>
          {suggestedHome?.length > 0 && suggestedHome?.slice(0, 4).map((user) => {
            return (
              <div style={{ display: "flex", gap: "15px", borderBottom: "1px solid #d1d1d1", width: "100%", paddingTop: "5px", paddingLeft: "10px" }}>
                <div style={{ display: "flex", paddingLeft: "5px" }} >
                  <Link to={"/userprofile/" + user?._id}>
                    <img
                      style={{ height: "50px", width: "50px", marginTop: "10px", borderRadius: "50%" }}
                      src={
                        user?.profile_img
                          ? user.profile_img
                          : "/images/profile/default-profile.png"
                      }
                      alt="profile"

                    />
                  </Link>
                </div>
                <div style={{ width: "80%", padding: "15px 0px", paddingLeft: "5px", display: "flex", flexDirection: "column", gap: "1px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "600", color: "#0B1E1C" }} >{user?.user_name?.length > 15
                    ? user?.user_name?.slice(0, 15) + "..."
                    : user.user_name}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 400, color: "#465D61" }} >
                    {user?.title ? (
                      user?.title?.length > 24 ? (
                        user?.title?.slice(0, 24) + "..."
                      ) : (
                        user.title
                      )
                    ) : (
                      "Vestorgrow User"
                    )}
                  </span>
                  {user.isFollowing === "following" ? (
                    <button style={{ color: "#ffffff", backgroundColor: "#00808b", border: "none", fontWeight: 600, fontSize: "16px", width: "100px", padding: "8px 15px", borderRadius: "20px" }}>Following</button>
                  ) : user.isFollowing === "notfollowing" ? (
                    <button
                      style={{ color: "#ffffff", backgroundColor: "#00808b", border: "none", marginTop: "5px", fontWeight: 600, fontSize: "16px", width: "100px", padding: "5px 15px", borderRadius: "20px" }}
                      onClick={() => {
                        handleFollowRequest(user._id);
                      }}
                    >
                      Follow
                    </button>
                  ) : (
                    <button style={{ color: "#ffffff", backgroundColor: "#00808b", border: "none", fontWeight: 600, fontSize: "16px", width: "100px", padding: "8px 15px", borderRadius: "20px" }}>Requested</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL FOR SUGGESTED USER */}
      <Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setSearch("");
        }}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
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
        </Modal.Header>
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
        <Modal.Body>
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
              <div className="row wd-100">
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
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Suggested;
