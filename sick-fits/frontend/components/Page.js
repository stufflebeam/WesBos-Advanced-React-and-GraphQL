import PropTypes from 'prop-types';

export default function Page({ children }) {
  const styleObj = {
    display: 'inline-block',
    margin: '16px',
    fontSize: '36px',
  };
  return (
    <div>
      <h2>I am the Page component! LFG!</h2>
      <ul style={styleObj}>
        <li style={styleObj}>
          <a href="/">Index</a>
        </li>
        <li style={styleObj}>
          <a href="/account">Account</a>
        </li>
        <li style={styleObj}>
          <a href="/orders">Orders</a>
        </li>
        <li style={styleObj}>
          <a href="/products">Products</a>
        </li>
        <li style={styleObj}>
          <a href="/sell">Sell</a>
        </li>
      </ul>
      {children}
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
