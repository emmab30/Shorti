import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head'
import NProgress from 'nprogress'
import Layout from '../components/Layout'
import * as Services from '../services'
import {
  message
} from 'antd';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState(null);
  const [shortLink, setShortLink] = useState(null);
  const [error, setError] = useState(null);
  const shortLinkContainer = useRef();

  const onSubmit = async () => {
    // Check if there is any link
    if(!url || !url.length) {
      setError('Please, type any link you want to short');
      return;
    }

    setError(null);
    setShortLink(null);

    NProgress.start();
    let response = await Services.LinkService.generateLink({
      long_link: url
    });

    const { data } = response;

    if(data.success) {
      setShortLink(data.short_link);
      router.push(`/links/[hash]/stats`, `/links/${data.hash}/stats`);
    } else {
      setError(data.message);
    }

    NProgress.done();
  }

  return (
    <Layout>
      <main>
        <section className="hero">
          <div className="container" style={{ maxWidth: 1600 }}>
            <div className="hero-inner">
              <div className="hero-copy">
                <h1 className="hero-title mt-0">Short links, simplify life</h1>
                <p className="hero-paragraph">Convert your long links into short links, and your users will thank you.</p>
              </div>
              <div className="hero-media">
                <div className="hero-media-illustration">
                  <img className="hero-media-illustration-image asset-light" src="/assets/images/hero-media-illustration-light.svg" alt="Hero media illustration" />
                  <img className="hero-media-illustration-image asset-dark" src="/assets/images/hero-media-illustration-dark.svg" alt="Hero media illustration" />
                </div>
                <div className="hero-media-container">
                  <img className="hero-media-image asset-light" src="/assets/images/hero-media-light.jpg" alt="Hero media" />
                  <img className="hero-media-image asset-dark" src="/assets/images/hero-media-dark.svg" alt="Hero media" />
                </div>
              </div>
            </div>
            <div className="hero-cta">
              <div className="wrap-input100 validate-input m-b-20">
                <input
                  className="input100"
                  type="text"
                  name="link"
                  value={url}
                  onChange={(evt) => setUrl(evt.target.value)} placeholder="Enter your link here"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSubmit()
                    }
                  }}
                />
                <span className="focus-input100" />
                <div className="progress-conversion">
                  <span id="progress-bar" />
                </div>
              </div>
              <div className="container-login100-form-btn">
                <button onClick={onSubmit} className="login100-form-btn simplify">
                  Simplify
                </button>
              </div>
            </div>

            { error &&
              <p className="error-message">{ error }</p>
            }
          </div>
        </section>
      </main>
    </Layout>
  )
}