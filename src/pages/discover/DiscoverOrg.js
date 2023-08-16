import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import DiscoverService from "../../services/discoverService";
import GlobalContext from "../../context/GlobalContext";
import ProfileImage from "../../shared/ProfileImage";
import DiscoverPost from "../../popups/discovery/DiscoverPost";
import VideoImageThumbnail from "react-video-thumbnail-image";
import YoutubeThumbnail from "../../components/YoutubeThumbnail";

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];
export default function Discover() {
    const discoverServ = new DiscoverService();
    const globalCtx = useContext(GlobalContext);
    const [searchText, setSearchText] = globalCtx.searchText;
    const [postList, setPostList] = useState(null);
    const [sortType, setSortType] = useState("Most Recent");
    const [showPostId, setShowPostId] = useState("");
    const [postIdx, setPostIdx] = useState();
    useEffect(() => {
        getPostList();
    }, [searchText]);
    const getPostList = async (sortBy) => {
        const obj = { filter: {} };
        obj.filter.is_active = true;
        obj.filter.searchText = searchText;
        if (sortBy) {
            obj.sortBy = sortBy;
        } else {
            obj.sortBy = { createdAt: "desc" };
        }
        try {
            let resp = await discoverServ.postList(obj);
            if (resp.data) {
                setPostList(resp.data);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleSorting = (sortType) => {
        let sortBy = { createdAt: "desc" };
        if (sortType == "Trending") {
            setSortType("Trending");
            sortBy = { likeCount: "desc" };
        } else {
            setSortType("Most Recent");
        }
        getPostList(sortBy);
    };
    const handlePostPopup = (postId, idx) => {
        if (showPostId == postId) {
            setShowPostId("");
        } else {
            setShowPostId(postId);
            setPostIdx(idx);
        }
    };
    const changePostIdx = (idx) => {
        let newPostIdx = postIdx + idx;
        setPostIdx(newPostIdx);
        setShowPostId(postList[newPostIdx]._id);
    };

    const onClose = () => {
        setShowPostId("");
        document.body.style.overflow = "";
        document.body.style.marginRight = "";
    };

    //check item message is video url...
    const matchYoutubeUrl = (url) => {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? true : false;
    }


    return (
        <>
            <div className="discoveryHeading discoveryHeading-mobile">
                Discover the latest and trending insights in the <span className="vestColor">VestorGrow</span> Community
            </div>
            <div className="socialContant socialContentCustom main_container">
                {/*Discover Column Section Start*/}
                <div className="mostRecent mostRecent-Custom">
                    <div className="dropdown">
                        <a type="button" className="btn btn-1" data-bs-toggle="dropdown">
                            {sortType}
                        </a>
                        <ul className="dropdown-menu">
                            <li>
                                <a className="dropdown-item" href="#" onClick={() => handleSorting("recent")}>
                                    Most Recent
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#" onClick={() => handleSorting("Trending")}>
                                    Trending
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="lessonDiscoverSec" id="lessonDiscover">
                    <div className="lessonSecInner lessonDiscoverInner">
                        <div className="lessonMaterialCardRow lessonMaterialCardRowCustom">
                            {postList &&
                                postList.map((item, idx) => {
                                    return (
                                        <div className="lessonMaterialCard lessonMaterialCard" key={idx}>
                                            <Link
                                                className="discoverLink"
                                                onClick={() => handlePostPopup(item._id, idx)}
                                            >
                                                <div className="lessonSlide lessonSlide-custom lessonSlide-customHover">
                                                    <div className="lessonSlideImg overlayContantParent">
                                                        {/* <img src={item.mediaFiles[0]} alt="lesson-banner-img" className="img-fluid" /> */}
                                                        {item?.mediaFiles && item?.mediaFiles.length > 0 ? (
                                                            <div className="discoverListImg">
                                                                {isImage.includes(item?.mediaFiles[0].split(".").pop()) ? (
                                                                    <img src={item?.mediaFiles[0]} alt="lesson-banner-img" className="img-fluid" />
                                                                ) : (
                                                                    // <img src={item?.mediaFiles[0]} alt="lesson-banner-img" className="img-fluid" />
                                                                    <div className="discoverListVideo-outerCustom">
                                                                        <VideoImageThumbnail videoUrl={item?.mediaFiles[0]} alt="video" />
                                                                        <div className="overLay" style={{ borderRadius: "15px 15px 0px 0px" }}>
                                                                            <span className="overLayCustom">
                                                                                <i className="fa-solid fa-film"></i>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="discoverListImg">
                                                                {
                                                                    (matchYoutubeUrl(item.message)) ? (
                                                                        <div style={{ width: "100%" }} className="foo">
                                                                            <YoutubeThumbnail youtubeLink={item.message} type={"profile"} />
                                                                            <Link className="msg-caption" to={item.message} target="_blank">
                                                                                {(item.message).toString().length > 50 ? item.message.slice(0, 50) + "..." : item.message}
                                                                            </Link>
                                                                        </div>) : (
                                                                        <div className="discoverContantPar discoveryText w-100">
                                                                            <div className="profile-post-image-text">
                                                                                <div className="mb-0 profile-post-image-inner-text">
                                                                                    <div dangerouslySetInnerHTML={{ __html: item.message.length > 320 ? item.message.slice(0, 320) + "..." : item.message }} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        )}
                                                        {
                                                            /* 
                                                            <div className="overlayContant d-flex justify-content-between">
                                                        <div className="overlayContantTxt">
                                                            <p className="mb-0">{item.message.slice(0, 25)}</p>
                                                        </div>
                                                        <div className="overlayContantDots">
                                                            <img src="/images/icons/dots-white.svg" alt="dotsWhite" className="img-fluid" />
                                                        </div>
                                                    </div> */
                                                        }
                                                    </div>
                                                    <div className="lessonSlideContant lessonSlideContantCustom">
                                                        <div className="discoverContant discoverContant-align-center">
                                                            <div className="discoverContantTxt">
                                                                {/* <img src="/images/img/profile-image2.png" alt="profile-img" className="img-fluid" /> */}
                                                                <Link to={"/userprofile/" + item?.createdBy._id}>
                                                                    <ProfileImage
                                                                        url={item.createdBy?.profile_img}
                                                                        style={{ borderRadius: "30px", height: "auto", objectFit: "cover" }}
                                                                    />
                                                                </Link>
                                                            </div>
                                                            <div className="discoverContantPara discoverContantPara_custom">
                                                                <Link to={"/userprofile/" + item?.createdBy._id}>
                                                                    <span className="username-title-custom" title={item?.createdBy?.user_name}>
                                                                        {
                                                                            /* 
                                                                            {
                                                                                item?.createdBy?.user_name ? item?.createdBy?.user_name : `${item?.createdBy?.first_name} ${item?.createdBy?.last_name} `
                                                                            }                                                                            
                                                                            */
                                                                        }
                                                                        {item?.createdBy?.user_name.length > 20
                                                                            ? item?.createdBy?.user_name.slice(0, 20) + "..."
                                                                            : item?.createdBy?.user_name}{" "}
                                                                        {item.createdBy?.role.includes("userPaid") ? (
                                                                            <img src="/images/icons/green-tick.svg" alt="" />
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </span>
                                                                </Link>
                                                                <div className="mb-0 highWidth">
                                                                    <div dangerouslySetInnerHTML={{ __html: item.message.length > 38 ? item.message.slice(0, 38) + "..." : item.message }} />
                                                                </div>
                                                                {
                                                                    /* 
                                                                        <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Metus mollis volutpat sed am</p> 
                                                                    */
                                                                }
                                                            </div>
                                                            {
                                                                /*
                                                                    <div className="overlayContantDots m-0">
                                                                        <img src="/images/icons/dots-black.svg" alt="dotsWhite" className="img-fluid" />
                                                                    </div>
                                                                */
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                {/*Discover Column Section End*/}
            </div>
            {showPostId && (
                <DiscoverPost
                    onClose={onClose}
                    postId={showPostId}
                    slideLeft={postIdx > 0}
                    slideRight={postIdx < postList.length - 1}
                    changePostIdx={changePostIdx}
                />
            )}
        </>
    );
}
