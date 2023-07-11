/* eslint-disable react/no-danger */
import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class ShortiDocument extends Document {
    /*static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }*/

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charset="utf-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="description" content="Convert any long link to a short link, and your users will be grateful to you." />
                    <meta name="robots" content= "index, follow" />

                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://shorti.io/" />
                    <meta property="og:title" content="Short links, simplify life" />
                    <meta property="og:description" content="Convert any long link to a short link, and your users will be grateful to you." />
                    <meta property="og:image" content="https://i.ibb.co/rxsWkFM/metadata.png" />
                    
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://shorti.io/" />
                    <meta property="twitter:title" content="Short links, simplify life" />
                    <meta property="twitter:description" content="Convert any long link to a short link, and your users will be grateful to you." />
                    <meta property="twitter:image" content="https://i.ibb.co/rxsWkFM/metadata.png" />
                    
                    <script src="https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js"></script>
                    <script src="https://www.gstatic.com/firebasejs/8.0.1/firebase-analytics.js"></script>
                    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-739958970"></script>
                    <script data-ad-client="ca-pub-5500884352220114" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                    <script src="/assets/js/analytics.js"></script>

                    <title>Shorti: Simplify Links</title>
                    {/* <link href="https://fonts.googleapis.com/css?family=Heebo:400,700|IBM+Plex+Sans:600" rel="stylesheet" /> */}
                    <link href="https://fonts.googleapis.com/css2?family=Exo:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
                    <link rel="stylesheet" href="/assets/css/style.css" />
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default ShortiDocument;