import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51IXw8jFSBPZAgVJd88jZ2iO1HikQ8m0ES4ugRNS73as3xGAJmhwxkrtOoXXSNNR53VmMJDHbygEFTUZw0v0HgyPb00KnZmyygb');

function StripeCheckout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeCheckout;