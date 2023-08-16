import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import StripeContainer from "../../containers/paymentGateway/StripeContainer";
import PaymentService from "../../services/paymentService";
import UserService from "../../services/UserService";
import CancelSubscription from "../../popups/canceSubscription/CancelSubscription";
import RetrieveSubscription from "../../popups/canceSubscription/RetrieveSubscription";

const plans = [
  { title: "Premium Monthly Plan", price: 49.99, monthly: true },
  { title: "Premium Yearly Plan", price: 499.0, monthly: false },
];

const MembershipPlans = () => {
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [activePlan, setActivePlan] = useState({});
  const [showCancelSubscription, setShowCancelSubscription] = useState(false);
  const [showRetrieveSubscription, setShowRetrieveSubscription] = useState(false);
  const paymentServ = new PaymentService();
  const userServ = new UserService();
  const navigate = useNavigate();

  useEffect(() => {
    setActivePlan(plans[0]);
    getuserData();
  }, []);

  const handleSwitchMPlanBtn = (e) => {
    setActivePlan(plans[0]);
  };

  const handleSwitchYPlanBtn = (e) => {
    setActivePlan(plans[1]);
  };

  const getuserData = async () => {
    let response = await userServ.getUser(user._id);
    if (response.data) {
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
  };

  const handleCancelSubscription = async () => {
    let data = {
      user_id: user._id,
    };
    const resp = await paymentServ.cancelSubscription(data);
    if (resp) {
      getuserData();
      navigate("/setting/membership-plans");
      onClose();
    }
  };

  const handleRetrieveSubscription = async () => {
    let data = {
      user_id: user._id,
    };
    const resp = await paymentServ.retrieveSubscription(data);
    if (resp) {
      console.log(resp);
      getuserData();
      navigate("/setting/membership-plans");
      onClose();
    }
  };

  const onClose = () => {
    setShowCancelSubscription(false);
    setShowRetrieveSubscription(false);
  };

  console.log("user22", user);

  return (
    <>
      <main className="w-100 clearfix socialMediaTheme">
        <div className="main_container position-relative">
          <div className="sigUpSection pb-5 sigUpSection-plansCustom">
            <div className="signUphead text-center memberShip-plan-head">
              <h3>You journey begins today</h3>
              <div className="memberShip-planCustom-div">
                <p>Monthly | Annually (17% off)</p>
                <div className="memberShip-planCustom-link">
                  <a
                    href="javascript:void(0);"
                    className={
                      activePlan.monthly == true ? "memberShip-planCustom-btn active" : "memberShip-planCustom-btn"
                    }
                    onClick={handleSwitchMPlanBtn}
                  >
                    Monthly
                  </a>
                  <a
                    href="javascript:void(0);"
                    className={
                      activePlan.monthly == false ? "memberShip-planCustom-btn active" : "memberShip-planCustom-btn"
                    }
                    onClick={handleSwitchYPlanBtn}
                  >
                    Annually
                  </a>
                </div>
              </div>
            </div>
            <div className="row memberShipPlan-detailCustom">
              <div className="col-md-6 col-membPlan-widthCustom">
                <div className="h-100 membershipPlanBox">
                  <div className="membershipPlanBoxHead text-center membershipPlanBoxHead-Custom">
                    <h5 className="mb-0">VestorGrow Learning</h5>
                    <h4 className="mb-0">
                      £{activePlan.price}
                      <span>/{activePlan.monthly === true ? "month" : "anually"}</span>
                    </h4>
                    {/* <h6>Try our 14 day free trial or skip trial and pay now</h6> */}
                  </div>
                  <div className="horizLineMembership horizLineMembership-custom">
                    <hr />
                  </div>
                  <div className="membershipPlanBoxBody membershipPlanBoxBody-custom mb-3 pb-4">
                    <h4>Key benefits of VG Learning</h4>
                    <ul>
                      <li>Premium profile badge</li>
                      <li>Premium members chat</li>
                      <li>Global community</li>
                      <li>Video learning library</li>
                      <li>Live webinars</li>
                      <li>Featured live webinars</li>
                      <li>Learning Resources</li>
                      <li>On going Support</li>
                    </ul>
                  </div>
                  <div className="membershipPlanBoxFooter">
                    <div className="d-flex gap-3">
                      <button type="button" className="btn btn-primary btn-block">
                        Try 7 day free trial
                      </button>
                    </div>
                    <h5>
                      <p>Or skip trial and </p>
                      <StripeContainer userData={user} monthly={activePlan.monthly} />
                    </h5>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <Link to="/setting/billing" className="text-dark">Back</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showCancelSubscription && <CancelSubscription onClose={onClose} onSubmit={handleCancelSubscription} />}
      {showRetrieveSubscription && <RetrieveSubscription onClose={onClose} onSubmit={handleRetrieveSubscription} />}
    </>
  );
};

export default MembershipPlans;
