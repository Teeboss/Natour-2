/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

export const bookTour = async (tourId) => {
  // 1) Get checkout session from API
  try {
    const session = await axios(
      `http://127.0.0.1:5000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
