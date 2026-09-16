import { z } from "zod";
import { ProjectStatus } from "../../../generated/prisma/client";

const createProjectValidationSchema = z.object({
	body: z.object({
		name: z
			.string({ message: "Project name is required" })
			.min(2, "Name must be at least 2 characters"),
		description: z.string().optional(),
		organizationId: z.string({ message: "Organization ID is required" }),
		status: z
			.enum([
				ProjectStatus.PLANNED,
				ProjectStatus.ACTIVE,
				ProjectStatus.ON_HOLD,
				ProjectStatus.COMPLETED,
				ProjectStatus.ARCHIVED,
			])
			.optional(),
	}),
});

const updateProjectValidationSchema = z.object({
	body: z.object({
		name: z.string().min(2).optional(),
		description: z.string().optional(),
		status: z
			.enum([
				ProjectStatus.PLANNED,
				ProjectStatus.ACTIVE,
				ProjectStatus.ON_HOLD,
				ProjectStatus.COMPLETED,
				ProjectStatus.ARCHIVED,
			])
			.optional(),
	}),
});

export const ProjectValidation = {
	createProjectValidationSchema,
	updateProjectValidationSchema,
};
