import React, { useEffect, useState } from 'react';

const YoutubeThumbnail = ({ youtubeLink, type }) => {

    const [previewThumbnail, setPreviewThumbnail] = useState("");

    const getVideoIdFromUrl = (url) => {
        const videoIdRegex = /(?:\?v=|\/embed\/)([^\s&]+)/;
        const match = url.match(videoIdRegex);
        if (match !== null)
            return match[1] ?? "";
        else return "";
    }

    const matchYoutubeUrl = (url) => {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? true : false;
    }

    useEffect(() => {
        if (youtubeLink !== "" && youtubeLink !== undefined) {
            if (matchYoutubeUrl(youtubeLink)) {
                const videoId = getVideoIdFromUrl(youtubeLink);
                setPreviewThumbnail(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
            }
        }
    }, [youtubeLink, type])

    if (type === "profile") {
        return (
            <img src={previewThumbnail} className="img-fluid" alt="..." style={{ textAlign: "center", objectFit: "cover", height: "100%" }} />
        )
    } else {
        return (
            <img src={previewThumbnail} className="img-fluid" alt="..." style={{ textAlign: "center", objectFit: "contain" }} />
        )
    }


}

export default YoutubeThumbnail