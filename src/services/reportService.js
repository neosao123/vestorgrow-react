import util from "../util/util";
import axios from "axios"
export default class ReportService {
    async reportPost(data) {
        try {
            return await util.sendApiRequest("/report", "POST", true, data);
        } catch (err) {
            throw err;
        }
    }
}