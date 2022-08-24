import PropTypes from 'prop-types';
import Header from './Header';

export default function Page({ children }) {
  const styleObj = {
    display: 'inline-block',
    margin: '16px',
    fontSize: '36px',
  };
  return (
    <div>
      <Header />
      <h2>I am the Page component! LFG!</h2>
      {children}
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
