import { useState, useContext, useEffect } from "react";
import LearningService from "../../services/learningService";
import GlobalContext from "../../context/GlobalContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import VideoPlayer from "../../shared/VideoPlayer";
const serv = new LearningService();
function Lesson() {
    const params = useParams();
    const navigate = useNavigate()
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [course, setCourse] = useState()
    const [showDropDown, setShowDropDown] = useState([])
    const [lessonList, setLessonList] = useState([])
    const [topicId, setTopicId] = useState(null)
    const [subTopicId, setSubTopicId] = useState(null)
    const [videoUrl, setVideoUrl] = useState(null)
    useEffect(() => {
        if (user.role.includes("userPaid") || user.role.includes("admin")) {
            getCourse()
        } else {
            navigate("/learning/locked")
        }
    }, [params.id])
    const getCourse = async () => {
        try {
            let resp = await serv.getCourse(params.id);
            if (resp.data) {
                let lessonArr = []
                setCourse(resp.data)
                resp.data.topics.map(topic => {
                    topic.sub_topics.map(subTopic => {
                        subTopic.lessons.map(lssn => {
                            lssn.topicId = topic._id
                            lssn.subTopicId = subTopic._id
                            lessonArr.push(lssn)
                        })
                    })
                })
                setLessonList(lessonArr)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const toggleDropDown = (idx) => {
        if (showDropDown.includes(idx)) {
            setShowDropDown([])
            // setShowDropDown(showDropDown.filter(item => item !== idx))
        } else {
            setShowDropDown([idx]);
            // setShowDropDown([...showDropDown, idx]);
        }
    }
    const handlePlayer = (lesson_video) => {
        if (videoUrl) {
            setVideoUrl(null)
        } else {
            setVideoUrl(lesson_video)
        }
    }
    // console.log("lssn", lessonList);
    return (
        <>
            <div className="socialContant main_container">
                <div className="mb-3">
                    <img className="courseCoverCustom" src={course?.cover_image} />
                </div>
                <div className="lessonsSec">
                    <div className="fliterMenuToogle d-lg-none">
                        <a href="javascript:void(0);" className="filterMenu"><i className="fa fa-tasks me-1" aria-hidden="true" /> Menu</a>
                    </div>
                    <div className="asideLessonsSec">
                        <div className="d-flex justify-content-between">
                            <Link to="/learning" className="back-link-custom"><img src="/images/icons/slider-left-arrow.svg" /> Back</Link>
                            <a href="#" className="back-link-custom" onClick={() => setSubTopicId("")}>Reset</a>
                        </div>
                        <ul className="nav flex-column asideMenuList">
                            {course?.topics.map((item, idx) => (
                                <li className="nav-item" key={idx}>
                                    <a onClick={() => toggleDropDown(idx)} className={`nav-link ${showDropDown.includes(idx) && "active"}`} href="javascript:void(0);">{item.topic_title} <img src="/images/icons/down-arrow.svg" alt="down-arrow" className="img-fluid" /></a>
                                    <ul className={`nav flex-column dropDown ${showDropDown.includes(idx) && "active"}`} style={{ display: showDropDown.includes(idx) ? "block" : "none" }}>
                                        {item.sub_topics.map((subItem, subIdx) => (
                                            <li className="nav-item" key={subIdx} onClick={() => setSubTopicId(subItem._id)}>
                                                <a className="nav-link" href="javascript:void(0);">{subItem.sub_topic_title}</a>
                                            </li>

                                        ))}
                                    </ul>
                                </li>

                            ))}
                        </ul>
                    </div>
                    <div className="lessonsListSec">
                        <div className="lessonsListInnerSec">
                            {
                                lessonList.filter(item => {
                                    if (topicId || subTopicId) {
                                        if (subTopicId) {
                                            return item.subTopicId == subTopicId
                                        } else {
                                            return item.topicId == topicId
                                        }
                                    } else {
                                        return true
                                    }
                                }).map(lssn => (
                                    <div className="lessonsVideoListOuter" onClick={() => handlePlayer(lssn.lesson_video)}>
                                        <a href="javascript:void(0);" className="lessonsVideoList d-flex">
                                            <div className="lessonsVideo">
                                                <img src={lssn.lesson_cover} style={{ width: "320px", height: "175px" }} alt="video" className="img-fluid" />
                                            </div>
                                            <div className="lessonsVideoContant">
                                                <div className="lessonsVideoTxt">
                                                    <h4 className="mb-0">{lssn.lesson_title}</h4>
                                                    <p className="mb-0">{lssn.desc}</p>
                                                    <span>{course.createdBy?.user_name}</span>
                                                </div>
                                                <div className="videoTime">
                                                    <p className="mb-0"><img src="/images/icons/watch.svg" alt="down-arrow" className="img-fluid me-1" /> {lssn.watch_time}</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            {
                videoUrl && <VideoPlayer videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
            }
        </>
    )
}
export default Lesson