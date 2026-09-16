import { z } from "zod";
import { SprintStatus } from "../../../generated/prisma/client";

const createSprintValidationSchema = z.object({
	body: z.object({
		name: z.string({ message: "Sprint name is required" }),
		projectId: z.string({ message: "Project ID is required" }),
		startDate: z.string({ message: "Start date is required" }),
		endDate: z.string({ message: "End date is required" }),
		status: z
			.enum([
				SprintStatus.UPCOMING,
				SprintStatus.ACTIVE,
				SprintStatus.COMPLETED,
			])
			.optional(),
	}),
});

const updateSprintStatusValidationSchema = z.object({
	body: z.object({
		status: z.enum(
			[SprintStatus.UPCOMING, SprintStatus.ACTIVE, SprintStatus.COMPLETED],
			{
				message: "Invalid status value",
			},
		),
	}),
});

export const SprintValidation = {
	createSprintValidationSchema,
	updateSprintStatusValidationSchema,
};
