import Script from 'next/script'

export default function GoogleAnalyticsDeprecated({ TAG_ID = 'G-0M61BY9GR2' }) {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`} strategy='lazyOnload' />
      <Script id='google-analytics' strategy='lazyOnload'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${TAG_ID}');
        `}
      </Script>
    </>
  )
}
