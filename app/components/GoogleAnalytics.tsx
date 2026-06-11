'use client';

import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NXSPSN27';
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-9ZS27TJ3ZJ';

export function GoogleAnalytics() {
    return (
        <>
            <Script
                id="gtag-src"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    // Consent Mode v2: everything denied until the visitor chooses.
                    // Google still receives cookieless pings for modeling; no cookies
                    // are written and no identifiers stored while denied.
                    gtag('consent', 'default', {
                        analytics_storage: 'denied',
                        ad_storage: 'denied',
                        ad_user_data: 'denied',
                        ad_personalization: 'denied'
                    });
                    // Returning visitors who already accepted: restore before config.
                    try {
                        if (localStorage.getItem('sf_cookie_consent') === 'granted') {
                            gtag('consent', 'update', {
                                analytics_storage: 'granted',
                                ad_storage: 'granted',
                                ad_user_data: 'granted',
                                ad_personalization: 'granted'
                            });
                        }
                    } catch (e) {}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
                `}
            </Script>
            <Script id="gtm-init" strategy="lazyOnload">
                {`
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
                    var firstScript = document.getElementsByTagName('script')[0];
                    var gtmScript = document.createElement('script');
                    gtmScript.async = true;
                    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';
                    firstScript.parentNode.insertBefore(gtmScript, firstScript);
                `}
            </Script>
        </>
    );
}

export function GTMNoScript() {
    return (
        <noscript>
            <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
            />
        </noscript>
    );
}
