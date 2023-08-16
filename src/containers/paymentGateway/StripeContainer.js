import React from "react";
import axios from "axios";
const StripeContainer = ({ userData, monthly }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(process.env.REACT_APP_API_BASEURL + "/payment/create-checkout-session", {
        monthly: monthly,
        name: userData.user_name,
        email: userData.email,
        userId: userData._id,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {/* {userData.role.includes("userPaid") && userData.subscription_details.isPaid ? (
        <button type="button" className="btn btn-primary btn-block" disabled>
          already subscribed
        </button>
      ) : userData.role.includes("userFree") ? (
        <button type="button" className="btn btn-primary btn-block" onClick={handleSubmit}>
          pay now
        </button>
      ) : userData.role.includes("userPaid") && userData.subscription_details.cancel_status == "reqSent" ? (
        <button type="button" className="btn btn-primary btn-block" disabled>
          cancel req sent
        </button>
      ) : (
        <button type="button" className="btn btn-primary btn-block" disabled>
          already subscribed
        </button>
      )} */}

      {userData.role.includes("userPaid") && userData.subscription_details.isPaid ? (
        <a href="javascript:void(0);" disabled>
          already subscribed
        </a>
      ) : userData.role.includes("userFree") ? (
        <a href="javascript:void(0);" onClick={handleSubmit}>
          pay now
        </a>
      ) : userData.role.includes("userPaid") && userData.subscription_details.cancel_status == "reqSent" ? (
        <a href="javascript:void(0);" disabled>
          cancel req sent
        </a>
      ) : (
        <a href="javascript:void(0);" disabled>
          already subscribed
        </a>
      )}
    </>
  );
};

export default StripeContainer;
