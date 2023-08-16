import { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import UserService from "../services/UserService";
import Tooltip from "../shared/Tooltip";
import ProfileImage from "../shared/ProfileImage";
const serv = new UserService();
export default function SearchBar() {
  const location = useLocation();
  const globalCtx = useContext(GlobalContext);
  const [suggestionList, setSuggestionList] = useState([]);
  const [user, setUser] = globalCtx.user;
  const [showToolTip, setShowToolTip] = globalCtx.showToolTip;
  const [searchText, setSearchText] = globalCtx.searchText;
  useEffect(() => {
    setSearchText("");
  }, [location]);
  useEffect(() => {
    setSuggestionList([]);
    if (searchText != "") {
      getSuggestionList();
    }
  }, [searchText]);

  const getSuggestionList = async () => {
    // setSuggestionList([]);
    let obj = { searchText: searchText };
    try {
      let dataList = [];
      let resp = await serv.getSearchData(obj);
      if (resp) {
        if (location.pathname.includes("/message")) {
          // dataList =
          //   resp.message?.data &&
          //   resp.message.data.map((item) => ({
          //     text: item?.content,
          //     userName: item?.sender?.user_name,
          //     // title: item?.title ? item.title : "",
          //     // isPaid: item.role.includes("userPaid") ? true : false,
          //     profileImg: item?.sender?.profile_img ? item?.sender?.profile_img : "/images/profile/default-profile.png",
          //     url: `/message/show/${item.chat}/${item._id}`,
          //   }));
          dataList =
            resp.user?.data &&
            resp.user.data
              .filter((usr) => usr._id !== user._id)
              .map((item) => ({
                text: item?.first_name && item?.last_name ? `${item?.first_name} ${item?.last_name}` : "",
                userName: item?.user_name ? item?.user_name : item?.first_name,
                title: item?.title ? item.title : "",
                isPaid: item.role.includes("userPaid") ? true : false,
                profileImg: item?.profile_img ? item?.profile_img : "/images/profile/default-profile.png",
                url: `/userprofile/${item._id}`,
              }));

        } else if (location.pathname === "/" || location.pathname.includes("dashboard")) {
          dataList =
            resp.user?.data &&
            resp.user.data
              .filter((usr) => usr._id !== user._id)
              .map((item) => ({
                text: item?.first_name && item?.last_name ? `${item?.first_name} ${item?.last_name}` : "",
                userName: item?.user_name ? item?.user_name : item?.first_name,
                title: item?.title ? item.title : "",
                isPaid: item.role.includes("userPaid") ? true : false,
                profileImg: item?.profile_img ? item?.profile_img : "/images/profile/default-profile.png",
                url: `/userprofile/${item._id}`,
              }));
        } else if (location.pathname === "/learning") {
          resp.learningMaterial?.data &&
            dataList.push(
              ...resp.learningMaterial.data.map((item) => ({ text: item.title, url: `/learning/material/${item._id}` }))
            );
          resp.lesson?.data &&
            dataList.push(
              ...resp.lesson.data.map((item) => ({ text: item.course_name, url: `/learning/lesson/${item._id}` }))
            );
          resp.webinar?.data &&
            dataList.push(...resp.webinar.data.map((item) => ({ text: item.title, url: `/learning` })));
        }
        // else if (location.pathname.includes("discover")) {
        //     resp.post?.data && dataList.push(...resp.post.data.map(item => (
        //         { text: item.message.slice(0, 40), url: `/` }
        //     )))
        // }
        setSuggestionList([...dataList]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchText = () => {
    setSearchText("");
  };

  return (
    <>
      <div className="SearchBar SearchBarCustom">
        <div className="inputGroup inputGroupCustom" id="searchBar">
          <img src="/images/icons/search.svg" alt="search-icon" className="img-fluid" />
          <input
            type="text"
            value={searchText}
            className="form-control"
            placeholder={
              location.pathname === "/" || location.pathname.includes("dashboard")
                ? "Search for users"
                : location.pathname.includes("learning")
                  ? "Search for courses and webinars"
                  : location.pathname.includes("discover")
                    ? "Search for posts"
                    : "Search"
            }
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText.length > 0 && (
            <img
              src="/images/profile/cross-icon.svg"
              className="search_cross search_cross-user"
              onClick={() => handleSearchText()}
            />
          )}
        </div>
        {showToolTip === 1 && window.innerWidth > 768 && (
          <Tooltip
            anchorId="searchBar"
            place="bootom"
            html={`
              <div> 
                <h4 class="tooltipHead">
                  Search bar
                </h4>
                <p class="tooltipContent">Search for other users</p>
                <div class="toolBottom">
                  <div class="toolcounter">1/6</div>
                  <div class="toolButton">
                    <button class="editComm_btn tooltipbtn" id="tooltipSkip">Skip</button>
                    <button class="btn btnColor tooltipbtn" id="tooltipNext1">Next</button>
                  </div>
                </div>
              </div>`
            }
            arrow="arrow"
            style={{ marginTop: "55px" }}
            className="tooltipBox-Custom"
          />
        )}

        <div className="searchResult searchResult-customShadow">
          <ul className="overflowScrollStop">
            {searchText != "" &&
              suggestionList &&
              suggestionList.map((item, idx) => {
                return (
                  <li>
                    <Link to={item.url}>
                      {/* <span>{item.text}</span> */}
                      <div className="search-resultCustom-div">
                        <div className="search-resultCustom-image">
                          <ProfileImage url={item.profileImg} style={{ borderRadius: "30px" }} />
                        </div>
                        <div className="search-resultCustom-udata">
                          <h4>
                            {/* {item.userName}{" "} */}
                            {item?.userName?.length > 25 ? item?.userName?.slice(0, 25) + "..." : item?.userName}{" "}
                            {item?.isPaid ? (
                              <img src="/images/icons/green-tick.svg" className="search-resultCustom-udata-paid" />
                            ) : (
                              ""
                            )}{" "}
                          </h4>
                          <p>{item.text}</p>
                          <p>{item.title}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}
