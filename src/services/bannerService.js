import util from "../util/util";
import axios from "axios"

export default class BannerService {
    listAll(data, start, length) {
        const activity = Object.keys(data).reduce((object, key) => {
            if (data[key] !== "") {
                object[key] = data[key];
            }
            return object;
        }, {});

        return util
            .sendApiRequest(
                "/banner/list",
                "POST",
                true,
                activity
            )
            .then(
                (response) => {
                    return response;
                },
                (error) => {
                    throw error;
                }
            );
    }
    getDetails(dataId) {
        return util
            .sendApiRequest("/banner/" + dataId, "GET", true)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                throw err;
            });
    }

}
