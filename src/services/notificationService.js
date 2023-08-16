import util from "../util/util";
import axios from "axios";
export default class NotificationService {
  async sendNotification(data) {
    try {
      return await util.sendApiRequest("/notification", "POST", true, data);
    } catch (err) {
      throw err;
    }
  }

  async notificationList(data) {
    try {
      const notification = Object.keys(data).reduce((object, key) => {
        if (data[key] !== "") {
          object[key] = data[key];
        }
        return object;
      }, {});
      return await util.sendApiRequest("/notification/list", "POST", true, notification);
    } catch (err) {
      throw err;
    }
  }

  async getNotification(id) {
    try {
      return await util.sendApiRequest("/notification/" + id, "GET", true);
    } catch (err) {
      throw err;
    }
  }
  async deleteNotification(id) {
    try {
      return await util.sendApiRequest("/notification/" + id, "DELETE", true);
    } catch (err) {
      throw err;
    }
  }
}
