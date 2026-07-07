import Stripe from "stripe";

/** Stripe client — only instantiated when a secret key is present. */
const key = process.env.STRIPE_SECRET_KEY;

// Use the SDK's pinned API version to stay in lockstep with the types.
export const stripe = key ? new Stripe(key) : null;

export const isStripeEnabled = Boolean(key);
