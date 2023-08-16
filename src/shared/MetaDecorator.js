import React from "react";
import { Helmet } from "react-helmet";

const MetaDecorator = ({ title, description, imageUrl }) => {
  return (
    <div>
      <Helmet>
        <meta property="og:title" content={`posted by ${title}`} />
        <meta property="og:description" content={description} />
        {imageUrl ? <meta property="og:image" content={imageUrl} /> : ""}
        <meta property="og:url" content={window.location.pathname + window.location.search} />
      </Helmet>
      {/* <title>{title}</title>
        <meta charSet="utf-8" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={window.location.pathname + window.location.search} /> */}
      {/* <Helmet.Parent>
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={imageUrl} />
          <meta property="og:url" content={window.location.pathname + window.location.search} />
        </Helmet>

        <Helmet.Child>
          <Helmet>
            <title>My Title</title>
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:url" content={window.location.pathname + window.location.search} />
          </Helmet>
        </Helmet.Child>
      </Helmet.Parent> */}
      {/* <link rel="canonical" href={window.location.pathname + window.location.search} /> */}
    </div>
  );
};

export default MetaDecorator;
