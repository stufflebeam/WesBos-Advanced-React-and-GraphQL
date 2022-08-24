import Form from '../components/styles/Form';

export default function IndexPage() {
  const handleClick = (e) => {
    e.preventDefault();
    console.log('[Index] Form submitted: ', e.target);
  };
  return (
    <>
      <h1>Hello World</h1>
      <p>This is a simple example of a React component.</p>
      <Form onSubmit={handleClick}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
        <button type="submit">Submit</button>
      </Form>
    </>
  );
}
