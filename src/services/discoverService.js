import util from "../util/util";
import axios from "axios";
export default class DiscoverService {
  async postList(data, page) {
    try {
      const category = Object.keys(data).reduce((object, key) => {
        if (data[key] !== "") {
          object[key] = data[key];
        }
        return object;
      }, {});
      return await util.sendApiRequest(`/discover/list?page=${page}`, "POST", true, category);
    } catch (err) {
      throw err;
    }
  }

  async getPost(id) {
    try {
      return await util.sendApiRequest("/discover/" + id, "GET", true);
    } catch (err) {
      throw err;
    }
  }
  async getPopularTags(obj) {
    try {
      return await util.sendApiRequest("/discover/popular/keywords", "POST", true, obj);
    } catch (err) {
      throw err;
    }
  }
}
