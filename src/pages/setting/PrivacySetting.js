import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "../../context/GlobalContext";
import UserService from "../../services/UserService";
const userServ = new UserService();
export default function PrivacySetting() {
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [sessionList, setSessionList] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    let resp = await userServ.getUser(user._id);
    if (resp.data) {
      setUser(resp.data);
      localStorage.setItem("user", JSON.stringify(resp.data));
    } else {
      console.log(resp.err);
    }
  };

  const handleSetting = async (type, value) => {
    let obj = user?.setting || { private: false, app_authentication: false, email_verification: false };
    obj[type] = value;
    try {
      let data = { _id: user._id, setting: obj };
      let resp = await userServ.editSetting(data);
      if (resp.result) {
        setUser(resp.result);
        localStorage.setItem("user", JSON.stringify(resp.result));
      } else {
        console.log(resp.err);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getSessionList();
  }, []);
  const getSessionList = async () => {
    try {
      let resp = await userServ.sessionlist({ filter: { searchId: user._id } });
      if (resp.data) {
        setSessionList(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="tab-pane active">
        <div className="settingPrivacy">
          <div className="socialContant py-4">
            <div className="settig_heading mt-0">
              <h5>Blocking</h5>
              <p>Edit your account settings and change your password</p>
            </div>
            <div className="sett_privacy commonSettgcard">
              <div className="otherUser">
                {/* <div className="followOtherUser">
                  <div className="followOtherUserPic">
                    <img src="/images/profile/black_image.png" alt="search" className="img-fluid" />
                  </div>
                  <div className="followOtherUserName">
                    <h5 className="mb-0">Account privacy</h5>
                    <p className="mb-0">
                      When your account is private, only people you approve can see your photos <br />
                      and Videos on VestorGrow. Your existing followers won’t be affected.
                    </p>
                  </div>
                </div>
                {user?.setting?.private ? (
                  <div className="disableBtn_div followBtndiv">
                    <a
                      href="javascript:void(0);"
                      onClick={() => handleSetting("private", false)}
                      className="btn disableBtn"
                    >
                      Disable
                    </a>
                  </div>
                ) : (
                  <div className="allViews followBtndiv">
                    <a href="javasript:void(0);" onClick={() => handleSetting("private", true)} className="btn btn-1">
                      Enable
                    </a>
                  </div>
                )} */}
                <div className="followOtherUser">
                  <div className="followOtherUserName followOtherUserName-custom">
                    <h5 className="mb-0">Account privacy</h5>
                    {user?.setting?.private ? (
                      <div className="disableBtn_div followBtndiv">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                            checked={true}
                            onChange={() => handleSetting("private", false)}
                          />
                          <label class="form-check-label" for="flexCheckDefault">
                            Private account
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="allViews followBtndiv">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckChecked"
                            checked={false}
                            onChange={() => handleSetting("private", true)}
                          />
                          <label class="form-check-label" for="flexCheckChecked">
                            Private account
                          </label>
                        </div>
                      </div>
                    )}
                    <p className="mb-0">
                      When your account is private, only people you approve can see your photos and Videos on
                      VestorGrow. Your existing followers won’t be affected.
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="otherUser">
                                <div className="followOtherUser">
                                    <div className="followOtherUserPic">
                                        <img src="/images/profile/black_image.png" alt="search" className="img-fluid" />
                                    </div>
                                    <div className="followOtherUserName">
                                        <h5 className="mb-0">eIgnored Users</h5>
                                        <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit .</p>
                                    </div>
                                </div>
                                <div className="userprof_btns followBtndiv">
                                    <a href="javascript:void(0)" className="editComm_btn d-inline-block"> Ignored users list</a>
                                </div>
                            </div> */}
            </div>
            <div className="settig_heading">
              <h5>2- factor authentication</h5>
              <p>Add an extra layer of protection to your account.</p>
            </div>
            <div className="sett_privacy commonSettgcard">
              {/* <div className="otherUser">
                                <div className="followOtherUser">
                                    <div className="followOtherUserPic">
                                        <img src="/images/profile/black_image.png" alt="search" className="img-fluid" />
                                    </div>
                                    <div className="followOtherUserName">
                                        <h5 className="mb-0">Authentiication App</h5>
                                        <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit .</p>
                                    </div>
                                </div>
                                {user?.setting?.app_authentication ?
                                    <div className="disableBtn_div followBtndiv">
                                        <a href="javascript:void(0);" onClick={() => handleSetting("app_authentication", false)} className="btn disableBtn">Disable</a>
                                    </div> :
                                    <div className="allViews followBtndiv">
                                        <a href="javasript:void(0);" onClick={() => handleSetting("app_authentication", true)} className="btn btn-1">Enable</a>
                                    </div>
                                }
                            </div> */}
              <div className="otherUser">
                <div className="followOtherUser">
                  <div className="followOtherUserPic">
                    <img src="/images/profile/black_image.png" alt="search" className="img-fluid" />
                  </div>
                  <div className="followOtherUserName">
                    <h5 className="mb-0">Email Verification</h5>
                    <p className="mb-0">Enabling email verification will prompt an email upon logging in. </p>
                  </div>
                </div>
                {user?.setting?.email_verification ? (
                  <div className="disableBtn_div followBtndiv">
                    <a
                      href="javascript:void(0);"
                      onClick={() => handleSetting("email_verification", false)}
                      className="btn disableBtn"
                    >
                      Disable
                    </a>
                  </div>
                ) : (
                  <div className="allViews followBtndiv">
                    <a
                      href="javasript:void(0);"
                      onClick={() => handleSetting("email_verification", true)}
                      className="btn btn-1"
                    >
                      Enable
                    </a>
                  </div>
                )}
              </div>
              {/* <div className="otherUser">
                                <div className="followOtherUser">
                                    <div className="followOtherUserPic">
                                        <img src="/images/profile/black_image.png" alt="search" className="img-fluid" />
                                    </div>
                                    <div className="followOtherUserName">
                                        <h5 className="mb-0">Backup Codes</h5>
                                        <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit .</p>
                                    </div>
                                </div>
                                <div className="allViews followBtndiv">
                                    <a href="javasript:void(0);" className="btn btn-1">Generate new codes</a>
                                </div>
                            </div> */}
            </div>
            <div className="settig_heading">
              <h5>Session History</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit .</p>
            </div>
            <div className="sett_privacy commonSettgcard">
              {sessionList.map((item, idx) => {
                return (
                  <div className="otherUser">
                    <div className="followOtherUser">
                      <div className="followOtherUserPic">
                        <img src="/images/profile/black_image.png" alt="search" className="img-fluid" />
                      </div>
                      <div className="followOtherUserName">
                        <h5 className="mb-0">{`${item.device}, ${item?.deviceType} ${item.os}`}</h5>
                        <p className="mb-0">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit .
                        </p>
                      </div>
                    </div>
                    <div className="followBtndiv">
                      {item.isLogin ? (
                        <a href="javasript:void(0);" className="btn active_now">
                          Active Now
                        </a>
                      ) : (
                        <a href="javasript:void(0);" className="btn logout">
                          Logout
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* <div className="otherUser">
                                <div className="followOtherUser">
                                    <div className="followOtherUserPic">
                                        <img src="/images/profile/black_image.png" alt="search" className="img-fluid" />
                                    </div>
                                    <div className="followOtherUserName">
                                        <h5 className="mb-0">Samsung SM</h5>
                                        <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit .</p>
                                    </div>
                                </div>
                                <div className="followBtndiv">
                                    <a href="javasript:void(0);" className="btn logout">Logout</a>
                                </div>
                            </div>
                            <div className="otherUser">
                                <div className="followOtherUser">
                                    <div className="followOtherUserPic">
                                        <img src="/images/profile/black_image.png" alt="search" className="img-fluid" />
                                    </div>
                                    <div className="followOtherUserName">
                                        <h5 className="mb-0">iPad,iOs 14</h5>
                                        <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit .</p>
                                    </div>
                                </div>
                                <div className="followBtndiv">
                                    <a href="javasript:void(0);" className="btn logout">Logout</a>
                                </div>
                            </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
