import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AccouctSetting from "./AccountSetting";
import BillingSetting from "./BillingSetting";
import NotificationSetting from "./NotificationSetting";
import BlockAccountSetting from "./BlockAccountSetting";
import PaymentSetting from "./PaymentSetting";
import PrivacySetting from "./PrivacySetting";
import DeleteAccount from "../../popups/deleteAccount/DeleteAccount";
import Support from "./Support";
import MembershipPlans from "./MembershipPlans";

export default function Setting() {
  const { page } = useParams();
  const [showDeleteConform, setShowDeleteConform] = useState(false);
  const handleShowDeletePopup = () => {
    setShowDeleteConform(!showDeleteConform);
  };
  return (
    <>
      {(page === "membership-plans") ? (
        <MembershipPlans />
      ) : (
        <div>
          <div className="settingSide_tab settingSide_tab_custom" >
            <ul className="nav d-block list-unstyled">
              <li className="nav-item">
                <Link
                  to="/setting/account"
                  className={`nav-link ${(page === undefined || page === "account") && "active"}`}
                >
                  Account
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/setting/billing" className={`nav-link ${page === "billing" && "active"}`}>
                  Account Billing
                </Link>
              </li>
              {/* <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#notificationSetting">Notification</a>
                        </li> */}
              <li className="nav-item">
                <Link to="/setting/block" className={`nav-link ${page === "block" && "active"}`}>
                  Blocking
                </Link>
              </li>
              {/* <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#paymentMethodsSetting">Payment Methods</a>
                        </li> */}
              <li className="nav-item">
                <Link to="/setting/privacy" className={`nav-link ${page === "privacy" && "active"}`}>
                  Privacy
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/setting/support" className={`nav-link ${page === "support" && "active"}`}>
                  Support
                </Link>
              </li>
              {/* <li className="nav-item">
                            <Link to="/setting/privacy" className={`nav-link ${page == "privacy" && "active"}`}>Support</Link>
                        </li> */}
              <li className="nav-item">
                <a className="nav-link delete_link" href="javascript:void(0);" onClick={handleShowDeletePopup}>
                  Delete Account
                </a>
              </li>
            </ul>
          </div>
          <div className="setting_page main_container d-flex" style={{marginTop:"20px"}}>
            <div className="setting_contant" style={{ height: (page === "billing" || page === "block") ? "800px" : "auto" }}>
              <div className="tab-content">
                {(page === undefined || page === "account") && <AccouctSetting />}
                {page === "billing" && <BillingSetting />}
                {page === "notification" && <NotificationSetting />}
                {page === "block" && <BlockAccountSetting />}
                {page === "payment" && <PaymentSetting />}
                {page === "privacy" && <PrivacySetting />}
                {page === "support" && <Support />}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConform && <DeleteAccount onClose={handleShowDeletePopup} />}
    </>
  );
}
