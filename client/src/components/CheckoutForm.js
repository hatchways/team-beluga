import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

import CardSection from './CardSection';

function stripePaymentMethodHandler(result) {
    if (result.error) {
        // Show error in payment form
    } else {
        // Otherwise send paymentMethod.id to your server (see Step 4)
        fetch('/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                payment_method_id: result.paymentMethod.id,
            })
        }).then(function (result) {
            // Handle server response (see Step 4)
            result.json().then(function (json) {
                //handleServerResponse(json);
                console.log(json);
            })
        });
    }
}

function stripeCheckoutHandler(result) {
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            priceId: 'price_1IY2oXFSBPZAgVJdLwijjbRb',
            payment_method_id: result.paymentMethod.id
        })
    }).then(function (result) {
        // Handle server response (see Step 4)
        result.json().then(function (json) {
            //handleServerResponse(json);
            console.log(json);
        })
    });
}

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
            billing_details: {
                // Include any additional collected billing details.
                name: 'Jenny Rosen',
            },
        });
        console.log(result);
        //stripePaymentMethodHandler(result);
        stripeCheckoutHandler(result);
    };    


    return (
        <form onSubmit={handleSubmit}>
            <CardSection />
            <button type="submit" disabled={!stripe}>
                Submit Payment
      </button>
        </form>
    );
}