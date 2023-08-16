import { useState } from "react";
import { Link } from "react-router-dom";

const LearningLocked = () => {
  const [showPlayBtn, setShowPlayBtn] = useState(true);
  return (
    <div className="socialContant main_container">
      <div className="learning_page_locked_image">
        {/* <img className="learning-page-locked-img" src="/images/img/learning-page-locked-img.jpg" /> */}

        <div className="learning_page_locked_image-video">
          <iframe
            src="https://player.vimeo.com/video/807333626?h=3ab55c993c&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
            className="learning-page-locked-video"
            // style="position:absolute;top:0;left:0;width:100%;height:100%;"
            title="VestorGrow Learning"
          ></iframe>
        </div>

        {/* <script src="https://player.vimeo.com/api/player.js"></script> */}
        {/* <img className="play-pause-learning-icon" src="/images/icons/play-pause-learning-icon.svg" /> */}
        {/* <video
          width="320"
          height="240"
          className="learning-page-locked-video"
          autoplay
          controls="controls"
          // poster="/images/img/learning-page-locked-img.jpg"
          onClick={() => setShowPlayBtn(!showPlayBtn)}
        >
          <source src="https://player.vimeo.com/video/807333626" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        {/* {showPlayBtn && (
          <img
            className="play-pause-learning-icon"
            src="/images/icons/play-pause-learning-icon.svg"
            onClick={(e) => e.preventDefault()}
          />
        )} */}
      </div>
      <div className="learning_page_locked_div">
        <div className="unlimited-lib-access_div">
          <div className="unlimited-lib-access-logo-div">
            <img src="/images/icons/unlimited-lib-logo.png" alt="" />
          </div>
          <div className="unlimited-lib-access-info-div">
            <h5>Unlimited and Interactive library access</h5>
            <p>
              Access video learning in a range of areas designed to improve your investment/trading skills as well as
              give you an understanding of mind management and personal development.
            </p>
          </div>
        </div>
        <div className="on-going-support-div">
          <div className="on-going-support-logo-div">
            <img src="/images/icons/ongoing-support-logo.png" alt="" />
          </div>
          <div className="on-going-support-info-div">
            <h5>On going Support</h5>
            <p>
              All members receive on going support at no extra cost, members can also have exclusive access to the ‘Live
              members chat’
            </p>
          </div>
        </div>
        <div className="weekly-live-seminars-div">
          <div className="weekly-live-seminars-logo-div">
            <img src="/images/icons/weekly-live-webinars-logo.png" alt="" />
          </div>
          <div className="weekly-live-seminars-info-div">
            <h5>Weekly Live webinars</h5>
            <p>Four weekly webinars for investing, analysis, mind management and personal development</p>
          </div>
        </div>
        <div className="online-learning-res-div">
          <div className="online-learning-res-logo-div">
            <img src="/images/icons/learning-resources-logo.png" alt="" />
          </div>
          <div className="online-learning-res-info-div">
            <h5>Online Learning Resources</h5>
            <p>We are constantly updating the learning area with reading material and resources.</p>
          </div>
        </div>
      </div>
      <div className="learning_page_locked_btn_div">
        <Link className="btn btnColor learning_page_locked_btn" to="/setting/membership-plans">
          {/* <button type="link" href="javascript:void(0);" className="btn btnColor learning_page_locked_btn"> */}
          Start free trial
          {/* </button> */}
        </Link>
      </div>
    </div>
  );
};

export default LearningLocked;
