import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type Stripe from "stripe";
import { stripe } from "$lib/server/stripe";
import { ENV } from "$lib/server/env";
import logger from 'firebase-functions/logger';
import { deleteProductRecord, upsertProductRecord } from "$lib/server/products";
import { insertSubscriptionRecord } from "$lib/server/subscriptions";

export const POST: RequestHandler = async (event) => {
  const stripeSignature = event.request.headers.get("stripe-signature");

  if (!stripeSignature) {
    return json("Unauthorized", { status: 401 });
  }

  const body = await event.request.text();

  let stripeEvent: Stripe.DiscriminatedEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      ENV.STRIPE_SIGNING_SECRET
    ) as Stripe.DiscriminatedEvent;
  } catch (e) {
    return json("Invalid signature", { status: 401 });
  }

  try {
    switch (stripeEvent.type) {
      case "product.created":
      case "product.updated":
        await upsertProductRecord(stripeEvent.data.object);
        break;
      case "product.deleted":
        await deleteProductRecord(stripeEvent.data.object);
        break;
      case "customer.subscription.created":
        await insertSubscriptionRecord(stripeEvent.data.object);
        break;
      case "customer.deleted":
      case "customer.subscription.deleted":
      case "customer.subscription.trial_will_end":
      case "customer.subscription.updated":
      case "customer.updated":
      default:
        break;
    }
  } catch (error) {
    console.error(`Error processing event ${stripeEvent.type} - ${error}`);
    logger.error(`Error processing event ${stripeEvent.type} - ${error}`);
    return json(`Error processing event ${stripeEvent.type}`, { status: 500 });
  }

  return json({ received: true }, { status: 200 });
};

