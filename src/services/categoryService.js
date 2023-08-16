import util from "../util/util";
import axios from "axios"
export default class CategoryService {
    async categoryList(data) {
        try {
            const category = Object.keys(data).reduce((object, key) => {
                if (data[key] !== "") {
                    object[key] = data[key];
                }
                return object;
            }, {});
            return await util.sendApiRequest("/category/list", "POST", true, category);
        } catch (err) {
            throw err;
        }
    }

    async getCategory(categoryId) {
        try {
            return await util.sendApiRequest("/category/" + categoryId, "GET", true);
        } catch (err) {
            throw err;
        }
    }
}