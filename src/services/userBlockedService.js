import util from "../util/util";
import axios from "axios"
export default class UserService {
    sendBlockReq(obj) {
        return util
            .sendApiRequest("/blockuser", "POST", true, obj)
            .then(
                (response) => {
                    return response;
                },
                (error) => {
                    throw new Error(error);
                }
            )
            .catch((e) => {
                throw e;
            });
    }


    getUser(dataId) {
        return util
            .sendApiRequest("/blockuser/" + dataId, "GET", true)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                throw err;
            });
    }
    unblockUser(dataId) {
        return util
            .sendApiRequest("/blockuser/" + dataId, "DELETE", true)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                throw err;
            });
    }
    listUser(payload) {
        return util
            .sendApiRequest("/blockuser/list", "POST", true, payload)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                throw err;
            });
    }

}
