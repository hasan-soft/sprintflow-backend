import type { Prisma, TaskStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { ICreateTaskPayload, ITaskFilterQuery } from "./task.interface";

const createTask = async (payload: ICreateTaskPayload) => {
	const task = await prisma.task.create({
		data: {
			...payload,
			dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
		},
		include: {
			project: true,
			assignee: true,
		},
	});
	return task;
};

const getAllTasks = async (query: ITaskFilterQuery) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const { priority, status, assigneeId, projectId, sprintId, searchTerm } =
		query;

	const whereConditions: Prisma.TaskWhereInput = { isDeleted: false };

	if (priority) whereConditions.priority = priority;
	if (status) whereConditions.status = status;
	if (assigneeId) whereConditions.assigneeId = assigneeId;
	if (projectId) whereConditions.projectId = projectId;
	if (sprintId) whereConditions.sprintId = sprintId;

	if (searchTerm) {
		whereConditions.OR = [
			{ title: { contains: searchTerm, mode: "insensitive" } },
			{ description: { contains: searchTerm, mode: "insensitive" } },
		];
	}

	const result = await prisma.task.findMany({
		where: whereConditions,
		skip,
		take: limit,
		orderBy: { createdAt: "desc" },
		include: {
			assignee: true,
			project: true,
			subtasks: true,
		},
	});

	const total = await prisma.task.count({ where: whereConditions });

	return {
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		data: result,
	};
};

const updateTaskStatus = async (id: string, status: TaskStatus) => {
	const isTaskExist = await prisma.task.findFirst({
		where: { id, isDeleted: false },
	});

	if (!isTaskExist) {
		throw new Error("Task not found");
	}

	return await prisma.task.update({
		where: { id },
		data: { status },
	});
};

const softDeleteTask = async (id: string) => {
	const isTaskExist = await prisma.task.findFirst({
		where: { id, isDeleted: false },
	});

	if (!isTaskExist) {
		throw new Error("Task not found");
	}

	return await prisma.task.update({
		where: { id },
		data: { isDeleted: true, deletedAt: new Date() },
	});
};

export const TaskService = {
	createTask,
	getAllTasks,
	updateTaskStatus,
	softDeleteTask,
};
