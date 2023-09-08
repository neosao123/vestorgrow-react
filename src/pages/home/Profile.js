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
  const [showNews, setShowNews] = useState(null);

  const handleClickFollowersCount = (flag) => {
    setShowUserList(flag);
  }

  const upgradeBtnClickHandle = () => {
    if (user.role.includes("userFree")) {
      navigate("/learning/locked");
    } else {
      navigate("/learning");
    }
  };

  return (
    <>
      <div className="leftColumn d-none d-sm-none d-md-block" style={{ marginTop: "20px", maxWidth: "1150px" }}>
        <div style={{ position: "sticky", top: "66px" }}>
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
          <div className="todayNews">
            <div className="todayNewsInner">
              <div className="todayNewsHead">
                <h4>VestorGrow News</h4>
                <NavLink className="mb-1 see-all-news">See all</NavLink>
              </div>
              <hr className="horiz" />
              <div className="todayNewsList">
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
