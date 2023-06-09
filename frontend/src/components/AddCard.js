import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import {useNavigate} from "react-router-dom"

const AddCard = () => {

    const navigate=useNavigate()
  const [customerId, setCustomerId] = useState();

  console.log(customerId, 'customerId');

  useEffect(() => {
    axios
      .get('http://localhost:3000/get-customer')
      .then((res) => {
        console.log('res ');
        console.log(res.data[0]);
        setCustomerId(res.data[0].idcustomer);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
      setErrorMessage('Error adding card. Please try again.');
    } else {
      console.log('customerId', customerId);
      const body = {
        customerId: customerId,
        paymentMethodId: paymentMethod.id,
      };
      axios.post('http://localhost:3000/add-card', body).then(()=>{
        navigate("/payment")
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement   />
      <button type="submit">Add Card</button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default AddCard;
