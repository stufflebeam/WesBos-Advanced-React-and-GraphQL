import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import nProgress from 'nprogress';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useCart } from '../lib/cartState';
import SickButton from './styles/SickButton';
import DisplayError from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;

  // This is styling for any error messages that show up inside the Stripe CardElement
  // see the TODO in the ErrorMessage component for more info about the ideal way to
  // eliminate the need for this sort of custom styling.
  p[data-test='graphql-error'] {
    font-size: 16px !important;
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();

  // We don't have the token variable yet (at time of definition), so we can't pass it in here
  // Instead, we'll pass it in when we call the function
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  async function handleSubmit(e) {
    // 1. Stop the form from submitting and turn the loader on
    e.preventDefault();
    setLoading(true);
    // console.log('We gotta do some work...');
    // 2. Start the page transition
    nProgress.start();
    // 3. Create the payment method via Stripe (Token comes back here if successful)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     setError(err);
    //   });
    console.log('[Checkout]', { error, paymentMethod });
    // 4. Handle any errors from Stripe
    if (error) {
      setError(error);
      nProgress.done();
      return; // stops the checkout from happening
    }
    // 5. Send the token from step 3 to our Keystone server, via a custom mutation!
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });
    console.log('[Checkout] Finished with the order:', order);

    // 6. Change the page to view the order

    router.push({
      pathname: `/order/[id]`,
      query: { id: order.data.checkout.id },
      // The following (original) syntax worked as expected for me, but I am switching to the version
      // used in the video (for now), in order to keep things consistent with the rest of the course code.
      // query: { id: order.data.checkout.id },
    });

    // 7. Close the cart (if the payment was successful)

    closeCart();

    // 8. Turn the loader off
    setLoading(false);
    nProgress.done();
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <DisplayError error={error} />}
      {graphQLError && <DisplayError error={graphQLError} />}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export { Checkout };
