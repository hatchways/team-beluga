import React, { useState,useContext,useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { AlertContext } from '../../globals/AlertContext';
import { UserContext } from '../../globals/UserContext';


function stripeCheckoutHandler(result,email,alertContext) {

    if (result.error) {
        alertContext.setAlertStatus({
            isOpen:true,
            message:result.error.message,
            type:"error"
        })
    } else {
        fetch('/create-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({
                priceId: 'price_1IY2oXFSBPZAgVJdLwijjbRb',
                payment_method_id: result.paymentMethod.id,
                email: email
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
    const alertContext = useContext(AlertContext) 
    const userContext = useContext(UserContext)
    const user_id = userContext.userId
    const [email, setEmail] = useState("tofnag23@gmail.com")

    useEffect( ()=>{
        let status=200
        fetch(`/user/${user_id}/email`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials:"include"
            })
            .then((res) => {
                status = res.status
                if (status < 500)
                    return res.json()
                else throw Error("Server error");
            })
            .then((data) => {
                if (status === 200)
                    setEmail(data.email)
                else throw Error("User email not set");
            })
            .catch(err => {
                alertContext.setAlertStatus({
                    isOpen:true,
                    message:err.message,
                    type:"error"
                    })    
            });
    },[])

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
                email: email
            },
        });
        stripeCheckoutHandler(result,email,alertContext);
    };

    return (
            <form onSubmit={handleSubmit}>
                <Grid container direction="column" spacing={3}>
                    <Grid item xs={12}>
                        <CardSection />
                    </Grid>
                    <Grid container item xs={12} justify="flex-end">
                        <Button color="primary" type="submit" disabled={!stripe}>
                            Subscribe
                        </Button>
                    </Grid>
                </Grid>
            </form>
    );
}