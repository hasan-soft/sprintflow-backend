import type { SubscriptionPlan } from "../../../generated/prisma/client";

export interface IInitiatePaymentPayload {
	organizationId: string;
	plan: SubscriptionPlan;
}
