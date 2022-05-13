import Head from 'next/head';
import UserContextProvider from '../context/UserContext';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Wise Trade</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
          integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
          crossOrigin="anonymous"
          referrerpolicy="no-referrer"
        />
      </Head>
      <UserContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </>
  );
}

export default MyApp;
