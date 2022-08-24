import Page from '../components/Page';

export default function OrdersPage() {
  return (
    <Page
      style={{
        background: '#000',
        color: 'lightblue',
        height: '100vh',
        width: '100vw',
        margin: '0',
        padding: '40px',
        top: '0',
        left: '0',
        position: 'absolute',
      }}
    >
      <h1>Orders</h1>
      <p>This is where you'll manage your orders.</p>
    </Page>
  );
}
