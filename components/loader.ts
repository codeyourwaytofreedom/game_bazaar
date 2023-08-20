import { loadStripe,Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripePromise;
};

export default getStripe;