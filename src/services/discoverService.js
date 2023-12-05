import util from "../util/util";
import axios from "axios";
export default class DiscoverService {
  async postList(data) {
    console.log("DATA1:", data)
    try {
      const category = Object.keys(data).reduce((object, key) => {
        if (data[key] !== "") {
          object[key] = data[key];
        }
        return object;
      }, {});
      console.log("CATEGORY1:", category)
      return await util.sendApiRequest("/discover/list", "POST", true, category);
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
  async getPopularTags() {
    try {
      return await util.sendApiRequest("/discover/popular/keywords", "GET");
    } catch (err) {
      throw err;
    }
  }
}
