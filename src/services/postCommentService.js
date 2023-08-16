import util from "../util/util";
import axios from "axios";
export default class PostCommentService {
  async sendComment(data) {
    try {
      return await util.sendApiRequest("/postcomment", "POST", true, data);
    } catch (err) {
      throw err;
    }
  }
  
  async commentList(data) {
    try {
      const category = Object.keys(data).reduce((object, key) => {
        if (data[key] !== "") {
          object[key] = data[key];
        }
        return object;
      }, {});
      return await util.sendApiRequest("/postcomment/list", "POST", true, category);
    } catch (err) {
      throw err;
    }
  }

  async getComment(id) {
    try {
      return await util.sendApiRequest("/postcomment/" + id, "GET", true);
    } catch (err) {
      throw err;
    }
  }
  
  async deleteComment(id) {
    try {
      return await util.sendApiRequest("/postcomment/" + id, "DELETE", true);
    } catch (err) {
      throw err;
    }
  }
  
  async likeComment(data) {
    try {
      return await util.sendApiRequest("/commentlike", "POST", true, data);
    } catch (err) {
      throw err;
    }
  }
  
  async dislikeComment(id) {
    try {
      return await util.sendApiRequest("/commentlike/" + id, "DELETE", true);
    } catch (err) {
      throw err;
    }
  }

  async sendCommentReply(data) {
    try {
      return await util.sendApiRequest("/commentreply", "POST", true, data);
    } catch (err) {
      throw err;
    }
  }

  async deleteCommentReply(id) {
    try {
      return await util.sendApiRequest("/commentreply/" + id, "DELETE", true);
    } catch (err) {
      throw err;
    }
  }
  
  async likeReply(data) {
    try {
      return await util.sendApiRequest("/replylike", "POST", true, data);
    } catch (err) {
      throw err;
    }
  }
  
  async dislikeReply(id) {
    try {
      return await util.sendApiRequest("/replylike/" + id, "DELETE", true);
    } catch (err) {
      throw err;
    }
  }
}
