import PropTypes from 'prop-types';
import Page from '../components/Page';

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      {/* <Head>
        <title>My App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <header>
        {/* <Nav /> */} <div>This is a header...</div>
      </header>
      <Page>
        <Component {...pageProps} />
      </Page>
      <footer>
        <small>&copy; {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};
