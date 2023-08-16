import util from "../util/util";
export default class PaymentService {
  async sendPaymentReq(data) {
    return util
      .sendApiRequest("/payment/create-checkout-session", "POST", true, data)
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
  async statusPayment(data) {
    return util
      .sendApiRequest("/payment/status-checkout-session", "POST", true, data)
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

  async listAllPayments(obj) {
    return util
      .sendApiRequest("/payment/list-all-payments", "POST", true, obj)
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

  async getLastPayment() {
    return util
      .sendApiRequest("/payment/get-last-payment", "POST", true)
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

  async cancelSubscription(data) {
    return util
      .sendApiRequest("/payment/cancel-subscription", "POST", true, data)
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

  async retrieveSubscription(data) {
    return util
      .sendApiRequest("/payment/retrieve-subscription", "POST", true, data)
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
}
