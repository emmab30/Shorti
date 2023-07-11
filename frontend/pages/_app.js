import React from 'react'
import App from "next/app";

// CSS
import 'antd/dist/antd.css';
// global styles are required to be added to `_app.js` per Next.js requirements.
import "nprogress/nprogress.css";

/* import PerdiMiAnimalProvider from "../provider/PerdiMiAnimalProvider"; */
import NProgress from 'nprogress'
import Router from 'next/router'

// Progress on each route changes
Router.events.on('routeChangeStart', url => {
    NProgress.start()
});

Router.events.on('beforeHistoryChange', (i) => {
});

Router.events.on('routeChangeError', url => {
    NProgress.done()
});

Router.events.on('routeChangeComplete', (e) => {
    NProgress.done()
});

Router.events.on('routeChangeError', (e) => {
    NProgress.done()
});

class MyApp extends App {

    render() {
        const { Component, pageProps } = this.props;
            return (
                <Component {...pageProps} />
            );
        }
    }

export default MyApp;
