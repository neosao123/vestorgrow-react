import Profile from "./Profile";
import Posts from "./Posts";
import ChatsType from "./ChatsType";
import "../../assets/Suggested.css";
import { useEffect, useState } from "react";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import Suggested from "./Suggested";
import "./homepage.css";

function HomePageOld() {
  const globalCtx = useContext(GlobalContext)
  const [showChat, setShowChat] = globalCtx.ChatBoxVisibily;

  useEffect(() => {
    localStorage.setItem("messageboxstate", JSON.stringify([]))
  }, [])
  

  return (
    <div className="socialContant socialContant_custom main_container pb-0 fixed-container" >
      <div className="socialContantInner">
        <Profile />
        <Posts />
        {showChat && <div className="rightColumn">
          <Suggested />
          {/* <ChatsType /> */}
        </div>}
      </div>
    </div>
  );
}

export default HomePageOld;
