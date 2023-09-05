import util from "../util/util";
import axios from "axios";
export default class ChatService {
  createChat(payload) {
    return util
      .sendApiRequest("/chat", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  async createGroupChat(payload) {
    try {
      const token = localStorage.getItem("token") ? localStorage.getItem("token") : "no-token";
      const config = {
        headers: {
          content: "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      };
      return axios.post(process.env.REACT_APP_API_BASEURL + "/chat", payload, config).then(async (response) => {
        return response.data;
      });
    } catch (err) {
      throw err;
    }
  }
  async editGroupChat(payload) {
    try {
      const token = localStorage.getItem("token") ? localStorage.getItem("token") : "no-token";
      const config = {
        headers: {
          content: "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      };
      return axios.put(process.env.REACT_APP_API_BASEURL + "/chat", payload, config).then(async (response) => {
        return response.data;
      });
    } catch (err) {
      throw err;
    }
  }
  listAllChat(data, start, length) {
    const activity = Object.keys(data).reduce((object, key) => {
      if (data[key] !== "") {
        object[key] = data[key];
      }
      return object;
    }, {});

    return util.sendApiRequest("/chat/list", "POST", true, activity).then(
      (response) => {
        return response;
      },
      (error) => {
        throw error;
      }
    );
  }
  listAllGroupSuggestion(data, start, length) {
    const activity = Object.keys(data).reduce((object, key) => {
      if (data[key] !== "") {
        object[key] = data[key];
      }
      return object;
    }, {});

    return util.sendApiRequest("/chat/searchgroup", "POST", true, activity).then(
      (response) => {
        return response;
      },
      (error) => {
        throw error;
      }
    );
  }
  listAllInvitation(data, start, length) {
    const activity = Object.keys(data).reduce((object, key) => {
      if (data[key] !== "") {
        object[key] = data[key];
      }
      return object;
    }, {});

    return util.sendApiRequest("/chat/listinvitation", "POST", true, activity).then(
      (response) => {
        return response;
      },
      (error) => {
        throw error;
      }
    );
  }
  getChat(dataId) {
    return util
      .sendApiRequest("/chat/" + dataId, "GET", true)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  getDetailMemberList(dataId) {
    return util
      .sendApiRequest("/chat/memberDetail/" + dataId, "GET", true)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  editChat(payload) {
    return util.sendApiRequest("/chat", "PUT", true, payload).then(
      (response) => {
        return response;
      },
      (error) => {
        throw error;
      }
    );
  }
  deleteChat(dataId) {
    return util.sendApiRequest("/chat/" + dataId, "DELETE", true).then(
      (response) => {
        return response;
      },
      (error) => {
        throw new Error(error);
      }
    );
  }
  async createMessage(payload) {
    try {
      const token = localStorage.getItem("token") ? localStorage.getItem("token") : "no-token";
      const config = {
        headers: {
          content: "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      };
      return axios.post(process.env.REACT_APP_API_BASEURL + "/message", payload, config).then(async (response) => {
        return response.data;
      });
    } catch (err) {
      throw err;
    }
  }
  listAllMessage(data, start, length) {
    const activity = Object.keys(data).reduce((object, key) => {
      if (data[key] !== "") {
        object[key] = data[key];
      }
      return object;
    }, {});

    return util.sendApiRequest("/message/list", "POST", true, activity).then(
      (response) => {
        return response;
      },
      (error) => {
        throw error;
      }
    );
  }
  getMessage(dataId) {
    return util
      .sendApiRequest("/message/" + dataId, "GET", true)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  editMessage(payload) {
    return util.sendApiRequest("/message", "PUT", true, payload).then(
      (response) => {
        return response;
      },
      (error) => {
        throw error;
      }
    );
  }
  deleteMessage(dataId) {
    return util.sendApiRequest("/message/" + dataId, "DELETE", true).then(
      (response) => {
        return response;
      },
      (error) => {
        throw new Error(error);
      }
    );
  }
  deleteMessageTemp(payload) {
    return util.sendApiRequest("/message/delete", "POST", true, payload).then(
      (response) => {
        return response;
      },
      (error) => {
        throw new Error(error);
      }
    );
  }
  deleteChatTemp(payload) {
    return util.sendApiRequest("/chat/delete", "POST", true, payload).then(
      (response) => {
        return response;
      },
      (error) => {
        throw new Error(error);
      }
    );
  }
  composeMsg(payload) {
    return util.sendApiRequest("/message/compose", "POST", true, payload).then(
      (response) => {
        return response;
      },
      (error) => {
        throw new Error(error);
      }
    );
  }
  async composeNewMsg(payload) {
    const token = localStorage.getItem("token") ? localStorage.getItem("token") : "no-token";
    const config = {
      headers: {
        content: "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const response = await axios.post(process.env.REACT_APP_API_BASEURL + "/message/compose/new", payload, config);
      if (response.err) {
        throw new Error(response.err);
      } else {
        return response.data;
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  joinGroup(payload) {
    return util
      .sendApiRequest("/chat/joingroup", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  deleteInvitation(payload) {
    return util
      .sendApiRequest("/chat/deleteinvitation", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  acceptInvitationLink(payload) {
    return util
      .sendApiRequest("/chat/acceptinvitationlink", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  leaveGroup(payload) {
    return util
      .sendApiRequest("/chat/leavegroup", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  removeFromGroup(payload) {
    return util
      .sendApiRequest("/chat/removefromgroup", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  sendInvitation(payload) {
    return util
      .sendApiRequest("/chat/sendinvitation", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  userInvitation(payload) {
    return util
      .sendApiRequest("/chat/userinvitation", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  makeAdmin(payload) {
    return util
      .sendApiRequest("/chat/makeadmin", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  getSuggestedGroups(payload) {
    return util.sendApiRequest("/chat/suggest/group", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  getTotalUnreadCount(payload) {
    return util.sendApiRequest("/chat/totalunreadcount", "POST", true, payload)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      })
  }

}
