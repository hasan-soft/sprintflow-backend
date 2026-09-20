import { z } from "zod";

const createSubtaskValidationSchema = z.object({
	body: z.object({
		taskId: z.string({ message: "Task ID is required" }),
		title: z
			.string({ message: "Title is required" })
			.min(1, "Title cannot be empty"),
	}),
});

export const SubtaskValidation = {
	createSubtaskValidationSchema,
};
