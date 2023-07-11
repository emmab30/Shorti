import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head'
import NProgress from 'nprogress'
import Layout from '../components/Layout'
import * as Services from '../services'
import {
  message
} from 'antd';
import { useRouter } from 'next/router';

let SECONDS_LANDING = 5;

export default function Ads() {
  const router = useRouter();
  const [allowContinue, setAllowContinue] = React.useState(false);
  const [seconds, setSeconds] = React.useState(15);

  useEffect(() => {
    let interval = setInterval(() => {
      SECONDS_LANDING -= 1;
      setSeconds(SECONDS_LANDING);

      if(SECONDS_LANDING <= 0) {
        clearInterval(interval);
        setAllowContinue(true);
      }
    }, 1 * 1000);
  }, []);

  const onContinue = () => {
    if(allowContinue) {
      const redirectTo = router.query.redirect_to;
      if(redirectTo) {
        if(redirectTo.indexOf('http') > -1) {
          window.location.href = redirectTo;
        } else {
          window.location.href = `https://${redirectTo}`;
        }
      }
    }
  }

  return (
    <Layout>
      <Head>
        <script type="text/javascript" src="https://uprimp.com/bnr.php?section=General&pub=223899&format=468x60&ga=g"></script>
        <script type="text/javascript" src="https://uprimp.com/slider.php?section=General&pub=223899&ga=g&side=right"></script>
      </Head>
      <main>
        <p style={{ textAlign: 'center', color: 'rgba(0,0,0,.25)' }}>Publicidad</p>
        <section className="hero" style={{ paddingTop: 50, paddingBottom: 50 }}>
          <div style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div className="container-login100-form-btn">
              <button disabled={!allowContinue} onClick={onContinue} className="login100-form-btn simplify" style={{ borderRadius: 5}}>
                Continuar al sitio
              </button>
            </div>

            { !allowContinue &&
              <h5 style={{ margin : 0 }}>Espera { SECONDS_LANDING } segundos..</h5>
            }
          </div>
        </section>
      </main>
    </Layout>
  )
}