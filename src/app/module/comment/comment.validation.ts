import { z } from "zod";

const createCommentValidationSchema = z.object({
	body: z.object({
		content: z
			.string({ message: "Content is required" })
			.min(1, "Comment cannot be empty"),
		taskId: z.string({ message: "Task ID is required" }),
	}),
});

export const CommentValidation = {
	createCommentValidationSchema,
};
