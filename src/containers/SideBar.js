import { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import UserService from "../services/UserService";
import Tooltip from "../shared/Tooltip";

const serv = new UserService();
function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedNav, setSelectedNav] = useState(null);
  const [selectedNavIcon, setSelectedNavIcon] = useState(null);
  const [toggleMoreList, setToggleMoreList] = useState(false);
  const globalCtx = useContext(GlobalContext);
  const [createPostPopup, setCreatePostPopup] = globalCtx.createPostPopup;
  const [showToolTip, setShowToolTip] = globalCtx.showToolTip;
  const [user, setUser] = globalCtx.user;

  const handleLogout = async () => {
    try {
      await serv.logout({})
        .then((res) => {
          if (res.data) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.reload(true)
            // navigate("/login")
          }
        })
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleActive();
  }, [location.pathname]);

  useEffect(() => {
    if (toggleMoreList) {
      document.body.style.overflow = "hidden";
    } else if (!toggleMoreList) {
      document.body.style.overflow = "";
    }
  }, [toggleMoreList]);

  const handleActive = () => {
    if (location.pathname === "/") {
      setSelectedNav("/");
      setSelectedNavIcon("/");
    } else if (location.pathname.includes("learning")) {
      setSelectedNav("/learning");
      setSelectedNavIcon("/learning");
    } else if (location.pathname.includes("globalmessage")) {
      setSelectedNav("/globalmessage");
      setSelectedNavIcon("/globalmessage");
    } else if (location.pathname.includes("groupmessage")) {
      setSelectedNav("/groupmessage");
      setSelectedNavIcon("/groupmessage");
    } else if (location.pathname.includes("discover")) {
      setSelectedNav("/discover");
      setSelectedNavIcon("/discover");
    } else if (location.pathname.includes("profile")) {
      setSelectedNav("/profile");
      setSelectedNavIcon("/profile");
    } else if (location.pathname.includes("setting")) {
      setSelectedNav("/setting");
      setSelectedNavIcon("/setting");
    } else if (location.pathname.includes("message")) {
      setSelectedNav("/message");
      setSelectedNavIcon("/message");
    } else if (location.pathname.includes("createpost")) {
      setSelectedNav("/createpost");
      setSelectedNavIcon("/createpost");
    } else {
      setSelectedNav(null);
      setSelectedNavIcon(null);
    }
  };

  const handelToggleMoreList = () => {
    setToggleMoreList(!toggleMoreList);
    setSelectedNavIcon("/more");
  };

  const handleClickHome = () => {
    document.body.style.overflow = "";
    setSelectedNavIcon("/");
    setToggleMoreList(false);
  };

  const handleClickDiscover = () => {
    document.body.style.overflow = "";
    setSelectedNavIcon("/discover");
    setToggleMoreList(false);
  };

  const handleClickPost = () => {
    document.body.style.overflow = "";
    setSelectedNavIcon("/createpost");
    setToggleMoreList(false);
  };

  const handleClickMessage = () => {
    document.body.style.overflow = "";
    setSelectedNavIcon("/message");
    setToggleMoreList(false);
  };

  return (
    <>
      <aside className={"themeSidebar Sidebar-more-zindex-c"} >
        <div className="sidebarInner sidebarInnerCustom">
          <div className="themeLogo">
            <Link to="/">
              <img src="/images/logo-2.svg" alt="logo" className="img-fluid" />
            </Link>
          </div>
          <div className="themeMenu themeMenuCustom">
            <ul className="nav flex-column">
              <li className={"nav-item " + (selectedNavIcon === "/" ? " active" : "")} onClick={handleClickHome}>
                <Link className={"nav-link" + (selectedNav === "/" ? " active" : "")} to="/">
                  <div className="sideMenu">
                    <div className="menuIcon">
                      <svg width="21" height="21" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M22.6668 8.72722L14.6668 1.71389C13.9334 1.05795 12.984 0.695313 12.0001 0.695312C11.0162 0.695313 10.0668 1.05795 9.33346 1.71389L1.33346 8.72722C0.909951 9.10599 0.571993 9.57063 0.342089 10.0902C0.112185 10.6098 -0.00439008 11.1724 0.000126392 11.7406V23.3939C0.000126392 24.4548 0.421554 25.4722 1.1717 26.2223C1.92184 26.9725 2.93926 27.3939 4.00013 27.3939H20.0001C21.061 27.3939 22.0784 26.9725 22.8286 26.2223C23.5787 25.4722 24.0001 24.4548 24.0001 23.3939V11.7272C24.0027 11.1613 23.8853 10.6013 23.6554 10.0841C23.4256 9.56698 23.0886 9.1045 22.6668 8.72722ZM14.6668 24.7272H9.33346V18.0606C9.33346 17.7069 9.47394 17.3678 9.72398 17.1177C9.97403 16.8677 10.3132 16.7272 10.6668 16.7272H13.3335C13.6871 16.7272 14.0262 16.8677 14.2763 17.1177C14.5263 17.3678 14.6668 17.7069 14.6668 18.0606V24.7272ZM21.3335 23.3939C21.3335 23.7475 21.193 24.0866 20.9429 24.3367C20.6929 24.5867 20.3537 24.7272 20.0001 24.7272H17.3335V18.0606C17.3335 16.9997 16.912 15.9823 16.1619 15.2321C15.4117 14.482 14.3943 14.0606 13.3335 14.0606H10.6668C9.60593 14.0606 8.58851 14.482 7.83837 15.2321C7.08822 15.9823 6.66679 16.9997 6.66679 18.0606V24.7272H4.00013C3.6465 24.7272 3.30737 24.5867 3.05732 24.3367C2.80727 24.0866 2.66679 23.7475 2.66679 23.3939V11.7272C2.66703 11.5379 2.70758 11.3508 2.78575 11.1784C2.86391 11.006 2.9779 10.8522 3.12013 10.7272L11.1201 3.72722C11.3634 3.51346 11.6762 3.39558 12.0001 3.39558C12.324 3.39558 12.6368 3.51346 12.8801 3.72722L20.8801 10.7272C21.0223 10.8522 21.1363 11.006 21.2145 11.1784C21.2927 11.3508 21.3332 11.5379 21.3335 11.7272V23.3939Z"
                          fill="currentColor"
                        />
                      </svg>
                      {/* <img src="/images/icons/home.svg" alt="menu-icon" className="img-fluid" /> */}
                    </div>
                    <div className="menuTxt">
                      <span>Home</span>
                    </div>
                  </div>
                </Link>
                <div className="activeBar"></div>
              </li>
              <li
                className={"nav-item " + (selectedNavIcon === "/discover" ? " active" : "")}
                onClick={handleClickDiscover}
              >
                <Link
                  className={"nav-link" + (selectedNav === "/discover" ? " active" : "")}
                  to="/discover"
                  id="discover"
                >
                  <div className="sideMenu">
                    <div className="menuIcon">
                      <svg width="21" height="21" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M27.7998 16.0579C27.7998 22.5763 22.5156 27.8605 15.9972 27.8605C9.47884 27.8605 4.19463 22.5763 4.19463 16.0579C4.19463 9.5395 9.47884 4.2553 15.9972 4.2553C22.5156 4.2553 27.7998 9.5395 27.7998 16.0579ZM29.9998 16.0579C29.9998 23.7913 23.7307 30.0605 15.9972 30.0605C8.26381 30.0605 1.99463 23.7913 1.99463 16.0579C1.99463 8.32448 8.26381 2.0553 15.9972 2.0553C23.7307 2.0553 29.9998 8.32448 29.9998 16.0579ZM14.1324 14.7393L19.3227 12.38L17.8575 18.729L12.6627 20.618L14.1324 14.7393ZM21.7396 11.6908C22.0377 10.399 20.7254 9.32583 19.5185 9.87445L13.1781 12.7564C12.5952 13.0214 12.1651 13.5377 12.0098 14.1589L10.2546 21.1796C9.94364 22.4234 11.1487 23.5095 12.3536 23.0714L18.6604 20.778C19.329 20.5348 19.829 19.9698 19.989 19.2766L21.7396 11.6908Z"
                          fill="currentColor"
                        />
                      </svg>

                      {/* <img src="/images/icons/dashboard.svg" alt="menu-icon" className="img-fluid" /> */}
                    </div>
                    <div className="menuTxt">
                      <span>Discover</span>
                    </div>
                  </div>
                </Link>
                <div className="activeBar"></div>
              </li>
              <li className={"nav-item d-none d-md-block " + (selectedNav === "/profile" ? " active" : "")}>
                <Link className={"nav-link" + (selectedNav === "/profile" ? " active" : "")} to="/profile" id="profile">
                  <div className="sideMenu">
                    <div className="menuIcon">
                      <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20.9467 17.0072C22.2539 15.9787 23.208 14.5684 23.6763 12.9724C24.1446 11.3765 24.1039 9.6742 23.5597 8.10247C23.0155 6.53074 21.995 5.1677 20.6401 4.20298C19.2852 3.23827 17.6633 2.71985 16 2.71985C14.3367 2.71985 12.7148 3.23827 11.3599 4.20298C10.005 5.1677 8.98446 6.53074 8.44028 8.10247C7.8961 9.6742 7.85535 11.3765 8.32368 12.9724C8.79201 14.5684 9.74614 15.9787 11.0533 17.0072C8.81343 17.9046 6.85905 19.393 5.39852 21.3137C3.93799 23.2345 3.02608 25.5156 2.76 27.9138C2.74074 28.0889 2.75615 28.2661 2.80536 28.4353C2.85457 28.6044 2.93662 28.7622 3.04681 28.8996C3.26935 29.1772 3.59304 29.3549 3.94666 29.3938C4.30028 29.4327 4.65488 29.3296 4.93243 29.107C5.20998 28.8845 5.38776 28.5608 5.42666 28.2072C5.71944 25.6008 6.96224 23.1936 8.91762 21.4456C10.873 19.6975 13.4039 18.7312 16.0267 18.7312C18.6495 18.7312 21.1803 19.6975 23.1357 21.4456C25.0911 23.1936 26.3339 25.6008 26.6267 28.2072C26.6629 28.5348 26.8192 28.8374 27.0655 29.0565C27.3117 29.2757 27.6304 29.3958 27.96 29.3938H28.1067C28.4562 29.3536 28.7756 29.1769 28.9954 28.9022C29.2152 28.6274 29.3175 28.277 29.28 27.9272C29.0127 25.5221 28.0958 23.2352 26.6278 21.3114C25.1598 19.3877 23.1959 17.8998 20.9467 17.0072ZM16 16.0605C14.9452 16.0605 13.914 15.7477 13.037 15.1617C12.1599 14.5756 11.4763 13.7427 11.0726 12.7682C10.669 11.7936 10.5634 10.7213 10.7691 9.68669C10.9749 8.65213 11.4829 7.70182 12.2288 6.95594C12.9746 6.21006 13.9249 5.70211 14.9595 5.49632C15.9941 5.29053 17.0664 5.39615 18.041 5.79982C19.0155 6.20349 19.8485 6.88707 20.4345 7.76413C21.0205 8.6412 21.3333 9.67234 21.3333 10.7272C21.3333 12.1417 20.7714 13.4982 19.7712 14.4984C18.771 15.4986 17.4145 16.0605 16 16.0605Z"
                          fill="currentColor"
                        />
                      </svg>

                      {/* <img src="/images/icons/profile.svg" alt="menu-icon" className="img-fluid" /> */}
                    </div>
                    <div className="menuTxt">
                      <span>Profile</span>
                    </div>
                  </div>
                </Link>
                <div className="activeBar"></div>
              </li>
              <li
                className={"nav-item d-block d-md-none " + (selectedNavIcon === "/createpost" ? " active" : "")}
                onClick={handleClickPost}
              >
                <Link
                  to="/createpost"
                  className={"nav-link" + (selectedNav === "/createpost" ? " active" : "")}
                >
                  {/* <Link onClick={() => setCreatePostPopup(true)} className="nav-link" href="javascript:void(0);"> */}
                  <div className="sideMenu">
                    <div className="menuIcon">
                      {/* <img src="/images/icons/silderbar-plus.svg" alt="menu-icon" className="img-fluid" /> */}
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9.3 7.5V7.7H9.5H15.5C15.7122 7.7 15.9157 7.78429 16.0657 7.93431C16.2157 8.08434 16.3 8.28783 16.3 8.5C16.3 8.71217 16.2157 8.91566 16.0657 9.06569C15.9157 9.21571 15.7122 9.3 15.5 9.3H9.5H9.3V9.5V15.5C9.3 15.7122 9.21571 15.9157 9.06569 16.0657C8.91566 16.2157 8.71217 16.3 8.5 16.3C8.28783 16.3 8.08434 16.2157 7.93431 16.0657C7.78429 15.9157 7.7 15.7122 7.7 15.5V9.5V9.3H7.5H1.5C1.28783 9.3 1.08434 9.21571 0.934315 9.06569C0.784286 8.91566 0.7 8.71217 0.7 8.5C0.7 8.28783 0.784286 8.08434 0.934315 7.93431C1.08434 7.78429 1.28783 7.7 1.5 7.7H7.5H7.7V7.5V1.5C7.7 1.28783 7.78429 1.08434 7.93431 0.934315C8.08434 0.784286 8.28783 0.7 8.5 0.7C8.71217 0.7 8.91566 0.784286 9.06569 0.934315C9.21571 1.08434 9.3 1.28783 9.3 1.5V7.5Z"
                          fill="currentColor"
                          stroke="#00808B"
                          strokeWidth="0.4"
                        />
                      </svg>
                    </div>
                    <div className="menuTxt">
                      <span>Post</span>
                    </div>
                  </div>
                </Link>
                <div className="activeBar"></div>
              </li>
              <li className={"nav-item d-none d-md-block " + (selectedNav === "/learning" ? " active" : "")}>
                <Link
                  className={"nav-link" + (selectedNav === "/learning" ? " active" : "")}
                  to="/learning"
                  id="learning"
                >
                  <div className="sideMenu">
                    <div className="menuIcon">
                      <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M28.2266 2.80717C27.2709 2.64255 26.3031 2.55781 25.3333 2.55384C22.0244 2.55113 18.7846 3.49994 16 5.28717C13.2081 3.5234 9.96882 2.59788 6.66662 2.62051C5.69681 2.62448 4.72902 2.70922 3.77328 2.87384C3.46023 2.92781 3.17672 3.09178 2.97383 3.33623C2.77094 3.58068 2.662 3.88953 2.66662 4.20717V20.2072C2.66376 20.4031 2.70412 20.5972 2.78482 20.7758C2.86552 20.9543 2.98457 21.1129 3.13351 21.2402C3.28246 21.3675 3.45763 21.4604 3.64656 21.5123C3.83549 21.5642 4.03354 21.5738 4.22662 21.5405C6.13731 21.2097 8.09489 21.2646 9.98404 21.7019C11.8732 22.1393 13.6557 22.9503 15.2266 24.0872L15.3866 24.1805H15.5333C15.6812 24.2421 15.8398 24.2738 16 24.2738C16.1601 24.2738 16.3187 24.2421 16.4666 24.1805H16.6133L16.7733 24.0872C18.3332 22.9249 20.1106 22.0876 22.0001 21.625C23.8897 21.1623 25.8528 21.0837 27.7733 21.3938C27.9664 21.4272 28.1644 21.4175 28.3533 21.3656C28.5423 21.3137 28.7174 21.2208 28.8664 21.0935C29.0153 20.9662 29.1344 20.8076 29.2151 20.6291C29.2958 20.4506 29.3361 20.2564 29.3333 20.0605V4.06051C29.3194 3.75671 29.2021 3.46679 29.0008 3.23882C28.7995 3.01086 28.5264 2.85855 28.2266 2.80717ZM14.6666 20.5272C12.1998 19.2294 9.45397 18.5521 6.66662 18.5538C6.22662 18.5538 5.78662 18.5538 5.33328 18.5538V5.22051C5.77736 5.19491 6.22254 5.19491 6.66662 5.22051C9.51113 5.21736 12.2936 6.05209 14.6666 7.62051V20.5272ZM26.6666 18.6072C26.2133 18.6072 25.7733 18.6072 25.3333 18.6072C22.5459 18.6055 19.8001 19.2828 17.3333 20.5805V7.62051C19.7063 6.05209 22.4888 5.21736 25.3333 5.22051C25.7774 5.19491 26.2225 5.19491 26.6666 5.22051V18.6072ZM28.2266 24.1405C27.2709 23.9759 26.3031 23.8911 25.3333 23.8872C22.0244 23.8845 18.7846 24.8333 16 26.6205C13.2153 24.8333 9.97546 23.8845 6.66662 23.8872C5.69681 23.8911 4.72902 23.9759 3.77328 24.1405C3.59972 24.168 3.43331 24.2296 3.28363 24.3217C3.13395 24.4138 3.00395 24.5346 2.90111 24.677C2.79826 24.8195 2.7246 24.981 2.68436 25.152C2.64411 25.3231 2.63808 25.5004 2.66662 25.6738C2.73437 26.0201 2.9366 26.3254 3.229 26.5228C3.5214 26.7202 3.88014 26.7937 4.22662 26.7272C6.13731 26.3964 8.09489 26.4512 9.98404 26.8886C11.8732 27.326 13.6557 28.137 15.2266 29.2738C15.4524 29.4346 15.7227 29.521 16 29.521C16.2772 29.521 16.5475 29.4346 16.7733 29.2738C18.3442 28.137 20.1267 27.326 22.0159 26.8886C23.905 26.4512 25.8626 26.3964 27.7733 26.7272C28.1198 26.7937 28.4785 26.7202 28.7709 26.5228C29.0633 26.3254 29.2655 26.0201 29.3333 25.6738C29.3618 25.5004 29.3558 25.3231 29.3155 25.152C29.2753 24.981 29.2016 24.8195 29.0988 24.677C28.9959 24.5346 28.8659 24.4138 28.7163 24.3217C28.5666 24.2296 28.4002 24.168 28.2266 24.1405Z"
                          fill="currentColor"
                        />
                      </svg>

                      {/* <img src="/images/icons/learning-material.svg" alt="menu-icon" className="img-fluid" /> */}
                    </div>
                    <div className="menuTxt">
                      <span>Learning</span>
                    </div>
                  </div>
                </Link>
                <div className="activeBar"></div>
              </li>
              <li
                className={"nav-item " + (selectedNavIcon === "/message" ? " active" : "")}
                onClick={handleClickMessage}
              >
                {/* <a className="nav-link" href="#" id="message"> */}
                <Link className={"nav-link" + (selectedNav === "/message" ? " active" : "")} to="/message" id="message">
                  <div className="sideMenu">
                    <div className="menuIcon">
                      <svg width="21" height="21" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M25.3332 5.39453H6.6665C5.60564 5.39453 4.58822 5.81596 3.83808 6.5661C3.08793 7.31625 2.6665 8.33367 2.6665 9.39453V22.7279C2.6665 23.7887 3.08793 24.8061 3.83808 25.5563C4.58822 26.3064 5.60564 26.7279 6.6665 26.7279H25.3332C26.394 26.7279 27.4115 26.3064 28.1616 25.5563C28.9117 24.8061 29.3332 23.7887 29.3332 22.7279V9.39453C29.3332 8.33367 28.9117 7.31625 28.1616 6.5661C27.4115 5.81596 26.394 5.39453 25.3332 5.39453ZM6.6665 8.0612H25.3332C25.6868 8.0612 26.0259 8.20167 26.276 8.45172C26.526 8.70177 26.6665 9.04091 26.6665 9.39453L15.9998 15.9012L5.33317 9.39453C5.33317 9.04091 5.47365 8.70177 5.7237 8.45172C5.97374 8.20167 6.31288 8.0612 6.6665 8.0612ZM26.6665 22.7279C26.6665 23.0815 26.526 23.4206 26.276 23.6707C26.0259 23.9207 25.6868 24.0612 25.3332 24.0612H6.6665C6.31288 24.0612 5.97374 23.9207 5.7237 23.6707C5.47365 23.4206 5.33317 23.0815 5.33317 22.7279V12.4345L15.3065 18.5279C15.5092 18.6449 15.7391 18.7065 15.9732 18.7065C16.2072 18.7065 16.4371 18.6449 16.6398 18.5279L26.6665 12.4345V22.7279Z"
                          fill="currentColor"
                        />
                      </svg>

                      {/* <img src="/images/icons/message.svg" alt="menu-icon" className="img-fluid" /> */}
                    </div>
                    <div className="menuTxt">
                      <span>Message</span>
                    </div>
                  </div>
                </Link>
                <div className="activeBar"></div>
              </li>
              {/* <li className={"nav-item " + (selectedNav == "/" ? " active" : "")}> */}
              <li className={"nav-item d-none d-md-block " + (selectedNav === "/setting" ? " active" : "")}>
                <Link className={"nav-link" + (selectedNav === "/setting" ? " active" : "")} to="/setting">
                  <div className="sideMenu">
                    <div className="menuIcon">
                      <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M24.5335 14.9405C24.3198 14.6972 24.2019 14.3844 24.2019 14.0605C24.2019 13.7366 24.3198 13.4238 24.5335 13.1805L26.2402 11.2605C26.4282 11.0507 26.545 10.7868 26.5738 10.5065C26.6025 10.2262 26.5417 9.94407 26.4002 9.70049L23.7335 5.08715C23.5934 4.84385 23.38 4.65099 23.1239 4.53607C22.8677 4.42115 22.5818 4.39003 22.3069 4.44715L19.8002 4.95382C19.4812 5.01973 19.1492 4.96661 18.8667 4.80449C18.5842 4.64237 18.3709 4.38247 18.2669 4.07382L17.4535 1.63382C17.3641 1.36899 17.1937 1.13898 16.9664 0.976278C16.7391 0.81358 16.4664 0.726434 16.1869 0.727155H10.8535C10.5628 0.711979 10.275 0.79239 10.0343 0.956107C9.79351 1.11982 9.61296 1.35785 9.52019 1.63382L8.77352 4.07382C8.66952 4.38247 8.45615 4.64237 8.17367 4.80449C7.89119 4.96661 7.55914 5.01973 7.24019 4.95382L4.66685 4.44715C4.40625 4.41033 4.14059 4.45145 3.90332 4.56534C3.66605 4.67923 3.46779 4.86079 3.33352 5.08715L0.666854 9.70049C0.521734 9.94135 0.456483 10.2219 0.480431 10.5021C0.504378 10.7823 0.616297 11.0477 0.800187 11.2605L2.49352 13.1805C2.70728 13.4238 2.82517 13.7366 2.82517 14.0605C2.82517 14.3844 2.70728 14.6972 2.49352 14.9405L0.800187 16.8605C0.616297 17.0732 0.504378 17.3387 0.480431 17.6189C0.456483 17.899 0.521734 18.1796 0.666854 18.4205L3.33352 23.0338C3.47365 23.2771 3.68701 23.47 3.94319 23.5849C4.19937 23.6998 4.48529 23.7309 4.76019 23.6738L7.26685 23.1672C7.58581 23.1012 7.91786 23.1544 8.20034 23.3165C8.48282 23.4786 8.69619 23.7385 8.80019 24.0472L9.61352 26.4872C9.70629 26.7631 9.88685 27.0012 10.1276 27.1649C10.3684 27.3286 10.6561 27.409 10.9469 27.3938H16.2802C16.5597 27.3945 16.8324 27.3074 17.0597 27.1447C17.287 26.982 17.4574 26.752 17.5469 26.4872L18.3602 24.0472C18.4642 23.7385 18.6776 23.4786 18.96 23.3165C19.2425 23.1544 19.5746 23.1012 19.8935 23.1672L22.4002 23.6738C22.6751 23.7309 22.961 23.6998 23.2172 23.5849C23.4734 23.47 23.6867 23.2771 23.8269 23.0338L26.4935 18.4205C26.6351 18.1769 26.6959 17.8947 26.6671 17.6145C26.6384 17.3342 26.5216 17.0703 26.3335 16.8605L24.5335 14.9405ZM22.5469 16.7272L23.6135 17.9272L21.9069 20.8872L20.3335 20.5672C19.3732 20.3709 18.3743 20.534 17.5263 21.0256C16.6783 21.5171 16.0404 22.3029 15.7335 23.2338L15.2269 24.7272H11.8135L11.3335 23.2072C11.0267 22.2763 10.3887 21.4905 9.54073 20.9989C8.69276 20.5073 7.69381 20.3442 6.73352 20.5405L5.16019 20.8605L3.42685 17.9138L4.49352 16.7138C5.14946 15.9805 5.5121 15.0311 5.5121 14.0472C5.5121 13.0632 5.14946 12.1139 4.49352 11.3805L3.42685 10.1805L5.13352 7.24715L6.70685 7.56715C7.66715 7.76345 8.66609 7.60033 9.51406 7.10875C10.362 6.61718 11 5.83137 11.3069 4.90049L11.8135 3.39382H15.2269L15.7335 4.91382C16.0404 5.8447 16.6783 6.63051 17.5263 7.12209C18.3743 7.61366 19.3732 7.77678 20.3335 7.58049L21.9069 7.26049L23.6135 10.2205L22.5469 11.4205C21.8983 12.1522 21.5401 13.0961 21.5401 14.0738C21.5401 15.0516 21.8983 15.9955 22.5469 16.7272ZM13.5202 8.72715C12.4654 8.72715 11.4342 9.03995 10.5571 9.62598C9.68008 10.212 8.9965 11.045 8.59283 12.0195C8.18916 12.994 8.08354 14.0664 8.28933 15.101C8.49512 16.1355 9.00307 17.0858 9.74895 17.8317C10.4948 18.5776 11.4451 19.0856 12.4797 19.2913C13.5143 19.4971 14.5866 19.3915 15.5612 18.9878C16.5357 18.5842 17.3687 17.9006 17.9547 17.0235C18.5407 16.1465 18.8535 15.1153 18.8535 14.0605C18.8535 12.646 18.2916 11.2894 17.2914 10.2893C16.2912 9.28906 14.9347 8.72715 13.5202 8.72715ZM13.5202 16.7272C12.9928 16.7272 12.4772 16.5708 12.0387 16.2777C11.6001 15.9847 11.2583 15.5682 11.0565 15.081C10.8547 14.5937 10.8019 14.0575 10.9048 13.5402C11.0077 13.023 11.2616 12.5478 11.6346 12.1749C12.0075 11.8019 12.4827 11.548 12.9999 11.4451C13.5172 11.3422 14.0534 11.395 14.5407 11.5968C15.0279 11.7986 15.4444 12.1404 15.7374 12.579C16.0305 13.0175 16.1869 13.5331 16.1869 14.0605C16.1869 14.7677 15.9059 15.446 15.4058 15.9461C14.9057 16.4462 14.2274 16.7272 13.5202 16.7272Z"
                          fill="currentColor"
                        />
                      </svg>

                      {/* <img src="/images/icons/setting.svg" alt="menu-icon" className="img-fluid" /> */}
                    </div>
                    <div className="menuTxt">
                      <span>Setting</span>
                    </div>
                  </div>
                </Link>
                <div className="activeBar"></div>
              </li>
              <li className={"nav-item d-block d-md-none " + (selectedNavIcon === "/more" ? " active" : "")}>
                <Link onClick={handelToggleMoreList} className="nav-link moreMenuToggle">
                  <div className="sideMenu">
                    <div className="menuIcon">
                      <svg width="20" height="5" viewBox="0 0 20 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="2.30769" cy="2.5" rx="2.30769" ry="2.5" fill="currentColor" />
                        <ellipse cx="10.0001" cy="2.5" rx="2.30769" ry="2.5" fill="currentColor" />
                        <ellipse cx="17.6925" cy="2.5" rx="2.30769" ry="2.5" fill="currentColor" />
                      </svg>
                      {/* <img src="/images/icons/dots-white.svg" alt="menu-icon" className="img-fluid" /> */}
                    </div>
                    <div className="menuTxt">
                      <span>More</span>
                    </div>
                  </div>
                </Link>
                <div className="activeBar"></div>
              </li>
            </ul>
          </div>
          <div className="themeLogOut themeLogOutCustom ">
            <a className="nav-link themeLogOutLink" onClick={handleLogout}>
              <div className="sideMenu">
                <div className="menuIcon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.7865 15.3939L11.7198 18.4472C11.5949 18.5711 11.4957 18.7186 11.428 18.8811C11.3603 19.0436 11.3254 19.2178 11.3254 19.3939C11.3254 19.5699 11.3603 19.7441 11.428 19.9066C11.4957 20.0691 11.5949 20.2166 11.7198 20.3405C11.8438 20.4655 11.9913 20.5647 12.1537 20.6324C12.3162 20.7001 12.4905 20.7349 12.6665 20.7349C12.8425 20.7349 13.0168 20.7001 13.1793 20.6324C13.3418 20.5647 13.4892 20.4655 13.6132 20.3405L18.9465 15.0072C19.0679 14.8804 19.163 14.7309 19.2265 14.5672C19.3599 14.2426 19.3599 13.8785 19.2265 13.5539C19.163 13.3902 19.0679 13.2407 18.9465 13.1139L13.6132 7.78052C13.4889 7.6562 13.3413 7.55758 13.1788 7.4903C13.0164 7.42302 12.8423 7.38839 12.6665 7.38839C12.4907 7.38839 12.3166 7.42302 12.1542 7.4903C11.9917 7.55758 11.8442 7.6562 11.7198 7.78052C11.5955 7.90484 11.4969 8.05242 11.4296 8.21485C11.3623 8.37728 11.3277 8.55137 11.3277 8.72718C11.3277 8.903 11.3623 9.07709 11.4296 9.23952C11.4969 9.40195 11.5955 9.54953 11.7198 9.67385L14.7865 12.7272H1.99984C1.64622 12.7272 1.30708 12.8677 1.05703 13.1177C0.80698 13.3678 0.666504 13.7069 0.666504 14.0605C0.666504 14.4141 0.80698 14.7533 1.05703 15.0033C1.30708 15.2534 1.64622 15.3939 1.99984 15.3939H14.7865ZM13.9998 0.727184C11.508 0.716059 9.06283 1.40347 6.94179 2.71144C4.82076 4.01941 3.10871 5.8956 1.99984 8.12718C1.84071 8.44544 1.81452 8.81388 1.92705 9.15145C2.03957 9.48901 2.28158 9.76805 2.59984 9.92718C2.9181 10.0863 3.28654 10.1125 3.6241 9.99998C3.96167 9.88745 4.24071 9.64544 4.39984 9.32718C5.24276 7.62495 6.52495 6.17868 8.1139 5.13783C9.70286 4.09699 11.5409 3.49934 13.4382 3.40664C15.3354 3.31394 17.223 3.72955 18.9059 4.61053C20.5887 5.49151 22.0058 6.80589 23.0107 8.41784C24.0155 10.0298 24.5717 11.8808 24.6217 13.7797C24.6717 15.6785 24.2138 17.5563 23.2952 19.2189C22.3766 20.8816 21.0307 22.2687 19.3966 23.2371C17.7624 24.2054 15.8993 24.7199 13.9998 24.7272C12.0117 24.7358 10.0614 24.1837 8.37276 23.1342C6.68414 22.0847 5.32564 20.5804 4.45317 18.7939C4.29404 18.4756 4.015 18.2336 3.67743 18.1211C3.33987 18.0085 2.97143 18.0347 2.65317 18.1939C2.33491 18.353 2.0929 18.632 1.98038 18.9696C1.86786 19.3072 1.89404 19.6756 2.05317 19.9939C3.11027 22.1212 4.71653 23.9275 6.7058 25.2259C8.69507 26.5243 10.9951 27.2677 13.368 27.3792C15.7409 27.4906 18.1005 26.9661 20.2027 25.8599C22.3049 24.7536 24.0734 23.1058 25.3253 21.0869C26.5771 19.0681 27.2669 16.7514 27.3232 14.3765C27.3795 12.0017 26.8003 9.65491 25.6455 7.57896C24.4907 5.50301 22.8023 3.77327 20.7549 2.56866C18.7074 1.36404 16.3754 0.728299 13.9998 0.727184Z"
                      fill="currentColor"
                    />
                  </svg>

                  {/* <img src="/images/icons/logout.svg" alt="menu-icon" className="img-fluid" /> */}
                </div>
                <div className="menuTxt">
                  <span>Logout</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </aside>

      <div
        onClick={handelToggleMoreList}
        className={"moreMenu d-block d-md-none Sidebar-more-zindex " + (toggleMoreList ? "active " : " ")}
      >
        <ul className="nav flex-column mobMoreMenuOuter-ul-custom">
          <li className="nav-item">
            <Link className="nav-link" to="/groupmessage">
              <div className="mobMoreMenuOuter d-flex align-items-center">
                <div className="mobMoreMenuIcon">
                  <img src="/images/icons/Groups-icon-svg.svg" alt="trending" className="img-fluid" />
                </div>
                <div className="mobMoreMenuTxt">
                  <p className="mb-0">Groups</p>
                </div>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={user?.role === "userFree" ? "/learning/locked" : "/globalmessage"}>
              <div className="mobMoreMenuOuter d-flex align-items-center">
                <div className="mobMoreMenuIcon">
                  <img src="/images/icons/global.svg" alt="trending" className="img-fluid" />
                </div>
                <div className="mobMoreMenuTxt">
                  <p className="mb-0">Global</p>
                </div>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/learning">
              <div className="mobMoreMenuOuter d-flex align-items-center">
                <div className="mobMoreMenuIcon">
                  <img src="/images/icons/learning.svg" alt="trending" className="img-fluid" />
                </div>
                <div className="mobMoreMenuTxt">
                  <p className="mb-0">Learning</p>
                </div>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile">
              <div className="mobMoreMenuOuter d-flex align-items-center">
                <div className="mobMoreMenuIcon">
                  <img src="/images/icons/my-profile.svg" alt="trending" className="img-fluid" />
                </div>
                <div className="mobMoreMenuTxt">
                  <p className="mb-0">My Profile</p>
                </div>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/setting/billing">
              <div className="mobMoreMenuOuter d-flex align-items-center">
                <div className="mobMoreMenuIcon">
                  <img src="/images/icons/upgrade-to-premium.svg" alt="trending" className="img-fluid" />
                </div>
                <div className="mobMoreMenuTxt">
                  <p className="mb-0 upgrade-Color-class-custom">Upgrade to premium</p>
                </div>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/setting" className="nav-link">
              <div className="mobMoreMenuOuter d-flex align-items-center">
                <div className="mobMoreMenuIcon">
                  <img src="/images/icons/setting-black.svg" alt="trending" className="img-fluid" />
                </div>
                <div className="mobMoreMenuTxt">
                  <p className="mb-0">Settings</p>
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
      {toggleMoreList && (
        <div className="modal-backdrop show modal-backdropCustom" onClick={handelToggleMoreList}></div>
      )}
      {showToolTip === 2 && (
        <Tooltip
          anchorId="discover"
          place="bottom"
          html={`
            <div> 
              <h4 class="tooltipHead">
              Discover
              </h4>
              <p class="tooltipContent">Discover peoples posts from all over the world</p>
              <div class="toolBottom">
                <div class="toolcounter">2/6</div>
                <div class="toolButton">
                  <button class="editComm_btn tooltipbtn" id="tooltipSkip">Skip</button>
                  <button class="btn btnColor tooltipbtn" id="tooltipNext2">Next</button>
                </div>
              </div>
            </div>
          `}
          arrow="arrow arrowLeft"
          style={{ marginLeft: "90px", marginTop: "-120px" }}
        />
      )}
      {showToolTip === 3 && (
        <Tooltip
          anchorId="profile"
          place="bottom"
          html={`
            <div> 
              <h4 class="tooltipHead">
                Your Profile
              </h4>
              <p class="tooltipContent">Access your profile to change display/banner pic. Also add a bio and see history of your posting</p>
              <div class="toolBottom">
                <div class="toolcounter">3/6</div>
                <div class="toolButton">
                  <button class="editComm_btn tooltipbtn" id="tooltipSkip">Skip</button>
                  <button class="btn btnColor tooltipbtn" id="tooltipNext3">Next</button>
                </div>
              </div>
            </div>
          `}
          arrow="arrow arrowLeft"
          style={{ marginLeft: "90px", marginTop: "-120px" }}
          className="tooltipBox-Custom"
        />
      )}
      {showToolTip === 4 && (
        <Tooltip
          anchorId="learning"
          place="bottom"
          html={`
            <div> 
              <h4 class="tooltipHead">
                Learn
              </h4>
              <p class="tooltipContent">Refine or learn new skills in our learning area designed to support you in your journey</p>
              <div class="toolBottom">
                <div class="toolcounter">4/6</div>
                <div class="toolButton">
                  <button class="editComm_btn tooltipbtn" id="tooltipSkip">Skip</button>
                  <button class="btn btnColor tooltipbtn" id="tooltipNext4">Next</button>
                </div>
              </div>
            </div>
          `}
          arrow="arrow arrowLeft"
          style={{ marginLeft: "90px", marginTop: "-120px" }}
          className="tooltipBox-Custom"
        />
      )}
      {showToolTip === 5 && (
        <Tooltip
          anchorId="message"
          place="bottom"
          html={`
            <div> 
              <h4 class="tooltipHead">
                Messages
              </h4>
              <p class="tooltipContent">Access your private messages to begin making new connections worldwide</p>
              <div class="toolBottom">
                <div class="toolcounter">5/6</div>
                <div class="toolButton">
                  <button class="editComm_btn tooltipbtn" id="tooltipSkip">Skip</button>
                  <button class="btn btnColor tooltipbtn" id="tooltipNext5">Next</button>
                </div>
              </div>
            </div>
          `}
          arrow="arrow arrowLeft"
          style={{ marginLeft: "90px", marginTop: "-120px" }}
          className="tooltipBox-Custom"
        />
      )}
    </>
  );
}
export default Sidebar;
