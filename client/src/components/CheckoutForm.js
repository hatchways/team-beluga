import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';


function stripeCheckoutHandler(result) {
    if (result.error) {

    } else {
        fetch('/create-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: 'price_1IY2oXFSBPZAgVJdLwijjbRb',
                payment_method_id: result.paymentMethod.id,
                email: 'testemail@email.com'
            })
        }).then(function (result) {
            // Handle server response (see Step 4)
            result.json().then(function (json) {
                //handleServerResponse(json);
            })
        });
    }
}

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

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
                name: name,
                email: email
            },
        });
        stripeCheckoutHandler(result);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardSection />
            <button type="submit" disabled={!stripe}>
                Subscribe
            </button>
        </form>
    );
}