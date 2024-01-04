import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Navigate, useLocation, useMatch, useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import Header from "./Header";
import OwlCarousel from "react-owl-carousel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SideButtons } from "../components/SideButtons/SideButtons.js";
import GlobalContext from "../context/GlobalContext";
import ChatsType from "../pages/home/ChatsType";
import Loader from "../components/Loader";
import ChatSidebar from "../components/SideBar/ChatSidebar.js";
import { replace } from "formik";


function DefaultLayout({ children }) {
  const globalCtx = useContext(GlobalContext)
  const location = useLocation();
  const [layoutRequired, setLayoutRequired] = useState(true);
  const [headerRequired, setHeaderRequired] = useState(true);
  const match = useMatch("/signin/active/:id");
  const match2 = useMatch("/signin/inactive");
  const match3 = useMatch("/signup/active/:id")
  const [isGroupChat, setisGroupChat] = globalCtx.isGroupChat;
  const [blockContent, setBlockContent] = useState(true);
  const [loading, setLoading] = globalCtx.Loading;
  const navigate = useNavigate();
  const [user, setUser] = globalCtx.user;
  const [shotChatlist, setShowChatList] = globalCtx.showChatList;



  useEffect(() => {
    const isMatchingPath = !!match;
    const isMatchingPath2 = !!match2;
    const isMatchingPath3 = !!match3;

    if (
      location.pathname === "/add_username" ||
      location.pathname === "/update_profile" ||
      location.pathname === "/avatar" ||
      location.pathname === "/profile_picture" ||
      location.pathname === "/profile_picture" ||
      location.pathname === "/bio" ||
      location.pathname === "/usersuggestions1" ||
      location.pathname === "/groupsuggestion1" ||
      location.pathname === "/notfound"

    ) {
      setLayoutRequired(false);
      setBlockContent(true);
    } else if (isMatchingPath) {
      setLayoutRequired(false);
      setBlockContent(true);
    } else if (isMatchingPath2) {
      setLayoutRequired(false);
      setBlockContent(true);
    }
    else if (isMatchingPath3) {
      setLayoutRequired(false);
      setBlockContent(true);
    } else {
      setLayoutRequired(true);
      setBlockContent(false);
    }

    //check header required
    if (location.pathname === "/createpost") {
      setHeaderRequired(false);
    } else {
      setHeaderRequired(true);
    }
    // var objDiv = document.getElementById("theme-contant");
    // objDiv.scrollTop = objDiv.scrollHeight;
    window.scrollTo(0, 0);
  }, [location.pathname]);


  // <Route exact path="/add_username" element={<Screen5 />} />
  //       <Route exact path="/update_profile" element={<Screen6 />} />
  //       <Route exact path="/avatar" element={<Srceen7 />} />
  //       <Route exact path="/profile_picture" element={<Screen8 />} />
  //       <Route exact path="/bio" element={<Describe />} />
  //       <Route exact path="/usersuggestions1" element={<UserSuggestion1 />} />
  //       <Route exact path="/groupsuggestion1" element={<GroupSuggestion1 />} />



  useEffect(() => {
    if (user.usernameUpdate === false || location.pathname === "/add_username") {
      setLoading(false)
      navigate("/add_username")
    }
    else if ((user.profilepictureUpdate === false && user.usernameUpdate === true && location.pathname !== "/avatar" && location.pathname !== "/profile_picture") || location.pathname === "/update_profile") {
      setLoading(false)
      navigate("/update_profile")
    }
    else if (location.pathname == "/avatar" || location.pathname == "/profile_picture") {
      setLoading(false);
      navigate(location.pathname)
    }
    else if ((user.bioUpdate === false && user.profilepictureUpdate === true && user.usernameUpdate === true) || location.pathname === "/bio") {
      setLoading(false)
      navigate("/bio")
    }
    else if ((user.UserSuggestions === false && user.bioUpdate === true && user.profilepictureUpdate === true && user.usernameUpdate === true) || location.pathname === "/usersuggestions1") {
      setLoading(false)
      navigate("/usersuggestions1")
    }
    else if ((user.groupSuggestion === false && user.UserSuggestions === true && user.bioUpdate === true && user.profilepictureUpdate === true && user.usernameUpdate === true) || location.pathname === "/groupsuggestion1") {
      setLoading(false)
      navigate("/groupsuggestion1")
    }
    else if (user.usernameUpdate === true && user.profilepictureUpdate === true && user.bioUpdate === true && user.groupSuggestion === true && user.UserSuggestions === true) {
      navigate("/", { replace: true })
    }
  }, [])

  // useEffect(() => {
  //   if (user.usernameUpdate === false || user.profilepictureUpdate === false || user.bioUpdate === false || user.groupSuggestion === false || user.UserSuggestions === false) {
  //     if (user.usernameUpdate === false) {
  //       navigate("/add_username", { replace: true })
  //     }
  //     else if (user.profilepictureUpdate === false) {
  //       navigate("/update_profile", { replace: true })
  //     }
  //     else if (location.pathname == "/avatar" || location.pathname == "/profile_picture") {
  //       navigate(location.pathname)
  //     }
  //     else if (user.bioUpdate === false) {
  //       navigate("/bio", { replace: true })
  //     }
  //     else if (user.UserSuggestions === false) {
  //       navigate("/usersuggestions1", { replace: true })
  //     }
  //     else {
  //       navigate("/groupsuggestion1", { replace: true })
  //     }
  //   }
  //   else {
  //     navigate(location.pathname)
  //   }
  // }, [location.pathname])

  if (blockContent) {
    return loading ? <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}><Loader /></div> : (
      <main className="clearfix" id={`${(location === "/" || location === "/dashboard") ? "scrollbarhide" : ""}`}>
        <div className="themeContant" style={{ padding: "0" }}>
          {children}
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
        />
        {(location.pathname === "/" || location.pathname === "/discover") && <ChatsType />}
      </main>
    );
  } else {
    return loading ? <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}><Loader /></div> : (
      user.usernameUpdate === false ? (<Navigate to={"/add-username"} replace={true} />) : user.profilepictureUpdate === false ? <Navigate to="/update_profile" replace={true} /> : user.bioUpdate === false ? <Navigate to={"/bio"} replace={true} /> : user.UserSuggestions === false ? <Navigate to={"usersuggestions1"} replace={true} /> : user.groupSuggestion === false ? <Navigate to={"/groupsuggestion1"} replace={true} /> : (<main className={"clearfix " + (headerRequired && " socialMediaTheme")}>
        {layoutRequired && <Sidebar />}
        <div
          className={
            "themeContant " +
            (location.pathname.includes("message") && "messageHeightFix")
          }
        >
          {layoutRequired && headerRequired && <Header />}
          {children}
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
        />

        {!shotChatlist && (location.pathname === "/" || location.pathname === "/dashboard" || location.pathname === "/discover") && < ChatSidebar />}


        {(location.pathname === "/" || location.pathname === "/dashboard" || location.pathname === "/discover") && <ChatsType />}

      </main>)
    );
  }
}
export default DefaultLayout;
