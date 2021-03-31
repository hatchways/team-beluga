import React, { useContext } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { AlertContext } from '../../globals/AlertContext';
import { UserContext } from '../../globals/UserContext';
import { useHistory } from 'react-router-dom';


function stripeCheckoutHandler(result,email,alertContext,history,stripe,userContext) {

    if (result.error) {
        alertContext.setAlertStatus({
            isOpen:true,
            message:result.error.message,
            type:"error"
        })
    } else {
        let status = 200
        fetch('/create-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({
                priceId: 'price_1IY2oXFSBPZAgVJdLwijjbRb',
                payment_method_id: result.paymentMethod.id,
                email: email
            })
        })
        .then( res=> {
                status = res.status
                if (status < 500)
                    return res.json()
                throw Error("Server error")
        })
        .then(data => {
            if (!data.success)
                throw Error(data.message)
            
            // Check initial payment status
            if (data.status === 'requires_action') {
                stripe.confirmCardPayment(data.client_secret).then(res=>{
                    if (result.error) {
                        alertContext.setAlertStatus({
                            isOpen:true,
                            message:"The card was declined",
                            type:"error"
                            })    
                    }
                })
                return history.push("/upgrade")
            }

            alertContext.setAlertStatus({
                isOpen:true,
                message:"Successfully subscribed",
                type:"success"
                })    
            
            userContext.setIsSubscribed(true)
            
            return history.push("/")
        })
        .catch(err => {
            alertContext.setAlertStatus({
                isOpen:true,
                message:err.message,
                type:"error"
                })    
        });
    }
}

export default function CheckoutForm({email}) {
    const stripe = useStripe();
    const elements = useElements();
    const alertContext = useContext(AlertContext) 
    const userContext = useContext(UserContext)
    const history = useHistory();

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
        stripeCheckoutHandler(result,email,alertContext,history,stripe,userContext);
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