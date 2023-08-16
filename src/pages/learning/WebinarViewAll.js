import { useState, useContext, useEffect } from "react";
import LearningService from "../../services/learningService";
import webinarCategoryService from "../../services/webinarCategoryService";
import GlobalContext from "../../context/GlobalContext";
import moment from "moment"
import { useNavigate, Link } from "react-router-dom"
import VideoPlayer from "../../shared/VideoPlayer";
const serv = new LearningService();
const categoryServ = new webinarCategoryService();

const sortList = ["Recent", "Oldest"]

function WebinarViewAll() {
    const navigate = useNavigate()
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [searchText, setSearchText] = globalCtx.searchText;
    const [courseList, setCourseList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedSorting, setSelectedSorting] = useState();
    const [toggleDropDown, setToggleDropDown] = useState(false);
    const [sortToggleDropDown, setSortToggleDropDown] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null)
    const [msgPopup, setMsgPopup] = useState(null)
    useEffect(() => {
        getWebinarList()
    }, [selectedCategory, searchText, selectedSorting])
    useEffect(() => {
        getCategoryList()
    }, [])
    const getWebinarList = async () => {
        try {
            let obj = {
                filter: {
                    is_active: 1
                }
            }
            if (selectedCategory.length > 0) {
                obj.filter.categoryId = selectedCategory
            }
            if (selectedSorting) {
                obj.sortBy = selectedSorting
            }
            if (searchText !== "") {
                obj.filter.searchText = searchText
            }
            let resp = await serv.webinarList(obj);
            if (resp.data) {
                setCourseList(resp.data)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const getCategoryList = async () => {
        try {
            let resp = await categoryServ.categoryList({});
            if (resp.data) {
                setCategoryList(resp.data)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const handleCategory = (id) => {
        if (selectedCategory.includes(id)) {
            setSelectedCategory(selectedCategory.filter(item => item !== id))
        } else {
            setSelectedCategory([...selectedCategory, id])
        }
    }
    const handleSorting = (type) => {
        if (type == "Recent") {
            setSelectedSorting({ createdAt: "desc" })
        } else {
            setSelectedSorting({ ...selectedSorting, createdAt: "asc" })
        }
    }
    const handleWebinarClick = (webItem) => {
        let date = new Date()
        let start = moment(webItem.start_date).diff(moment(date))
        let end = moment(webItem.end_date).diff(moment(date))
        if (start >= 0) {
            setMsgPopup("This webinar didn't started yet")
        } else if (start < 0 && end >= 0) {
            window.open(webItem.webinar_link, "_blank")
        } else {
            if (webItem.video && webItem.video !== "") {
                setVideoUrl(webItem.video)
            } else {
                setMsgPopup("We will update video very soon..")
            }
        }
    }
    return (<>
        <div className="socialContant main_container">
            <div className="lessonsSec" id="lessonSec">

                <div className="asideLessonsSec ">
                    <div className="d-flex justify-content-between">
                        <Link to="/learning" className="back-link-custom"><img src="/images/icons/slider-left-arrow.svg" /> Back</Link>
                    </div>
                    <ul className="nav flex-column asideMenuList">
                        <li className="nav-item" onClick={() => setToggleDropDown(!toggleDropDown)}>
                            <a className={`nav-link ${toggleDropDown && "active"}`} href="#">Filter by Category <img src="/images/icons/down-arrow.svg" alt="down-arrow" className="img-fluid" /></a>
                            <ul className={`nav flex-column dropDown ${toggleDropDown && "active"}`} style={{ display: toggleDropDown ? "block" : "none" }}>
                                {categoryList.map((item, idx) => (
                                    <li className="nav-item" key={idx}>
                                        <div class="agreementLogin text-start pt-3">
                                            <input onChange={() => handleCategory(item._id)} type="checkbox" id={`condition${idx}`} checked={selectedCategory.includes(item._id) ? true : false} />
                                            {item?.name?.length > 17 ?
                                                <label for={`condition${idx}`} title={item.name}>{item.name.slice(0, 17)}</label>
                                                :
                                                <label for={`condition${idx}`}>{item.name}</label>
                                            }
                                        </div>
                                    </li>

                                )
                                )}
                            </ul>
                        </li>
                        <li className="nav-item" onClick={() => setSortToggleDropDown(!sortToggleDropDown)}>
                            <a className={`nav-link ${sortToggleDropDown && "active"}`} href="#">Sort By <img src="/images/icons/down-arrow.svg" alt="down-arrow" className="img-fluid" /></a>
                            <ul className={`nav flex-column dropDown ${sortToggleDropDown && "active"}`} style={{ display: sortToggleDropDown ? "block" : "none" }}>
                                {sortList.map((item, idx) => (
                                    <li className="nav-item" key={idx}>
                                        <div class="agreementLogin text-start pt-3">
                                            {/* <input onChange={() => handleSorting(item)} type="radio" id={`condition${idx}`} checked={selectedCategory.includes(item) ? true : false} /> */}
                                            <input onClick={() => handleSorting(item)} type="radio" id={`sort${idx}`} name="sort" />
                                            {item?.length > 17 ?
                                                <label for={`sort${idx}`} title={item}>{item.slice(0, 17)}</label>
                                                :
                                                <label for={`sort${idx}`}>{item}</label>
                                            }
                                        </div>
                                    </li>
                                )
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>



                <div className="lessonSecInner">
                    {categoryList.filter(cat => selectedCategory.includes(cat._id)).length > 0 &&
                        <div className="discoverTab">
                            <ul class="nav nav-pills">
                                {categoryList.filter(cat => selectedCategory.includes(cat._id)).map((cat, idx) => (
                                    <li class="nav-item">
                                        <a class="nav-link active" data-bs-toggle="pill" href="#discoverCrypto">{cat.name}
                                            <span className="p-0 m-0 ms-2" onClick={() => handleCategory(cat._id)}>X</span>
                                        </a>
                                    </li>
                                    // <button type="button" className="selectedCat">
                                    //     <p className="p-0 m-0">{cat.name}</p>
                                    //     <span className="p-0 m-0 ms-2" onClick={() => handleCategory(cat._id)}>X</span>
                                    // </button>
                                ))}
                            </ul>
                        </div>}
                    <div className="lessonMaterialSec" id="lessonMaterial">
                        <div className="lessonMaterialCardRow lssnMaterialCardCustom mt-1 ">
                            {courseList
                                .map(item => {
                                    return (
                                        <div className="lessonMaterialCard lessonSlideItemCustom" style={{ maxWidth: "400px" }} onClick={() => handleWebinarClick(item)}>
                                            <a href="javascript:void(0);">
                                                <div className="lessonSlide lessonSlideCustom">
                                                    <div className="lessonSlideImg">
                                                        <img src={item.banner_image} alt="lesson-banner-img" className="img-fluid bannerImageContent" />
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
                                                            <p className="mb-0" >{item.desc.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 110)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="lessonSlideBtn lessonSlideBtnCustom">
                                                        <div className="lessonSlideBtnInner d-flex align-items-center justify-content-between">
                                                            <div className="lessonWatchBtn">
                                                                <p onClick={() => handleWebinarClick(item)}>Watch Now <img src="/images/icons/arrow_forward.svg" alt="watch-now" className="img-fluid ms-2" /></p>
                                                            </div>
                                                            {/* <div className="lessonTime">
                                                    <p className="mb-0">20h 10m <img src="/images/icons/watch.svg" alt="watch-now" className="img-fluid ms-2" /></p>
                                                </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                    )
                                })}

                        </div>
                    </div>
                </div >
            </div >
        </div >
        {
            videoUrl && <VideoPlayer videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
        }
        {
            msgPopup && msgPopup !== "" &&
            <div class="modal" style={{ display: "block" }}>
                <div class="vertical-alignment-helper">
                    <div class="vertical-align-center">
                        <div class="thanksReportingModal modal-dialog modal-sm">
                            <div class="modal-content">
                                <div class="modal-header border-bottom-0 pb-0">
                                    <button type="button" onClick={() => setMsgPopup(null)} class="btn-close" data-bs-dismiss="modal"></button>
                                </div>

                                <div className="modal-body">
                                    <div className="postShared text-center">
                                        <h6>{msgPopup}</h6>
                                        <div className="reportingBtn">
                                            <a href="javascript:void(0);" onClick={() => setMsgPopup(null)} className="btn btnDone">Done</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        }
    </>
    )
}
export default WebinarViewAll