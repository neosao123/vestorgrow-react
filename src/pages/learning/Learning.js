import { useState, useContext, useEffect } from "react";
import LearningService from "../../services/learningService";
import BannerService from "../../services/bannerService";
import GlobalContext from "../../context/GlobalContext";
import OwlCarousel from "react-owl-carousel";
import moment from "moment";
import { useNavigate, Link } from "react-router-dom";
import VideoPlayer from "../../shared/VideoPlayer";
const serv = new LearningService();
const bannerServ = new BannerService();
function Learning() {
  const navigate = useNavigate();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [courseList, setCourseList] = useState([]);
  const [webinarList, setWebinarList] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [learningMaterialList, setLearningMaterialList] = useState([]);
  const [showCourse, setShowCourse] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [msgPopup, setMsgPopup] = useState(null);

  useEffect(() => {
    getCourseList();
    getLearningMaterialList();
    getWebinarList();
    getBannerList();
  }, []);
  useEffect(() => {
    setShowCourse(!showCourse);
  }, [courseList, webinarList, learningMaterialList]);
  const getCourseList = async () => {
    try {
      let obj = {
        filter: {
          is_active: 1,
        },
      };
      let resp = await serv.courseList(obj);
      if (resp.data) {
        setCourseList([...resp.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getBannerList = async () => {
    try {
      let obj = {
        filter: {
          is_active: 1,
          location: "Learning",
        },
      };
      let resp = await bannerServ.listAll(obj);
      if (resp.data) {
        setBannerList([...resp.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getLearningMaterialList = async () => {
    try {
      let obj = {
        filter: {
          is_active: 1,
        },
      };
      let resp = await serv.learningMaterialList(obj);
      if (resp.data) {
        setLearningMaterialList([...resp.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getWebinarList = async () => {
    try {
      let obj = {
        filter: {
          is_active: 1,
        },
      };
      let resp = await serv.webinarList(obj);
      if (resp.data) {
        setWebinarList([...resp.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleCourseClick = (courseId) => {
    if (user.role.includes("userPaid") || user.role.includes("admin")) {
      navigate("/learning/lesson/" + courseId);
    } else {
      navigate("/learning/locked");
    }
  };
  const handleWebinarClick = (webItem) => {
    let date = new Date();
    let start = moment(webItem.start_date).diff(moment(date));
    let end = moment(webItem.end_date).diff(moment(date));
    if (start >= 0) {
      setMsgPopup("This webinar didn't started yet");
    } else if (start < 0 && end >= 0) {
      window.open(webItem.webinar_link, "_blank");
    } else {
      if (webItem.video && webItem.video !== "") {
        setVideoUrl(webItem.video);
      } else {
        setMsgPopup("We will update video very soon..");
      }
    }
  };
  return (
    <>
      <div className="socialContant main_container">
        {/*learning Slider Start (THIS SILDER SLIDE WITH CONTANT AND BACKGROUND IMAGE)*/}
        <div className="learningSlider learningImgContantSlider" id="learningSlider">
          <div id="demo" className="carousel slide" data-bs-ride="carousel">
            {/* Indicators/dots */}
            <div className="carousel-indicators">
              {/* <button type="button" data-bs-target="#demo" data-bs-slide-to={0} className="active" />
                            <button type="button" data-bs-target="#demo" data-bs-slide-to={1} />
                            <button type="button" data-bs-target="#demo" data-bs-slide-to={2} /> */}
              {bannerList.map((item, idx) => (
                <button
                  type="button"
                  data-bs-target="#demo"
                  data-bs-slide-to={idx}
                  className={idx == 0 ? `active` : ""}
                />
              ))}
            </div>
            {/* The slideshow/carousel */}
            <div className="carousel-inner">
              {/* <div className="carousel-item active" style={{ backgroundImage: 'url("/images/img/la.jpg")' }}>
                                <div className="carouselSliderCaption">
                                    <div className="carouselContant">
                                        <div className="topHeading text-white">
                                            <h6>Featured</h6>
                                        </div>
                                        <div className="sliderContant text-white">
                                            <h3>This is a video title</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum posuere faucibus venenatis </p>
                                            <a href="javascript:void(0);" className="watchNow watchNowCustom btn text-white">Watch Now <img src="/images/icons/right-arrow-white.svg" alt className="img-fluid ms-3" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item" style={{ backgroundImage: 'url("/images/img/chicago.jpg")' }}>
                                <div className="carouselSliderCaption">
                                    <div className="carouselContant">
                                        <div className="topHeading text-white">
                                            <h6>Featured</h6>
                                        </div>
                                        <div className="sliderContant text-white">
                                            <h3>This is a video title</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum posuere faucibus venenatis </p>
                                            <a href="javascript:void(0);" className="watchNow watchNowCustom btn text-white">Watch Now <img src="/images/icons/right-arrow-white.svg" alt className="img-fluid ms-3" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item" style={{ backgroundImage: 'url("/images/img/ny.jpg")' }}>
                                <div className="carouselSliderCaption">
                                    <div className="carouselContant">
                                        <div className="topHeading text-white">
                                            <h6>Featured</h6>
                                        </div>
                                        <div className="sliderContant text-white">
                                            <h3>This is a video title</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum posuere faucibus venenatis </p>
                                            <a href="javascript:void(0);" className="watchNow watchNowCustom btn text-white">Watch Now <img src="/images/icons/right-arrow-white.svg" alt className="img-fluid ms-3" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
              {bannerList &&
                bannerList.map((item, idx) => (
                  <div
                    className={`carousel-item ${idx == 0 && "active"}`}
                    style={{ backgroundImage: `url("${item.banner_image}")` }}
                  >
                    <div className="carouselSliderCaption">
                      <div className="carouselContant carouselContantCustom">
                        <div className="topHeading text-white">
                          <h6>Featured</h6>
                        </div>
                        <div className="sliderContant text-white">
                          <h3>{item.title}</h3>
                          <p>{item.subTitle.replace(/<\/?[^>]+(>|$)/g, "")}</p>
                          <a href={item.link} target="_blank" className="watchNow watchNowCustom btn text-white">
                            {item.linkName}{" "}
                            <img src="/images/icons/right-arrow-white.svg" alt className="img-fluid ms-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*learning Slider End (THIS SILDER SLIDE WITH CONTANT AND BACKGROUND IMAGE)*/}
        {/*Slider 1 Start*/}
        <div className="lessonSec" id="lessonSec">
          <div className="lessonSecInner">
            <div className="lessonSecHead d-flex align-items-center justify-content-between">
              <div className="leassonHeading">
                <h4>All Courses</h4>
              </div>
              <div className="allViews">
                <Link to="/learning/course/viewall" className="btn btn-1">
                  View all
                </Link>
                {/* <a href="#" className="btn btn-1" onClick={() => navigate("/viewall")}>View all</a> */}
              </div>
            </div>
            <div className="lessonSlider" id="lessonSlider">
              {courseList && (
                <OwlCarousel
                  className="owl-carousel owl-carousel-custom owl-theme lessonOwlCarousel"
                  loop={false}
                  responsiveClass={true}
                  dots={false}
                  nav={true}
                  slideBy={4}
                  navText={[
                    "<div class='carousel-right-btn-custom'><i class='fa-solid fa-angle-left'></i></div>",
                    "<div class='carousel-right-btn-custom'><i class='fa-solid fa-angle-right'></i></div>",
                  ]}
                  responsive={{
                    0: {
                      items: 1,
                    },
                    576: {
                      items: 2,
                    },
                    768: {
                      items: 4,
                    },
                    1000: {
                      items: 4,
                    }
                  }}
                >
                  {courseList.map((item) => {
                    return (
                      <div className="item lessonSlideItemCustom" style={{ margin: "0 5px" }} onClick={() => handleCourseClick(item._id)}>
                        <a href="javascript:void(0);">
                          <div className="lessonSlide lessonSlideCustom">
                            <div className="lessonSlideImg">
                              <img
                                src={item.banner_image}
                                alt="lesson-banner-img"
                                className="img-fluid bannerImageContent"
                              />
                            </div>
                            <div className="lessonSlideContant">
                              <div className="lessonSlideTxt">
                                <h4 className="mb-0">{item.course_name}</h4>
                              </div>
                              <div className="lessonCreated d-flex align-items-center justify-content-between">
                                <div className="lessonCreatedDate">
                                  <p className="mb-0">{moment(item.createdAt).format("MMMM DD, YYYY")}</p>
                                </div>
                                {/* <div className="lessonMidLevel">
                                                                    <p className="mb-0">{item.level} level <img src="/images/icons/level.svg" alt="mid-level" className="img-fluid ms-2" /></p>
                                                                </div> */}
                              </div>
                              <div className="lessonPara">
                                <p className="mb-0">{item.course_desc.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 110)}</p>
                              </div>
                            </div>
                            <div className="lessonSlideBtn lessonSlideBtnCustom">
                              <div className="lessonSlideBtnInner d-flex align-items-center justify-content-between">
                                <div className="lessonWatchBtn">
                                  <p onClick={() => handleCourseClick(item._id)}>
                                    Watch Now{" "}
                                    <img
                                      src="/images/icons/arrow_forward.svg"
                                      alt="watch-now"
                                      className="img-fluid ms-2"
                                    />
                                  </p>
                                </div>
                                <div className="lessonTime">
                                  <p className="mb-0">
                                    {item.watch_time}{" "}
                                    <img src="/images/icons/watch.svg" alt="watch-now" className="img-fluid ms-2" />
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </OwlCarousel>
              )}
              {/* </div> */}
            </div>
          </div>
        </div>
        {/*Slider 1 End*/}
        {/*Slider 2 Start*/}
        <div className="lessonSec mt-5 lessonSec-customMargin" id="WebinarsSec">
          <div className="lessonSecInner">
            <div className="lessonSecHead d-flex align-items-center justify-content-between">
              <div className="leassonHeading">
                <h4>Webinars</h4>
              </div>
              <div className="allViews">
                <Link to="/learning/webinar/viewall" className="btn btn-1">
                  View all
                </Link>
              </div>
            </div>
            <div className="lessonSlider" id="lessonWebinarsSlider">
              {/* <div className="owl-carousel owl-theme lessonOwlCarousel"> */}
              {webinarList && (
                <OwlCarousel
                  className="owl-carousel owl-carousel-custom owl-theme lessonOwlCarousel"
                  loop={false}
                  responsiveClass={true}
                  dots={false}
                  nav={true}
                  slideBy={4}
                  navText={[
                    "<div class='carousel-right-btn-custom'><i class='fa-solid fa-angle-left'></i></div>",
                    "<div class='carousel-right-btn-custom'><i class='fa-solid fa-angle-right'></i></div",
                  ]}
                  responsive={{
                    0: {
                      items: 1,
                    },
                    576: {
                      items: 2,
                    },
                    768: {
                      items: 4,
                    },
                    1000: {
                      items: 4,
                    },
                  }}
                >
                  {webinarList &&
                    webinarList.map((item) => (
                      <div className="item lessonSlideItemCustom" style={{ margin: "0 5px" }} onClick={() => handleWebinarClick(item)}>
                        <a href="javascript:void(0);">
                          <div className="lessonSlide lessonSlideCustom">
                            <div className="lessonSlideImg">
                              <img
                                src={item.banner_image}
                                alt="lesson-banner-img"
                                className="img-fluid bannerImageContent"
                              />
                            </div>
                            <div className="lessonSlideContant">
                              <div className="lessonSlideTxt">
                                <h4 className="mb-0">{item.title}</h4>
                              </div>
                              <div className="lessonCreated d-flex align-items-center justify-content-between">
                                <div className="lessonCreatedDate">
                                  <p className="mb-0">Start: {moment(item.start_date).format("DD MMM YY hh:mm")}</p>
                                </div>
                                <div className="lessonMidLevel">
                                  <p className="mb-0">End: {moment(item.end_date).format("DD MMM YY hh:mm")}</p>
                                </div>
                              </div>
                              <div className="lessonPara">
                                <p className="mb-0">{item.desc.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 110)}</p>
                              </div>
                            </div>
                            <div className="lessonSlideBtn lessonSlideBtnCustom">
                              <div className="lessonSlideBtnInner d-flex align-items-center justify-content-between">
                                <div className="lessonWatchBtn">
                                  <p onClick={() => handleWebinarClick(item)}>
                                    Watch Now
                                    <img
                                      src="/images/icons/arrow_forward.svg"
                                      alt="watch-now"
                                      className="img-fluid ms-2"
                                    />
                                  </p>
                                </div>
                                {/* <div className="lessonTime">
                                                    <p className="mb-0">20h 10m <img src="/images/icons/watch.svg" alt="watch-now" className="img-fluid ms-2" /></p>
                                                </div> */}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                </OwlCarousel>
              )}
            </div>
          </div>
        </div>
        {/*Slider 2 End*/}
        {/*Slider 3 Start*/}
        <div className="lessonSec mt-5 lessonSec-customMargin" id="learningMaterialSec">
          <div className="lessonSecInner">
            <div className="lessonSecHead d-flex align-items-center justify-content-between">
              <div className="leassonHeading">
                <h4>Learning material</h4>
              </div>
              <div className="allViews">
                <Link to="/learning/material/viewall" className="btn btn-1">
                  View all
                </Link>
              </div>
            </div>
            <div className="lessonSlider" id="learningMaterialCarousel">
              {/* <div className="owl-carousel owl-theme learningMaterialSlider"> */}
              {learningMaterialList && (
                <OwlCarousel
                  className="owl-carousel owl-carousel-custom owl-theme learningMaterialSlider"
                  loop={false}
                  margin={20}
                  responsiveClass={true}
                  dots={false}
                  nav={true}
                  slideBy={3}
                  navText={[
                    "<div class='carousel-right-btn-custom'><i class='fa-solid fa-angle-left'></i></div>",
                    "<div class='carousel-right-btn-custom'><i class='fa-solid fa-angle-right'></i></div",
                  ]}
                  responsive={{
                    0: {
                      items: 1,
                    },
                    576: {
                      items: 2,
                    },
                    768: {
                      items: 3,
                    },
                    1000: {
                      items: 3,
                    },
                  }}
                >
                  {learningMaterialList.map((item) => (
                    <div className="item">
                      <Link to={`/learning/material/${item._id}`}>
                        <div className="learningMaterialCarousel d-flex align-items-center">
                          <div className="learningMaterialCarouselImg">
                            <img src={item.banner_image} alt="learning-material" className="img-fluid" />
                          </div>
                          <div className="learningMaterialCarouselTxt">
                            <div className="learningMaterialTxt">
                              <h5>{item.title}</h5>
                              <p className="mb-0">
                                {item.desc
                                  .replace(/<\/?[^>]+(>|$)/g, "")
                                  .replace(/\s+/g, " ")
                                  .slice(0, 60)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </OwlCarousel>
              )}
              {/* </div> */}
            </div>
          </div>
        </div>
        {/*Slider 3 End*/}
      </div>
      {videoUrl && <VideoPlayer videoUrl={videoUrl} setVideoUrl={setVideoUrl} />}
      {msgPopup && msgPopup !== "" && (
        <div class="modal" style={{ display: "block" }}>
          <div class="vertical-alignment-helper">
            <div class="vertical-align-center">
              <div class="thanksReportingModal modal-dialog modal-sm">
                <div class="modal-content">
                  <div class="modal-header border-bottom-0 pb-0">
                    <button
                      type="button"
                      onClick={() => setMsgPopup(null)}
                      class="btn-close"
                      data-bs-dismiss="modal"
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="postShared text-center">
                      <h6>{msgPopup}</h6>
                      <div className="reportingBtn">
                        <a href="javascript:void(0);" onClick={() => setMsgPopup(null)} className="btn btnDone">
                          Done
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Learning;
