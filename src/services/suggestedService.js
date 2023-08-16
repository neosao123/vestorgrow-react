import util from "../util/util";
export default class SuggestedService {
  async suggestListHome() {
    try {
      return await util.sendApiRequest("/user/suggested/users", "POST", true);
    } catch (err) {
      throw err;
    }
  }

  async suggestListTab(data) {
    try {
      const tab = Object.keys(data).reduce((object, key) => {
        if (data[key] !== "") {
          object[key] = data[key];
        }
        return object;
      }, {});
      return await util.sendApiRequest(
        "/user/suggestions/tabs",
        "POST",
        true,
        tab
      );
    } catch (err) {
      throw err;
    }
  }
}
