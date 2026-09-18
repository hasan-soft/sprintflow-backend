import Stripe from "stripe";
import type { SubscriptionPlan } from "../../../generated/prisma/client";
import {
	PaymentGateway,
	PaymentStatus,
} from "../../../generated/prisma/client";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import type { IInitiatePaymentPayload } from "./payment.interface";

const stripe = new Stripe(
	(config.stripe_api_secret as string) || "sk_test_mock_key",
);

const initiatePayment = async (payload: IInitiatePaymentPayload) => {
	const { organizationId, plan } = payload;

	const organization = await prisma.organization.findUnique({
		where: { id: organizationId },
	});

	if (!organization) {
		throw new Error("Organization not found");
	}

	const planPrices: Record<SubscriptionPlan, number> = {
		FREE: 0,
		PRO: 29,
		ENTERPRISE: 99,
	};

	const amount = planPrices[plan];

	if (amount === 0) {
		throw new Error("Cannot initiate payment for FREE plan");
	}

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		mode: "payment",
		customer_email: "customer@example.com",
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: `${plan} Plan Subscription`,
						description: `Subscription upgrade for ${organization.name}`,
					},
					unit_amount: amount * 100,
				},
				quantity: 1,
			},
		],
		success_url: `${config.client_url || "http://localhost:3000"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${config.client_url || "http://localhost:3000"}/payment/cancel`,
		metadata: {
			organizationId,
			plan,
		},
	});

	await prisma.subscription.create({
		data: {
			organizationId,
			plan,
			amount,
			status: PaymentStatus.PENDING,
			gateway: PaymentGateway.STRIPE,
			transactionId: session.id,
		},
	});

	return { checkoutUrl: session.url, sessionId: session.id };
};

const confirmPayment = async (sessionId: string) => {
	const subscription = await prisma.subscription.findFirst({
		where: { transactionId: sessionId },
	});

	if (!subscription) {
		throw new Error("Subscription record not found");
	}

	const result = await prisma.$transaction(async (tx) => {
		const updatedSub = await tx.subscription.update({
			where: { id: subscription.id },
			data: { status: PaymentStatus.COMPLETED },
		});

		await tx.organization.update({
			where: { id: subscription.organizationId },
			data: { plan: subscription.plan },
		});

		return updatedSub;
	});

	return result;
};

export const PaymentService = {
	initiatePayment,
	confirmPayment,
};
