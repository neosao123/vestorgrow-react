import util from "../util/util";
import axios from "axios";
export default class UserService {
  signup(signupObj) {
    return util
      .sendApiRequest("/user", "POST", true, signupObj)
      .then(
        (response) => {
          if (!response.error) {
            return response;
          } else {
            return response;
          }
        },
        (error) => {
          throw new Error(error);
        }
      )
      .catch((e) => {
        throw e;
      });
  }
  async addProfile(signupObj) {
    const token = localStorage.getItem("token") ? localStorage.getItem("token") : "no-token";
    const config = {
      headers: {
        content: "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const response = await axios.post(process.env.REACT_APP_API_BASEURL + "/user/addprofile", signupObj, config);
      if (response.err) {
        throw new Error(response.err);
      } else {
        localStorage.setItem("user", JSON.stringify(response.data.result));
        localStorage.setItem("token", response.data.token);
        return response;
      }
    } catch (err) {
      throw err;
    }
  }

  login(loginObj) {
    let device_id = localStorage.getItem("device_id");
    loginObj.device_id = device_id;
    return util
      .sendApiRequest("/user/login", "POST", true, loginObj)
      .then(
        (response) => {
          if (!response.error) {
            if (response.token) {
              localStorage.setItem("user", JSON.stringify(response.data));
              localStorage.setItem("token", response.token);
            }
            return response;
          } else {
            return response;
          }
        },
        (error) => {
          throw new Error(error);
        }
      )
      .catch((e) => {
        throw e;
      });
  }
  otpLogin(loginObj) {
    let device_id = localStorage.getItem("device_id");
    loginObj.device_id = device_id;
    return util
      .sendApiRequest("/user/otplogin", "POST", true, loginObj)
      .then(
        (response) => {
          if (!response.error) {
            if (response.token) {
              localStorage.setItem("user", JSON.stringify(response.data));
              localStorage.setItem("token", response.token);
            }
            return response;
          } else {
            return response;
          }
        },
        (error) => {
          throw new Error(error);
        }
      )
      .catch((e) => {
        throw e;
      });
  }
  logout(loginObj) {
    let device_id = localStorage.getItem("device_id");
    let user = JSON.parse(localStorage.getItem("user"));
    loginObj.device_id = device_id;
    loginObj._id = user._id;
    return util
      .sendApiRequest("/user/logout", "POST", true, loginObj)
      .then(
        (response) => {
          if (!response.error) {
            return response;
          } else {
            return response;
          }
        },
        (error) => {
          throw new Error(error);
        }
      )
      .catch((e) => {
        throw e;
      });
  }

  getUser(dataId) {
    return util
      .sendApiRequest("/user/" + dataId, "GET", true)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  deleteUser(dataId) {
    return util
      .sendApiRequest("/user/" + dataId, "DELETE", true)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  listUser(payload) {
    return util
      .sendApiRequest("/user/list", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  sessionlist(payload) {
    return util
      .sendApiRequest("/user/sessionlist", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  signinActivationLink(email) {
    return util
      .sendApiRequest("/user/send/signin/activation", "POST", true, { email: email })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  updateAccountActivated(token) {
    return util
      .sendApiRequest("/user/account/activate", "POST", true, { token: token })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  signupActivationLink(email) {
    return util
      .sendApiRequest("/user/sendactivationlink", "POST", true, { email: email })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  sendOtp(obj) {
    return util
      .sendApiRequest("/user/forgot", "POST", true, obj)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  resetPassword(obj) {
    return util
      .sendApiRequest("/user/reset", "POST", true, obj)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  editSetting(obj) {
    return util
      .sendApiRequest("/user/setting", "POST", true, obj)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  editFirstView(obj) {
    return util
      .sendApiRequest("/user/firstview", "POST", true, obj)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  async editProfile(signupObj) {
    console.log("SIGNUPOBJ:", signupObj)
    alert()
    const token = localStorage.getItem("token") ? localStorage.getItem("token") : "no-token";
    const config = {
      headers: {
        content: "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const response = await axios.put(process.env.REACT_APP_API_BASEURL + "/user", signupObj, config);
      if (response.err) {
        throw new Error(response.err);
      } else {
        // localStorage.setItem("user", JSON.stringify(response.data.result));
        // localStorage.setItem("token", response.data.token);
        return response;
      }
    } catch (err) {
      throw err;
    }
  }
  getSearchData(payload) {
    return util
      .sendApiRequest("/user/getSearchData", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  getOnlineStatus(payload) {
    return util
      .sendApiRequest("/user/getonlinestatus", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  updateOnlineStatus(payload) {
    return util
      .sendApiRequest("/user/updateonlinestatus", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  getMentionUsers(payload) {
    return util
      .sendApiRequest("/user/mention", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  getMostFollowedUsers(payload) {
    return util
      .sendApiRequest("/user/most/followed/list", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  updateAbout(payload) {
    return util
      .sendApiRequest("/user/update/about", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      })
  }
  getSuggestedUsers(payload) {
    return util
      .sendApiRequest("/user/suggested/users", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  getUserDataPreview(payload) {
    return util
      .sendApiRequest("/user/preview/data", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
}
