import { prisma } from "../../lib/prisma";
import type { ICreateCommentPayload } from "./comment.interface";

const createComment = async (payload: ICreateCommentPayload) => {
	const isTaskExist = await prisma.task.findFirst({
		where: { id: payload.taskId, isDeleted: false },
	});

	if (!isTaskExist) {
		throw new Error("Task not found");
	}

	const comment = await prisma.comment.create({
		data: {
			content: payload.content,
			taskId: payload.taskId,
			userId: payload.userId,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});

	return comment;
};

const getTaskComments = async (taskId: string) => {
	const comments = await prisma.comment.findMany({
		where: { taskId },
		orderBy: { createdAt: "desc" },
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});

	return comments;
};

export const CommentService = {
	createComment,
	getTaskComments,
};
