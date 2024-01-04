import React from 'react';
import { Helmet } from 'react-helmet-async';
import Logo from "../assets/images/logo/favicon-32x32.png"

const MetaTag = () => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>VestorGrow</title>
      <meta name="description" content="This is vestorgrow" />
      <meta property="og:title" content="VestorGrow" />
      <meta property="og:description" content="This is vestorgrow" />
      <meta property="og:image" content={Logo} />
      <title>VestorGrow</title>
      <link rel="canonical" href="https://showresult.vestorgrow.com" />
      <link rel="apple-touch-icon" sizes="57x57" href="/images/logo/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/images/logo/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/images/logo/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/images/logo/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/images/logo/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/images/logo/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/images/logo/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/images/logo/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/images/logo/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/images/logo/android-chrome-192x192.png" />
      <link rel="icon" type="favicon" sizes="32x32" href="/images/logo/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/images/logo/android-chrome-512x512.png" />
      <link rel="icon" type="favicon" sizes="16x16" href="/images/logo/favicon-16x16.png" />
    </Helmet>
  )
}

export default MetaTag