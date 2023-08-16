import { useState, useContext, useEffect } from "react";
import LearningService from "../../services/learningService";
import categoryService from "../../services/categoryService";
import GlobalContext from "../../context/GlobalContext";
import moment from "moment"
import { useNavigate, Link } from "react-router-dom"
const serv = new LearningService();
const categoryServ = new categoryService();

let levelList = ["Easy", "Medium", "Hard"]

function ViewAll() {
    const navigate = useNavigate()
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [searchText, setSearchText] = globalCtx.searchText;
    const [courseList, setCourseList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedLevel, setSelectedLevel] = useState([])
    const [toggleDropDown, setToggleDropDown] = useState(false)
    const [toggleDropDownLevel, setToggleDropDownLevel] = useState(false)
    useEffect(() => {
        getCourseList()
    }, [selectedCategory, searchText, selectedLevel])
    useEffect(() => {
        getCategoryList()
    }, [])
    const getCourseList = async () => {
        try {
            let obj = {
                filter: {
                    is_active: 1
                }
            }
            if (selectedCategory.length > 0) {
                obj.filter.categoryId = selectedCategory
            }
            if (selectedLevel.length > 0) {
                obj.filter.level = selectedLevel
            }
            if (searchText !== "") {
                obj.filter.searchText = searchText
            }
            let resp = await serv.courseList(obj);
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
    const handleCourseClick = (courseId) => {
        if (user.role.includes("userPaid") || user.role.includes("admin")) {
            navigate("/learning/lesson/" + courseId)
        } else {
            navigate("/learning/locked")
        }
    }
    const handleCategory = (id) => {
        if (selectedCategory.includes(id)) {
            setSelectedCategory(selectedCategory.filter(item => item !== id))
        } else {
            setSelectedCategory([...selectedCategory, id])
        }
    }
    const handleLevel = (value) => {
        if (selectedLevel.includes(value)) {
            setSelectedLevel(selectedLevel.filter(item => item !== value))
        } else {
            setSelectedLevel([...selectedLevel, value])
        }
    }
    return (<>
        <div className="socialContant main_container">
            <div className="lessonsSec" id="lessonSec">

                <div className="asideLessonsSec">
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
                        <li className="nav-item" onClick={() => setToggleDropDownLevel(!toggleDropDownLevel)}>
                            <a className={`nav-link ${toggleDropDownLevel && "active"}`} href="#">Filter by Level <img src="/images/icons/down-arrow.svg" alt="down-arrow" className="img-fluid" /></a>
                            <ul className={`nav flex-column dropDown ${toggleDropDownLevel && "active"}`} style={{ display: toggleDropDownLevel ? "block" : "none" }}>
                                {levelList.map((item, idx) => (
                                    <li className="nav-item" key={idx}>
                                        <div class="agreementLogin text-start pt-3">
                                            <input onChange={() => handleLevel(item)} type="checkbox" id={`level${idx}`} checked={selectedLevel.includes(item) ? true : false} />
                                            <label for={`level${idx}`}>{item}</label>
                                        </div>
                                    </li>

                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>



                <div className="lessonSecInner">
                    {(categoryList.filter(cat => selectedCategory.includes(cat._id)).length > 0 || selectedLevel.length > 0) &&
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
                                {selectedLevel.map((level, idx) => (
                                    <li class="nav-item">
                                        <a class="nav-link active" data-bs-toggle="pill" href="#discoverCrypto">{level}
                                            <span className="p-0 m-0 ms-2" onClick={() => handleLevel(level)}>X</span>
                                        </a>
                                    </li>
                                    // <button type="button" className="selectedCat">
                                    //     <p className="p-0 m-0">{level}</p>
                                    //     <span className="p-0 m-0 ms-2" onClick={() => handleLevel(level)}>X</span>
                                    // </button>
                                ))}
                            </ul>
                        </div>}
                    <div className="lessonMaterialSec" id="lessonMaterial">
                        <div className="lessonMaterialCardRow lssnMaterialCardCustom mt-1 ">
                            {courseList
                                .map(item => {
                                    return (
                                        <div className="lessonMaterialCard lessonSlideItemCustom" style={{ maxWidth: "400px" }} onClick={() => handleCourseClick(item._id)}>
                                            <a href="javascript:void(0);">
                                                <div className="lessonSlide lessonSlideCustom">
                                                    <div className="lessonSlideImg">
                                                        <img src={item.banner_image} alt="lesson-banner-img" className="img-fluid bannerImageContent" style={{ width: "100%", height: "215px" }} />
                                                    </div>
                                                    <div className="lessonSlideContant lessonSlideContentCustom">
                                                        <div className="lessonSlideTxt">
                                                            <h4 className="mb-0">{item.course_name}</h4>
                                                        </div>
                                                        <div className="lessonCreated d-flex align-items-center justify-content-between">
                                                            <div className="lessonCreatedDate">
                                                                <p className="mb-0">Created: {moment(item.createdAt).format("MMMM DD, YYYY")}</p>
                                                            </div>
                                                            {/* <div className="lessonMidLevel">
                                                                <p className="mb-0">{item.level.length > 4 ? item.level.slice(0, 3) : item.level} level <img src="/images/icons/level.svg" alt="mid-level" className="img-fluid ms-2" /></p>
                                                            </div> */}
                                                        </div>
                                                        <div className="lessonPara">
                                                            <p className="mb-0" >{item.course_desc.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, ' ').slice(0, 100)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="lessonSlideBtn lessonSlideBtnCustom">
                                                        <div className="lessonSlideBtnInner d-flex align-items-center justify-content-between">
                                                            <div className="lessonWatchBtn">
                                                                <p onClick={() => handleCourseClick(item._id)}>Watch Now <img src="/images/icons/arrow_forward.svg" alt="watch-now" className="img-fluid ms-2" /></p>
                                                            </div>
                                                            <div className="lessonTime">
                                                                <p className="mb-0">{item.watch_time} <img src="/images/icons/watch.svg" alt="watch-now" className="img-fluid ms-2" /></p>
                                                            </div>
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
    </>
    )
}
export default ViewAll