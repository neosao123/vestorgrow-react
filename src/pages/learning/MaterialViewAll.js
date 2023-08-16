import { useState, useContext, useEffect } from "react";
import LearningService from "../../services/learningService";
import learningMaterialCategoryService from "../../services/learningMaterialcategoryService";
import GlobalContext from "../../context/GlobalContext";
import moment from "moment"
import { useNavigate, Link } from "react-router-dom"
const serv = new LearningService();
const categoryServ = new learningMaterialCategoryService();
const sortList = ["Recent", "Oldest"]
function MaterialViewAll() {
    const navigate = useNavigate()
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [searchText, setSearchText] = globalCtx.searchText;
    const [materialList, setMaterialList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedSorting, setSelectedSorting] = useState();
    const [toggleDropDown, setToggleDropDown] = useState(false)
    const [sortToggleDropDown, setSortToggleDropDown] = useState(false)
    useEffect(() => {
        getMaterialList()
    }, [searchText, selectedCategory, selectedSorting])
    useEffect(() => {
        getCategoryList()
    }, [])
    const getMaterialList = async () => {
        try {
            let obj = {
                filter: {
                    is_active: 1
                }
            }
            if (searchText !== "") {
                obj.filter.searchText = searchText
            }
            if (selectedCategory.length > 0) {
                obj.filter.categoryId = selectedCategory
            }
            if (selectedSorting) {
                obj.sortBy = selectedSorting
            }
            let resp = await serv.learningMaterialList(obj);
            if (resp.data) {
                setMaterialList(resp.data)
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
    // const handleMaterialClick = (courseId) => {
    //     if (user.role.includes("userPaid") || user.role.includes("admin")) {
    //         navigate("/learning/lesson/" + courseId)
    //     } else {
    //         navigate("/learning/locked")
    //     }
    // }
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
                                ))}
                            </ul>
                        </div>}
                    <div className="lessonMaterialSec" id="lessonMaterial">
                        <div className="lessonMaterialCardRow">
                            {materialList.length > 0 && materialList.map(item => (
                                <div className="lessonMaterialCard">
                                    <Link to={`/learning/material/${item._id}`}>
                                        <div className="lessonSlide">
                                            <div className="lessonSlideImg">
                                                <img src={item.banner_image} alt="lesson-banner-img" className="img-fluid" style={{ width: "327px", height: "172px" }} />
                                            </div>
                                            <div className="lessonSlideContant">
                                                <div className="lessonSlideTxt">
                                                    <h4 className="mb-0">{item.title}</h4>
                                                </div>
                                                <div className="lessonPara">
                                                    <p className="mb-0">{item.desc.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, ' ').slice(0, 40)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}

                        </div>

                    </div>
                </div>
            </div>

        </div >
    </>
    )
}
export default MaterialViewAll