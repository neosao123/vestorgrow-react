import util from "../util/util";
import axios from "axios"
export default class PostService {
    async sendPost(data) {
        try {
            const token = localStorage.getItem("token")
                ? localStorage.getItem("token")
                : "no-token";
            const config = {
                headers: {
                    content: "multipart/form-data",
                    Authorization: "Bearer " + token,
                },
            };
            return axios
                .post(process.env.REACT_APP_API_BASEURL + "/post", data, config)
                .then(async (response) => {
                    return response
                });
        } catch (err) {
            throw err;
        }
    }

    async postList(data) {
        try {
            const category = Object.keys(data).reduce((object, key) => {
                if (data[key] !== "") {
                    object[key] = data[key];
                }
                return object;
            }, {});
            return await util.sendApiRequest("/post/list", "POST", true, category);
        } catch (err) {
            throw err;
        }
    }

    async myFeed(data) {
        try {
            const category = Object.keys(data).reduce((object, key) => {
                if (data[key] !== "") {
                    object[key] = data[key];
                }
                return object;
            }, {});
            return await util.sendApiRequest(`/post/my/feed`, "POST", true, category);
        } catch (err) {
            throw err;
        }
    }

    async getPost(id) {
        try {
            return await util.sendApiRequest("/post/" + id, "GET", true);
        } catch (err) {
            throw err;
        }
    }
    async getPostDetails(obj) {
        try {
            return await util.sendApiRequest("/post/singlepost", "POST", true, obj);
        } catch (err) {
            throw err;
        }
    }
    async deletePost(id) {
        try {
            return await util.sendApiRequest("/post/" + id, "DELETE", true);
        } catch (err) {
            throw err;
        }
    }
    async hidePost(id) {
        try {
            return await util.sendApiRequest("/userposthide", "POST", true, { postId: id });
        } catch (err) {
            throw err;
        }
    }
    async unhidePost(id) {
        try {
            return await util.sendApiRequest("/userposthide/" + id, "DELETE", true);
        } catch (err) {
            throw err;
        }
    }
    async likePost(data) {
        try {
            return await util.sendApiRequest("/postlike", "POST", true, data);
        } catch (err) {
            throw err;
        }
    }
    async dislikePost(id) {
        try {
            return await util.sendApiRequest("/postlike/" + id, "DELETE", true);
        } catch (err) {
            throw err;
        }
    }
    async likePostList(data) {
        try {
            const body = Object.keys(data).reduce((object, key) => {
                if (data[key] !== "") {
                    object[key] = data[key];
                }
                return object;
            }, {});
            return await util.sendApiRequest("/postlike/list", "Post", true, data);
        } catch (err) {
            throw err;
        }
    }
    async sharePost(postid) {
        let obj = {
            postId: postid
        }
        try {
            return await util.sendApiRequest("/post/share", "POST", true, obj);
        } catch (err) {
            throw err;
        }
    }
    async addSelectedUser(data) {
        try {
            return await util.sendApiRequest("/share", "POST", true, data);
        } catch (err) {
            throw err;
        }
    }
    async sharePostList(data) {
        try {
            const body = Object.keys(data).reduce((object, key) => {
                if (data[key] !== "") {
                    object[key] = data[key];
                }
                return object;
            }, {});
            return await util.sendApiRequest("/post/share/list", "Post", true, data);
        } catch (err) {
            throw err;
        }
    }
    async getPostUniqueReactions(data) {
        try {
            return await util.sendApiRequest("/postlike/posts/reactions", "Post", true, data);
        } catch (err) {
            throw err;
        }
    }
}