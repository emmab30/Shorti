import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head'
import NProgress from 'nprogress'
import Layout from '../../../components/Layout'
import * as Services from '../../../services'
import {
  message,
  Menu,
  Dropdown,
  Button
} from 'antd';
import Modali, { useModali } from 'modali';
import 'modali/dist/modali.css'; 
import { useRouter } from 'next/router'
import { Doughnut } from 'react-chartjs-2';

// Interval for polling
let intervalUpdate = null;
let missingSecondsInterval = null;
let nextRefreshAtSeconds = 10;

export default function Stats() {
  const router = useRouter();
  const hash = router.query.hash;
  const [link, setLink] = useState({ long_link: 'Loading..', short_link: 'Loading...' });
  const [isRefreshing, setRefreshing] = useState(false);
  const [nextRefreshAt, setNextRefreshAt] = useState(15);
  const [stats, setStats] = useState({
    visits: 0,
    social: {
      organic: 0,
      facebook: 0,
      twitter: 0
    }
  });

  const getStats = () => {
    // Enable auto refresh
    enableAutoRefresh();

    const hash = router.query.hash;

    NProgress.start();

    // setStats(null);
    setRefreshing(true);
    Services.LinkService.getStatsByHash(hash)
    .then((response) => {
      const { data } = response;
      if(data.success) {
        setStats(data.stats);
        setLink(data.link);
      }
    })
    .finally(() => {
      NProgress.done();
      setRefreshing(false);
    });
  }

  const handleCopyLink = (isForWhatsapp) => {
    const textField = document.createElement('textarea')
    textField.innerText = link.short_link
    if(isForWhatsapp == true)
      textField.innerText = `${link.short_link}/wp`

    document.body.appendChild(textField)
    if (window.navigator.platform === 'iPhone') {
      textField.setSelectionRange(0, 99999)
    } else {
      textField.select()
    }
    document.execCommand('copy')
    textField.remove()
    
    if(isForWhatsapp)
      message.success('Your link for WhatsApp has been copied to your clipboard. Start sharing it!');
    else
      message.success('Your link has been copied to your clipboard. Start sharing it!');
  }

  useEffect(() => {
    getStats();

    // Enable auto refresh
    enableAutoRefresh();
  }, [hash]);

  const enableAutoRefresh = () => {
    if(missingSecondsInterval){
      clearInterval(missingSecondsInterval);
      missingSecondsInterval = null;
    }

    if(!missingSecondsInterval) {
      nextRefreshAtSeconds = 10;
      setNextRefreshAt(nextRefreshAtSeconds);

      missingSecondsInterval = setInterval(() => {
        nextRefreshAtSeconds -= 1;
        setNextRefreshAt(nextRefreshAtSeconds);

        // Update!
        if(nextRefreshAtSeconds == 0)
          getStats();
      }, 1000);
    }
  }

  const menuCopyLink = (
    <Menu>
      <Menu.Item>
        <a onClick={() => handleCopyLink(false)} className="link">
          Copy your Link
        </a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => handleCopyLink(true)} className="whatsapp">
          Copy your link for WhatsApp
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <main>
        { stats != null &&
          <div className="stats text-center">

            {/* <h5 className="long-link" style={{ marginBottom: 50 }}>{ link.long_link }</h5> */}

            { link.short_link &&
              <section className="cta section got-link-container">
                <div className="cta-inner got-link" style={{ paddingTop: 0 }}>
                  <div className="cta-header text-center">
                    {/* <h4 className="section-title mt-0">Share the link with whoever you want</h4> */}
                    <a id="short_link" href={link.short_link} target="_blank">{ link.short_link }</a>

                    <div style={{ display: 'flex', flex: 0, flexDirection: 'row' }}>
                      <div className="cta-cta" style={{ marginTop: 0, display: 'flex', flex: 1, flexDirection: 'column', maxWidth: '90%', margin: '0 auto' }}>
                        <Dropdown overlay={menuCopyLink} placement="bottomCenter" arrow trigger={['click']}>
                          <button id="copy-button" className="button button-primary copy-button">
                            COPY LINK
                          </button>
                        </Dropdown>
                        <p style={{ fontSize: 12, marginTop: 10 }}>Copy your link and start sharing to increase your metrics / clicks.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            }

            <div className="row mb-2">
              <div className="col-12">
                <div className="d-flex flex-direction-row justify-content-center align-items-center">
                  <img style={{ maxWidth: 20, marginRight: 10 }} src="https://www.flaticon.com/svg/static/icons/svg/3208/3208743.svg" />
                  { !isRefreshing ?
                    <p className="w300" style={{ textAlign: 'center', margin: 0 }}>
                      Auto refresh in { nextRefreshAt } seconds..
                    </p>
                  :
                    <p className="w300" style={{ textAlign: 'center', margin: 0 }}>
                      Refreshing..
                    </p>
                  }
                </div>
              </div>
            </div>
            
            <div className="row" style={{ marginBottom: 20 }}>
              <div className="card col-12 col-md-6 col-xl-6 d-flex flex-direction-column" style={{ margin: '10px auto' }}>
                <div style={{ display: 'flex', flex : 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <h5 className="w500">Social Metrics</h5>
                  <p className="w400" style={{ margin: 0, fontSize: 12 }}>Everytime a user clicks on the link, this graph will be updated automatically.</p>
                </div>

                <div style={{ display: 'flex', flex : 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Doughnut
                    options={{
                      responsive: false
                    }}
                    data={{
                      labels: [
                        'Organic',
                        'Facebook',
                        'Twitter',
                        'WhatsApp'
                      ],
                      datasets: [{
                        data: [stats.social.organic, stats.social.facebook, stats.social.twitter, stats.social.whatsapp],
                        backgroundColor: [
                        '#e89505',
                        '#FF6384',
                        '#36A2EB',
                        '#009141'
                        ],
                        hoverBackgroundColor: [
                        '#ffa200',
                        '#FF6384',
                        '#36A2EB',
                        '#00c859',
                        ]
                      }]
                    }}
                  />
                </div>
              </div>

              <div className="card col-12 col-md-6 col-xl-6 d-flex flex-direction-column" style={{ margin: '10px auto' }}>
                <div style={{ display: 'flex', flex : 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <h5 className="w500">Clicks</h5>
                  <p className="w400" style={{ margin: 0, fontSize: 12 }}>This is the number of clicks your short link has.</p>
                </div>


                <div style={{ display: 'flex', flex : 1, justifyContent: 'center', alignItems: 'center'}}>
                  <h1 className="w900" style={{ color: '#535fd7', marginTop: 20, marginBottom: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    { stats.visits }
                    <img
                      onClick={getStats}
                      className="refresh-stats"
                      src={'https://www.flaticon.com/svg/static/icons/svg/44/44199.svg'}
                      style={{ maxWidth: 19, marginLeft: 10 }}
                    />
                  </h1>
                </div>
              </div>
            </div>
          </div>
        }
      </main>
    </Layout>
  )
}