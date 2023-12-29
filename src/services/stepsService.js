import util from "../util/util";
import axios from "axios"

export default class StepsService {
    async updateUserSuggestions(id) {
        try {
            return await util.sendApiRequest("/steps/user/" + id, "POST", true);
        }
        catch (err) {
            throw err
        }
    }

    async updateGroupSuggestions(id, obj) {
        try {
            return await util.sendApiRequest("/steps/group/" + id, "POST", true, obj);
        }
        catch (err) {
            throw err
        }
    }
}