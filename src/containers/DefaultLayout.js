import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import Header from "./Header";
import OwlCarousel from "react-owl-carousel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SideButtons } from "../components/SideButtons/SideButtons.js";
import GlobalContext from "../context/GlobalContext";
import ChatsType from "../pages/home/ChatsType";
import Loader from "../components/Loader";


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
  const [loading, setLoading] = globalCtx.Loading
  const navigate = useNavigate()
  const [user, setUser] = globalCtx.user;

  useEffect(() => {
    const isMatchingPath = !!match;
    const isMatchingPath2 = !!match2;
    const isMatchingPath3 = !!match3;

    if (
      location.pathname === "/usersuggestion" ||
      location.pathname === "/groupsuggestion" ||
      location.pathname === "/signup/active/:id"

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
  useEffect(() => {
    if (user.ProfileUpdates === false) {
      navigate(`/signup/active/${user.active_token
        }`)
    }
    else if (user.UserSuggestions === false) {
      navigate("/usersuggestion")
    }
    else if (user.groupSuggestion === false) {
      navigate("/groupsuggestion")
    }
    else if (user.groupSuggestion === true && user.UserSuggestions === true && user.ProfileUpdates === true) {
      navigate("/")
    }
  }, [])

  if (blockContent) {
    return loading ? <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}><Loader /></div> : (
      <main className="clearfix ">
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
      <main className={"clearfix " + (headerRequired && " socialMediaTheme")}>
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


        {(location.pathname === "/" || location.pathname === "/dashboard" || location.pathname === "/discover") && <ChatsType />}

      </main>
    );
  }
}
export default DefaultLayout;
