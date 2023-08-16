import Profile from "./Profile";
import Posts from "./Posts";
import ChatsType from "./ChatsType";
import "../../assets/Suggested.css";

function HomePageOld() {
  return (
    <div className="socialContant socialContant_custom main_container pb-0">
      <div className="socialContantInner">
        <Profile />
        <Posts />
        <div className="rightColumn">
          <ChatsType />
        </div>
      </div>
    </div>
  );
}

export default HomePageOld;
