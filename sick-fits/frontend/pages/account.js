import Page from '../components/Page';

export default function AccountPage() {
  return (
    <Page
      style={{
        background: '#000',
        color: 'orange',
        height: '100vh',
        width: '100vw',
        margin: '0',
        padding: '40px',
        top: '0',
        left: '0',
        position: 'absolute',
      }}
    >
      <h1>Account</h1>
      <p>Manage your account</p>
    </Page>
  );
}
