/**
* Use the CSS tab above to style your Element's container.
*/
import React from 'react';
import {CardElement} from '@stripe/react-stripe-js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    border: "1px solid #ccc",
    padding:10
  }
}));

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Roboto',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
      height:"100%"
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};


function CardSection() {

  const classes = useStyles()
  return (
    <div className={classes.card}>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </div>
  );
};
export default CardSection;