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


function DefaultLayout({ children }) {
  const globalCtx = useContext(GlobalContext)
  const location = useLocation();
  const [layoutRequired, setLayoutRequired] = useState(true);
  const [headerRequired, setHeaderRequired] = useState(true);
  const match = useMatch("/signin/active/:id");
  const match2 = useMatch("/signin/inactive");
  const [isGroupChat, setisGroupChat] = globalCtx.isGroupChat;
  const [blockContent, setBlockContent] = useState(true);
  const navigate = useNavigate()


  useEffect(() => {
    const isMatchingPath = !!match;
    const isMatchingPath2 = !!match2;

    if (
      location.pathname === "/usersuggestion" ||
      location.pathname === "/groupsuggestion"
    ) {
      setLayoutRequired(false);
      setBlockContent(true);
    } else if (isMatchingPath) {
      setLayoutRequired(false);
      setBlockContent(true);
    } else if (isMatchingPath2) {
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

  if (blockContent) {
    return (
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
        <div >
          <SideButtons />
        </div>
      </main>
    );
  } else {
    return (
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

        <div >
          <SideButtons />
        </div>
      </main>
    );
  }
}
export default DefaultLayout;
