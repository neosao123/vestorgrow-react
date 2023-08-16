import util from "../util/util";
import axios from "axios";
export default class GlobalMessageService {
  async createMessage(payload) {
    try {
      const token = localStorage.getItem("token") ? localStorage.getItem("token") : "no-token";
      const config = {
        headers: {
          content: "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      };
      return axios
        .post(process.env.REACT_APP_API_BASEURL + "/globalmessage", payload, config)
        .then(async (response) => {
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

    return util.sendApiRequest("/globalmessage/list", "POST", true, activity).then(
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
      .sendApiRequest("/globalmessage/" + dataId, "GET", true)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
  editMessage(payload) {
    return util.sendApiRequest("/globalmessage", "PUT", true, payload).then(
      (response) => {
        return response;
      },
      (error) => {
        throw error;
      }
    );
  }
  markAsRead(payload) {
    return util.sendApiRequest("/globalmessage/markasread", "POST", true, payload).then(
      (response) => {
        return response;
      },
      (error) => {
        throw error;
      }
    );
  }
  deleteMessage(dataId) {
    return util.sendApiRequest("/globalmessage/" + dataId, "DELETE", true).then(
      (response) => {
        return response;
      },
      (error) => {
        throw new Error(error);
      }
    );
  }
  deleteMessageTemp(payload) {
    return util.sendApiRequest("/globalmessage/delete", "POST", true, payload).then(
      (response) => {
        return response;
      },
      (error) => {
        throw new Error(error);
      }
    );
  }
}
