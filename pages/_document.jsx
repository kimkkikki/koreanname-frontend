import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="ko">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="keywords" content="이름,선호이름,신생아이름,이름통계,아기이름,작명,선호하는,아기,개명,한국이름" />
          <meta name="author" content="kimkkikki" />
          <meta name="image" content="https://koreanname.me/static/home.jpg" />
          <meta name="description" content="한국인의 이름 통계 서비스" />
          <meta property="og:description" content="한국인의 이름 통계 서비스" />
          <meta property="og:image" content="https://koreanname.me/static/home.jpg" />
          <meta name="naver-site-verification" content="a9df23b43bfd8a4b2706a8fc4ec01218e8427938" />
          <meta name="msvalidate.01" content="54A117C9AC83B1E74B48C93F9A779987" />
          <meta name="google-site-verification" content="4DkPnpJFXVbFpfcLWF8cpznQifPoJXx9OE7sVN81MH4" />
          <link rel="icon" type="image/x-icon" href="/static/favicon.jpg" />

          <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
          <script src="//developers.kakao.com/sdk/js/kakao.min.js" />
          <script src="https://d.line-scdn.net/r/web/social-plugin/js/thirdparty/loader.min.js" async="async" defer="defer" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
