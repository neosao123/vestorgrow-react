import util from "../util/util";
import axios from "axios"
export default class NewsService {
    async newsList(data) {
        try {
            const news = Object.keys(data).reduce((object, key) => {
                if (data[key] !== "") {
                    object[key] = data[key];
                }
                return object;
            }, {});
            return await util.sendApiRequest("/news/list", "POST", true, news);
        } catch (err) {
            throw err;
        }
    }

    async getNews(id) {
        try {
            return await util.sendApiRequest("/news/" + id, "GET", true);
        } catch (err) {
            throw err;
        }
    }
    async deleteNews(id) {
        try {
            return await util.sendApiRequest("/news/" + id, "DELETE", true);
        } catch (err) {
            throw err;
        }
    }
}