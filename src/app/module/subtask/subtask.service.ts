import { prisma } from "../../lib/prisma";
import type { ICreateSubtaskPayload } from "./subtask.interface";

const createSubtask = async (payload: ICreateSubtaskPayload) => {
	const task = await prisma.task.findFirst({
		where: { id: payload.taskId, isDeleted: false },
	});

	if (!task) {
		throw new Error("Task not found");
	}

	return await prisma.subtask.create({
		data: { taskId: payload.taskId, title: payload.title },
	});
};

const getSubtasksByTask = async (taskId: string) => {
	return await prisma.subtask.findMany({
		where: { taskId },
		orderBy: { createdAt: "asc" },
	});
};

const toggleSubtask = async (id: string) => {
	const subtask = await prisma.subtask.findUnique({ where: { id } });

	if (!subtask) {
		throw new Error("Subtask not found");
	}

	return await prisma.subtask.update({
		where: { id },
		data: { isDone: !subtask.isDone },
	});
};

const deleteSubtask = async (id: string) => {
	const subtask = await prisma.subtask.findUnique({ where: { id } });

	if (!subtask) {
		throw new Error("Subtask not found");
	}

	return await prisma.subtask.delete({ where: { id } });
};

export const SubtaskService = {
	createSubtask,
	getSubtasksByTask,
	toggleSubtask,
	deleteSubtask,
};
