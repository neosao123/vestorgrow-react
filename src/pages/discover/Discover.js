import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import DiscoverService from "../../services/discoverService";
import HelperFunctions from "../../services/helperFunctions";
import GlobalContext from "../../context/GlobalContext";
import ProfileImage from "../../shared/ProfileImage";
import DiscoverPost from "../../popups/discovery/DiscoverPost";
import VideoImageThumbnail from "react-video-thumbnail-image";
import YoutubeThumbnail from "../../components/YoutubeThumbnail";
import Playeryoutube from "../../components/Playeryoutube";
import "./discover.css"
import ProfilePreview from "../../components/ProfilePreview";
import Loader from "../../components/Loader";
import VideoThumbnailComp from "./VideoThumbnail"

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];
const isVideo = ["mp4"];
export default function Discover() {
    const discoverServ = new DiscoverService();
    const helperServ = new HelperFunctions();
    const globalCtx = useContext(GlobalContext);
    const [searchText, setSearchText] = globalCtx.searchText;
    const [items, setItems] = useState([{ _id: "1", keyword: "all" }]);
    const [postList, setPostList] = useState(null);
    const [sortType, setSortType] = useState("Most Recent");
    const [showPostId, setShowPostId] = useState("");
    const [postIdx, setPostIdx] = useState();
    const [showUserLikedPost, setShowUserLikedPost] = useState(false);
    const [Loading, setLoading] = useState(false)

    const getTags = async () => {
        try {
            let resp = await discoverServ.getPopularTags();
            if (resp.message === "Keywords Found") {
                const items = resp.result.data.map((item) => item);
                setItems([{ _id: "1", keyword: "all" }, ...items]);
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false)
    };

    const getPostList = async (sortBy) => {
        setLoading(true)
        const obj = { filter: {} };
        obj.filter.is_active = true;
        obj.filter.searchText = searchText;
        obj.filter.category = category;
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
        if (sortType === "Trending") {
            setSortType("Trending");
            sortBy = { likeCount: "desc" };
        } else {
            setSortType("Most Recent");
        }
        getPostList(sortBy);
    };

    const handlePostPopup = (postId, idx) => {
        if (showPostId === postId) {
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

    const [category, setCategory] = useState("all");
    const handleClick = (newCategory) => {
        setCategory(newCategory);
    };

    const filteredPosts =
        category === "all"
            ? postList
            : postList.filter((item) => item?.postKeywords.includes(category));

    //check item message is video url...
    const matchYoutubeUrl = (url) => {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? true : false;
    }

    const countFormator = (counter) => {
        if (counter >= 1000000000) {
            return (counter / 1000000000).toFixed(1) + "B";
        } else if (counter >= 1000000) {
            return (counter / 1000000).toFixed(1) + "M";
        } else if (counter >= 1000) {
            return (counter / 1000).toFixed(1) + "K";
        } else {
            return counter.toString();
        }
    }

    useEffect(() => {
        console.log("CATEGORY:", category)
        getPostList();
        getTags();
    }, [searchText, category]);

    const handleThumbanail = () => { }

    return (
        <div className="socialContantInner d-flex flex-column">
            <div className="socialContant socialContentCustom">
                <div className="discoveryHeading discoveryHeading-mobile">
                    Discover the latest and trending insights within < span className="vestColor" > VestorGrow</span >
                </div >
                <div className="mostRecent">
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
                <div className="dis">
                    <div className="category-btn">
                        {items.map((items) => {
                            return (
                                <>
                                    <button
                                        key={items._id}
                                        className={
                                            category === items.keyword.toLowerCase() ? "active-category" : ""
                                        }
                                        onClick={() => handleClick(items.keyword.toLowerCase())}
                                        style={{ textTransform: "capitalize" }}
                                    >
                                        {items.keyword}
                                    </button>
                                </>
                            );
                        })}
                    </div>
                    <div className="grid_discover">
                        {filteredPosts &&
                            filteredPosts.map((item, idx) => {
                                const postMessage = item.message.replace(/<\/?a[^>]*>/g, "");
                                const fullName = item.createdBy.first_name + " " + item.createdBy.last_name;
                                const user_name = item.createdBy.user_name ?? fullName;
                                const postReactions = item.postReactions ?? [];
                                const youtubeUrl = helperServ.extractYouTubeURL(item?.message);
                                const clientAvatar = item.createdBy?.profile_img !== "" ? item.createdBy?.profile_img : "/images/profile/default-profile.png";
                                return (
                                    <div
                                        key={item._id}
                                        className="grid-item"
                                        style={{ color: "inherit" }}
                                        onClick={() => handlePostPopup(item._id, idx)}
                                    >
                                        <div className="discover">
                                            {item.mediaFiles && item.mediaFiles.length > 0 ? (
                                                <>
                                                    {isImage.includes(item.mediaFiles[0].split(".").pop()) ? (
                                                        <div
                                                            className="grid-image"
                                                            style={{
                                                                backgroundImage: `url(${item.mediaFiles[0]})`,
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center",
                                                                backgroundRepeat: "no-repeat"
                                                            }}
                                                        ></div>
                                                    ) : (
                                                        <div className="grid-video">
                                                            <VideoImageThumbnail
                                                                videoUrl={item.mediaFiles[0]}
                                                                thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                                                alt="video"
                                                            />

                                                            {/* <VideoThumbnailComp videoURL={item?.mediaFiles[0]} /> */}

                                                            {/* <div className="video-overlay"> */}
                                                                {/* <i className="fa-solid fa-film"></i> */}
                                                            {/* </div> */}
                                                            {isVideo.includes(item.mediaFiles[0].split(".").pop()) && (
                                                                <></>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {
                                                        youtubeUrl ? (
                                                            <div className="grid-youtube">
                                                                <Playeryoutube url={youtubeUrl} height={"311px"} corners={false} />
                                                            </div>
                                                        ) : (
                                                            <div className="grid-text">
                                                                <div className="text-content">
                                                                    <div
                                                                        dangerouslySetInnerHTML={{
                                                                            __html:
                                                                                item.message.length > 320
                                                                                    ? item.message.slice(0, 320) + "..."
                                                                                    : item.message,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </>
                                            )}
                                            <div className="grid-details">
                                                <div className="grid-user">
                                                    {/* <ProfilePreview userId={item.createdBy._id} profile_img={item.createdBy?.profile_img} section="discovery" /> */}
                                                    <div>
                                                        <img
                                                            alt={item.createdBy.user_name}
                                                            src={
                                                                clientAvatar
                                                            }
                                                            className="prf-pic rounded-circle border border-white border-3"
                                                        />
                                                    </div>
                                                    <span className="grid-user-name">
                                                        {user_name.length > 12 ? (user_name.slice(0, 12) + "...") : user_name}
                                                    </span>
                                                    <div className="grid-likes" style={{ cursor: "pointer" }}>
                                                        {item.likeCount > 0 ? (
                                                            <div className={"d-flex align-items-center"} onClick={() => setShowUserLikedPost(item?._id)}>
                                                                <div className="floating-reactions-container">
                                                                    {
                                                                        postReactions.includes("like") && <span><img src="/images/icons/filled-thumbs-up.svg" alt="filled-thumbs-up" /></span>
                                                                    }
                                                                    {
                                                                        postReactions.includes("love") && <span><img src="/images/icons/filled-heart.svg" alt="filled-heart" /></span>
                                                                    }
                                                                    {
                                                                        postReactions.includes("insight") && <span><img src="/images/icons/filled-insightfull.svg" alt="filled-insightfull" /></span>
                                                                    }
                                                                </div>
                                                                <span className="mx-2">{countFormator(item?.likeCount)}</span>
                                                            </div>
                                                        ) : (
                                                            <NavLink
                                                                className="nav-link"
                                                            >
                                                                <img src="/images/icons/no-reaction.svg" alt="like" className="img-fluid" style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                                                <span>{item?.likeCount}</span>
                                                            </NavLink>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* <div style={{ border: "1px solid red", width: "100%" }}></div> */}
                                                <p className="grid-text-content" dangerouslySetInnerHTML={{ __html: postMessage }} />

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div >
            {
                showPostId && (
                    <DiscoverPost
                        onClose={onClose}
                        postId={showPostId}
                        slideLeft={postIdx > 0}
                        slideRight={postIdx < postList.length - 1}
                        changePostIdx={changePostIdx}
                        getPostList={getPostList}
                    />
                )
            }
        </div >
    );
}
