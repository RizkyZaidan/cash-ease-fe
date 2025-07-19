// pages/_app.js
import Head from 'next/head';
import '../globals.css';

export default function Headers() {
  return (
    <>
      <Head>
        <title>Cash Ease</title>
        <meta name="description" content="Dorong Transaksimu Secara Cermat, Cepat dan Tepat." />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
    </>
  )
}
