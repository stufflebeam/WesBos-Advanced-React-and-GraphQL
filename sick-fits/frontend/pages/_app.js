import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';
import Page from '../components/Page';

// import 'nprogress/nprogress.css'; // Official NProgress progress bar style
import '../components/styles/nprogress.css'; // Our own custom NProgress progress bar style

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

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
