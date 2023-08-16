import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import SearchBar from "./SearchBar";
function DefaultLayoutWithoutLogin({ children }) {
  const location = useLocation();
  const [headerRequired, setHeaderRequired] = useState(false);
  useEffect(() => {
    if (location.pathname.includes("/post")) {
      setHeaderRequired(true);
    } else {
      setHeaderRequired(false);
    }
  }, [location.pathname]);

  return (
    <main className={"w-100 clearfix" + (headerRequired && " socialMediaTheme")}>
      <div className="themeContant p-0">
        {headerRequired && (
          <header className="w-100 clearfix topHeader" id="topHeader">
            <div className="topHeaderInner topHeaderInnerCustom d-flex align-items-center">
              <div class="mobileLogo webLogo d-block d-xl-block">
                <a href="/">
                  <img src="/images/logo-2.svg" alt="logo" class="img-fluid" />
                </a>
              </div>
              <div className="topHeaderLeftSec topHeaderLeftSecCustom d-md-block">
                {!location.pathname.includes("setting") && <SearchBar />}
              </div>
              <div className="topHeaderRightSec">
                <div className="topHeaderRightInner d-flex align-items-center">
                  <div className="toggleIcon headIcon d-block d-md-block postBtn">
                    <Link to={"/"} className="postBtn btnColor">
                      Login
                    </Link>
                    <Link to={"/signup"} className="linkBtn">
                      Signup
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}
        {children}
        {headerRequired && (
          <footer className="w-100 clearfix footer" id="topHeader">
            <div className="topHeaderInner bottomHeaderInnerCustom">
              <div class="mobileLogo webLogo d-flex align-items-center">
                <a href="javascript:void(0);">
                  <img src="/images/white-logo-2.svg" alt="logo" class="img-fluid" />
                </a>
                <div className="footerText">
                  <h4>Log intoVestorGrow</h4>
                  <p>Log in to see photos and videos from friends and discover other accounts you’ll love.</p>
                </div>
              </div>
              <div className="topHeaderRightSec">
                <div className="topHeaderRightInner d-flex align-items-center">
                  <div className="toggleIcon headIcon postBtn footerIcon">
                    <Link to={"/"} className="postBtn btnColor">
                      Login
                    </Link>
                    <Link to={"/signup"} className="linkBtn">
                      Signup
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}
export default DefaultLayoutWithoutLogin;
