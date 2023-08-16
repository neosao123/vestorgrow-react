import React, { useState } from "react";
import ImageCarousel from "../../../popups/imageCarousel/ImageCarousel";
import GlobalMessage from "./GlobalMessage";

const GlobalMessageMobile = () => {
  const [premiumChat, setPremiumChat] = useState(0);
  const [mediaFiles, setMediaFiles] = useState([]);
  return (
    <>
      <GlobalMessage setPremiumChat={setPremiumChat} setMediaFiles={setMediaFiles} />
      {mediaFiles && mediaFiles.length > 0 && (
        <ImageCarousel onClose={() => setMediaFiles(null)} mediaFiles={mediaFiles} imageIdx={0} />
      )}
    </>
  );
};

export default GlobalMessageMobile;
