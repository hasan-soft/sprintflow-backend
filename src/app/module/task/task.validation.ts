import { z } from "zod";
import { Priority, TaskStatus } from "../../../generated/prisma/client";

const createTaskValidationSchema = z.object({
	body: z.object({
		title: z.string({ message: "Title is required" }),
		description: z.string().optional(),
		projectId: z.string({ message: "Project ID is required" }),
		sprintId: z.string().optional(),
		assigneeId: z.string().optional(),
		priority: z
			.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.URGENT])
			.optional(),
		dueDate: z.string().optional(),
	}),
});

const updateTaskStatusValidationSchema = z.object({
	body: z.object({
		status: z.enum([
			TaskStatus.TODO,
			TaskStatus.IN_PROGRESS,
			TaskStatus.IN_REVIEW,
			TaskStatus.DONE,
			TaskStatus.BLOCKED,
		]),
	}),
});

const updateTaskValidationSchema = z.object({
	body: z.object({
		title: z.string().min(1, "Title is required").optional(),
		description: z.string().optional(),
		priority: z
			.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.URGENT])
			.optional(),
		sprintId: z.string().uuid().optional().nullable(),
	}),
});

const assignTaskValidationSchema = z.object({
	body: z.object({
		assigneeId: z.string().uuid("Invalid assignee ID"),
	}),
});

export const TaskValidation = {
	createTaskValidationSchema,
	updateTaskStatusValidationSchema,
	updateTaskValidationSchema,
	assignTaskValidationSchema,
};
