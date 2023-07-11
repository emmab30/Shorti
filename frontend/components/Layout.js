import React from 'react';
import Modali, { useModali } from 'modali';
import 'modali/dist/modali.css'; 

const Layout = ({ children }) => {

    const [devModal, toggleDevModal] = useModali({
        animated: true
    });
    const devJSON = JSON.stringify({
        long_link: '<link>'
    });

    return (
        <div className="container-fluid p-0 main-layout d-flex flex-column">

            <header className="site-header">
                <div className="container">
                <div className="site-header-inner">
                    <div style={{ cursor: 'pointer' }} className="brand header-brand" onClick={() => {
                        window.location.href = '/';
                    }}>
                        <img className="header-logo-image asset-light" src="/logo.png" alt="Logo" />
                    </div>
                </div>
                </div>
            </header>
            
            { children }

            <footer className="site-footer has-top-divider">
                <div className="container">
                <div className="site-footer-inner">
                    <div className="brand footer-brand">
                    <a href="/">
                        <img className="asset-light" src="/logo.png" alt="Logo" style={{maxWidth: '40px'}} />
                    </a>
                    </div>
                    <ul className="footer-links list-reset">
                    <li>
                        <a onClick={toggleDevModal}>Developers</a>
                    </li>
                    <li>
                        <a href="mailto:shorti.iolinks@gmail.com">Contact</a>
                    </li>
                    </ul>
                    <ul className="footer-social-links list-reset">
                    <li>
                        <a target="_blank" href="https://www.facebook.com/shorti.links">
                        <span className="screen-reader-text">Facebook</span>
                        <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z" fill="#FFF" />
                        </svg>
                        </a>
                    </li>
                    </ul>
                    <div className="footer-copyright">© 2020 Shorti, all rights reserved</div>
                </div>
                </div>
            </footer>

            <Modali.Modal {...devModal}>
                <div style={{ padding: 10 }}>
                    <p style={{ fontWeight: 800 }}>To make your links through our API, you need to send a request as following:</p>

                    <div>
                        <p style={{ fontWeight: 200 }}>Endpoint: <a href="https://shorti.io/api/v1/links/generate" style={{ fontWeight: 'bold' }}>https://shorti.io/api/v1/links/generate</a></p>
                        <p style={{ fontWeight: 200 }}>Method: <span style={{ color: '#535fd7', fontWeight: 'bold' }}>POST</span></p>
                        <p style={{ fontWeight: 200 }}>Content Type: <span style={{ color: '#535fd7', fontWeight: 'bold' }}>application/json</span></p>
                        <p style={{ fontWeight: 200 }}>Body: </p>
                        <pre>{devJSON}</pre>
                    </div>
                </div>
            </Modali.Modal>
        </div>
    );
}

export default Layout;