import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../context/GlobalContext";
import ProfileImage from "../../shared/ProfileImage";
import { Link, NavLink, useNavigate } from "react-router-dom";
import FollowerFollowingList from "../../popups/followerFollowingList/FollowerFollowingList";
import NewsService from "../../services/newsService";
import UserService from "../../services/UserService";
import News from "../../popups/news/News";
import moment from "moment";
import ProfileCard from "../../components/_main/Dashboard/ProfileCard";
import Suggested from "./Suggested";
import image from "../../assets/images/logo512.png"

const serv = new NewsService();
const userServ = new UserService();
function Profile() {
  const globalCtx = useContext(GlobalContext);
  const navigate = useNavigate();
  const [user, setUser] = globalCtx.user;
  const [showUserList, setShowUserList] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [showNews, setShowNews] = useState(null);
  const [respNewsCount, setRespNewsCount] = useState({});



  const styles = {
    backgroundImage: `linear-gradient(url("../../assets/images/logo512.png"))`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"green"
  }


  const handleClickFollowersCount = (flag) => {
    setShowUserList(flag);
  }

  useEffect(() => {
    getNewsList(0, 3);
  }, [user]);

  const getNewsList = async (start, length) => {
    const obj = {};
    obj.is_active = true;
    if (start !== undefined) {
      obj.start = start;
      obj.length = length ? length : 3;
    }
    try {
      let resp = await serv.newsList(obj);
      if (resp) {
        setRespNewsCount(resp);
        if (resp.data) {
          setNewsList(resp.data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleReadMore = () => {
    if (respNewsCount.total > 50 && newsList.length < 50) {
      getNewsList(0, 50);
    } else {
      getNewsList();
    }
  };

  const handleReadLess = () => {
    getNewsList(0, 3);
  };

  const upgradeBtnClickHandle = () => {
    if (user.role.includes("userFree")) {
      navigate("/learning/locked");
    } else {
      navigate("/learning");
    }
  };

  return (
    <>
      <div className="leftColumn d-none d-sm-none d-md-block">
        <div style={{ position: "sticky", top: "98px" }}>
          <ProfileCard handleClickFollowersCount={handleClickFollowersCount} />
          {/* <Suggested/> */}
          {
            /* 
            <div className="becomeMember text-center">
              <p>Access to exclusive webinars, learning content and premium chat</p>
              <Link className="btn btnColor btnColorCustom" onClick={upgradeBtnClickHandle}>
                Upgrade to Premium
              </Link>
            </div> 
            */
          }
          <div className="bgWhiteCard todayNews">
            <div className="todayNewsInner">
              <div className="todayNewsHead" style={{ display: "flex", justifyContent: "space-between" }} >
                <h4>VestorGrow News</h4>
                <h6 style={{ color: "#088080" }}>See all</h6>
              </div>
              <hr className="horiz" />
              <div className="todayNewsList todayNewsList-custom" style={styles}>
                Coming Soon...
              </div>
            </div>
          </div>
        </div>
      </div>
      {showUserList && <FollowerFollowingList type={showUserList} onClose={() => setShowUserList(null)} />}
      {showNews && <News newsData={showNews} onClose={() => setShowNews(null)} />}
    </>
  );
}
export default Profile;
