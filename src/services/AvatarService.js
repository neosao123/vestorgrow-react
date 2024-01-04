import util from "../util/util";

export default class AvatarService {
    getAllAvatar() {
        return util.sendApiRequest("/avatar/getall", "GET", true)
            .then((res) => {
                console.log("res:", res)
                return res
            })
            .then((err) => {
                console.log("error:", err)
                throw err;
            })
    }
}