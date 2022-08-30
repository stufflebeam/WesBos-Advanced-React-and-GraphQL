import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        {/* TODO: Add an option to manually paste in a password reset token, in case someone needs to copy
                  the token from the email on their Apple watch or some other situation like that.
                  [ ] Determine if this is a terrible idea for some reason.
                      - It's my inclination to think that it is not, as any malicious actor could certainly
                        just try any tokens they'd try via a form field using a query parameter in the URL.
                        But, I would still like to make sure that I don't have some sort of glaring blind
                        spot on this before adding the functionality to the application. */}
        {/* <p>Sorry! No reset token provided</p> */}
        <RequestReset />
      </div>
    );
  }
  return <Reset token={query.token} />;
}
