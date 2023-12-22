import util from "../util/util";
import axios from "axios";
export default class UserFollowerService {
  sendFollowReq(obj) {
    return util
      .sendApiRequest("/follow/req", "POST", true, obj)
      .then(
        (response) => {
          if (!response.error) {
            return response;
          } else {
            return response;
          }
        },
        (error) => {
          throw new Error(error);
        }
      )
      .catch((e) => {
        throw e;
      });
  }

  sendFollowtoReq(obj) {
    return util
      .sendApiRequest("/follow/reqtofollow", "POST", true, obj)
      .then(
        (response) => {
          if (!response.error) {
            return response;
          } else {
            return response;
          }
        },
        (error) => {
          throw new Error(error);
        }
      )
      .catch((e) => {
        throw e;
      });
  }

  acceptFollowReq(obj) {
    return util
      .sendApiRequest("/follow", "POST", true, obj)
      .then(
        (response) => {
          if (!response.error) {
            return response;
          } else {
            return response;
          }
        },
        (error) => {
          throw new Error(error);
        }
      )
      .catch((e) => {
        throw e;
      });
  }

  unfollowUser(dataId) {
    return util
      .sendApiRequest("/follow/" + dataId, "DELETE", true)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  rejectFollowReq(dataId) {
    return util
      .sendApiRequest("/follow/req/" + dataId, "DELETE", true)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  listUser(payload) {
    return util
      .sendApiRequest("/follow/list", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  listOtherUser(payload, dataId) {
    return util
      .sendApiRequest("/follow/list/" + dataId, "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  listFriends(payload) {
    return util
      .sendApiRequest("/follow/friends/list", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  listFollowReq(payload) {
    return util
      .sendApiRequest("/follow/req/list", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  listSentFollowReq(payload) {
    return util
      .sendApiRequest("/follow/sentreq/list", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  isFollowing(payload) {
    return util
      .sendApiRequest("/follow/isfollowing", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  deleteFollowReq(objData) {
    return util
      .sendApiRequest("/follow/req/list/delete", "POST", true, objData)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  removeNotification(objData) {
    return util
      .sendApiRequest("/follow/req/remove/request", "POST", true, { "id": objData })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }

  listFollowersFollowing(payload) {
    return util
      .sendApiRequest("/follow/users/list", "POST", true, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }


}
