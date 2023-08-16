import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import PaymentService from "../../services/paymentService";
import GlobalContext from "../../context/GlobalContext";
import UserService from "../../services/UserService";
import PaymentSuccess from "../../popups/payment/PaymentSuccess";
import PayemntFail from "../../popups/payment/PayemntFail";
import moment, { now } from "moment";

export default function BillingSetting() {
  const globalCtx = useContext(GlobalContext);
  const navigate = useNavigate();
  let [message, setMessage] = useState("");
  const [user, setUser] = globalCtx.user;
  let [success, setSuccess] = useState(false);
  let [paymentAccepted, setPaymentAccepted] = useState(false);
  let [paymentDenied, setPaymentDenied] = useState(false);
  let [showBillingHistory, setShowBillingHistory] = useState(false);
  let [sessionId, setSessionId] = useState("");
  const paymentServ = new PaymentService();
  const userServ = new UserService();

  const [paymentList, setPaymentList] = useState([]);
  const [lastPayment, setLastPayment] = useState(null);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setSuccess(true);
      setPaymentAccepted(true);
      setSessionId(query.get("session_id"));
    }

    if (query.get("canceled")) {
      setSuccess(false);
      setPaymentDenied(true);
      setSessionId(query.get("session_id"));
      setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
    }
    updateStatus();
    getPaymentList();
    getuserData();
    getLastPayment();
    getDaysLeft();
  }, [sessionId]);

  const getPaymentList = async () => {
    const resp = await paymentServ.listAllPayments({});
    if (resp) {
      setPaymentList(resp.data);
    }
  };
  const getLastPayment = async () => {
    const resp = await paymentServ.getLastPayment();
    if (resp) {
      setLastPayment(resp.data);
    }
  };

  const getuserData = async () => {
    let response = await userServ.getUser(user._id);
    if (response.data) {
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
  };

  const updateStatus = async () => {
    try {
      if (sessionId && success) {
        let obj = {
          status: "success",
          session_id: sessionId,
        };
        let resp = await paymentServ.statusPayment(obj);
      } else if (sessionId && !success) {
        let obj = {
          status: "cancelled",
          session_id: sessionId,
        };
        let resp = await paymentServ.statusPayment(obj);
      } else {
        console.log("Payment Not Initiated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const statusPopupCloseHandler = () => {
    setPaymentAccepted(false);
    setPaymentDenied(false);
    if (success) {
      navigate("/setting/billing");
    } else if (!success) {
      navigate("/setting/membership-plans");
    }
  };

  const getDaysLeft = () => {
    let curDate = moment(Date.now());
    let endDate = moment(user.subscription_details.to);
    setDaysLeft(endDate.diff(curDate, "days"));
  };

  const showBillingHistoryHandler = () => {
    setShowBillingHistory((showBillingHistory) => !showBillingHistory);
  };

  return (
    <>
      <div className="tab-pane active">
        <div className="setti_account_Bill">
          <div className="socialContant py-4">
            <div className="settig_heading mt-0">
              <h5>Account Billing</h5>
              <p>Edit your account settings and change your password</p>
            </div>
            <div className="otherUser commonSettgcard">
              <div className="followOtherUser">
                <div className="followOtherUserName">
                  <p className="mb-2">Current Plan</p>
                  {user?.role == "userFree" ? (
                    <h5 className="mb-2">Not a premium member</h5>
                  ) : user?.role == "userPaid" ? (
                    <h5 className="mb-2">Annual Pro+ ({daysLeft} days left)</h5>
                  ) : (
                    <h5 className="mb-2">You are admin</h5>
                  )}
                  {/* <h5 className="mb-2">Annual Pro+ ({daysLeft} days left)</h5> */}
                  {user?.role == "userPaid" && (
                    <p className="mb-0">
                      Next payment: £ {lastPayment?.amount} on{" "}
                      {moment(user?.subscription_details?.to).format("DD MMMM YYYY")}
                    </p>
                  )}
                </div>
              </div>
              <div className="billing_btn d-flex flex-wrap justify-content-end">
                <div className="followBtn">
                  {/* <a href="javascript:void(0);" className="btn followingBtn">
                    Change Plan
                  </a> */}
                  <Link
                    to="/setting/membership-plans"
                    className="btn followingBtn"
                    // className={`nav-link ${(page == undefined || page == "membership-plans") && "active"}`}
                  >
                    Change Plans
                  </Link>
                </div>
                {user?.role == "userFree" ? (
                  <div className="disableBtn_div followBtndiv">
                    <button className="btn disableBtn" disabled>
                      Cancel auto renewal
                    </button>
                  </div>
                ) : user?.role == "userpaid" && user?.subscription_details?.cancel_status == "noReqSent" ? (
                  <div className="disableBtn_div followBtndiv">
                    <button className="btn disableBtn">Cancel auto renewal</button>
                  </div>
                ) : (
                  <div className="disableBtn_div followBtndiv">
                    <button className="btn disableBtn" disabled>
                      Cancel auto renewal
                    </button>
                  </div>
                )}
                {/* <div className="disableBtn_div followBtndiv">
                  <button className="btn disableBtn" disabled>
                    Cancel auto renewal
                  </button>
                </div> */}
              </div>
            </div>
            <div className="settig_heading mb-3">
              <h5>Billing History</h5>
              <p>Review your billing history and manage your invoices</p>
            </div>
            <div className="userprof_btns">
              <a
                href="javascript:void(0);"
                className="btn-viewBillinHistory-custom"
                onClick={showBillingHistoryHandler}
              >
                {" "}
                View billing history
              </a>
            </div>
            {showBillingHistory && (
              <>
                {/* <div className="billing-item-search">
                  <p>Search by order number, plan name, and more</p>
                  <div className="position-relative-class" id="searchBar">
                    <img src="/images/icons/search.svg" alt="search-icon" className="img-fluid" />
                    <input
                      type="text"
                      // value={searchText}
                      className="form-control"
                      placeholder="Search by order number, plan name, and more"
                      // onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                </div> */}
                <div className="billingDetails-div">
                  <table className="billingDetails-table w-100">
                    <thead>
                      <tr>
                        <th title="date">DATE</th>

                        <th title="type">TYPE</th>

                        <th title="order_number">ORDER NUMBER</th>

                        <th title="plans">PLANS</th>

                        <th title="amount">AMOUNT</th>

                        <th title="action">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="billingDetails-table-body">
                      {paymentList
                        ? paymentList.map((item) => {
                            return (
                              <tr key={item._id}>
                                <td key="date">{moment(item.createdAt).format("DD MMMM YYYY")}</td>
                                <td key="type">Invoice</td>
                                <td key="order_number" className="orderNumber-custom-field">
                                  {item._id}
                                </td>
                                <td key="plans">
                                  <div className="billingDetails-table-body-plans">
                                    <img src="/images/icons/billing-plan-icon.svg" className="img-fluid img-logo" />
                                    Premium Plans
                                  </div>
                                </td>
                                <td key="amount">£ {item.amount}</td>
                                <td key="action">
                                  <div className="billingDetails-table-body-actions">
                                    <a href={item.invoice_pdf} alt="billing-download-icon" className="img-fluid">
                                      <img
                                        src="/images/icons/billing-download-icon.svg"
                                        className="img-fluid img-logo"
                                      />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        : ""}
                    </tbody>
                  </table>

                  <div className="users_table_footer d-flex ">{/* <Pagination size="sm">{items}</Pagination> */}</div>
                </div>
              </>
            )}
            {/* {success && <PaymentSuccess sessionId={sessionId} />} */}
            {paymentAccepted && <PaymentSuccess onClose={statusPopupCloseHandler} />}
            {paymentDenied && <PayemntFail onClose={statusPopupCloseHandler} />}
          </div>
        </div>
      </div>
    </>
  );
}
