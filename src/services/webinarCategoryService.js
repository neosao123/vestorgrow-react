import util from "../util/util";
import axios from "axios"
export default class webinarCategoryService {
    async categoryList(data) {
        try {
            const category = Object.keys(data).reduce((object, key) => {
                if (data[key] !== "") {
                    object[key] = data[key];
                }
                return object;
            }, {});
            return await util.sendApiRequest("/webinar_category/list", "POST", true, category);
        } catch (err) {
            throw err;
        }
    }

    async getCategory(categoryId) {
        try {
            return await util.sendApiRequest("/webinar_category/" + categoryId, "GET", true);
        } catch (err) {
            throw err;
        }
    }
}