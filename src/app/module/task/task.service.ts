import type {
	Prisma,
	Priority,
	TaskStatus,
} from "../../../generated/prisma/client";
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

// Get Single Task
const getSingleTask = async (taskId: string) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			isDeleted: false,
		},
		include: {
			project: {
				select: {
					id: true,
					name: true,
				},
			},
			sprint: {
				select: {
					id: true,
					name: true,
					status: true,
				},
			},
			assignee: {
				select: {
					id: true,
					name: true,
					email: true,
					profileImg: true,
				},
			},
			subtasks: true,
			comments: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							profileImg: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			},
			activities: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	if (!task) {
		throw new Error("Task not found");
	}

	return task;
};

// Update Task
const updateTask = async (
	taskId: string,
	payload: {
		title?: string;
		description?: string;
		priority?: Priority;
		sprintId?: string | null;
	},
	userId: string,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			isDeleted: false,
		},
	});

	if (!task) {
		throw new Error("Task not found");
	}

	if (payload.sprintId) {
		const sprint = await prisma.sprint.findUnique({
			where: { id: payload.sprintId },
		});
		if (!sprint) {
			throw new Error("Sprint not found");
		}
	}

	const updatedTask = await prisma.$transaction(async (tx) => {
		const updated = await tx.task.update({
			where: { id: taskId },
			data: {
				...(payload.title && { title: payload.title }),
				...(payload.description && { description: payload.description }),
				...(payload.priority && { priority: payload.priority }),
				...(payload.sprintId !== undefined && { sprintId: payload.sprintId }),
				updatedAt: new Date(),
			},
			include: {
				project: true,
				sprint: true,
				assignee: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		await tx.activityLog.create({
			data: {
				taskId: taskId,
				userId: userId,
				action: "Task Updated",
				details: JSON.stringify({ changes: payload }),
			},
		});

		return updated;
	});

	return updatedTask;
};

// Get My Assigned Tasks
const getMyAssignedTasks = async (userId: string) => {
	const tasks = await prisma.task.findMany({
		where: {
			assigneeId: userId,
			isDeleted: false,
		},
		include: {
			project: {
				select: {
					id: true,
					name: true,
				},
			},
			sprint: {
				select: {
					id: true,
					name: true,
					status: true,
				},
			},
			assignee: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			subtasks: true,
			comments: {
				select: {
					id: true,
					createdAt: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return tasks;
};

// Assign Task
const assignTask = async (
	taskId: string,
	assigneeId: string,
	assignedById: string,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			isDeleted: false,
		},
	});

	if (!task) {
		throw new Error("Task not found");
	}

	const user = await prisma.user.findUnique({
		where: { id: assigneeId },
	});

	if (!user) {
		throw new Error("User not found");
	}

	const assignedTask = await prisma.$transaction(async (tx) => {
		const updated = await tx.task.update({
			where: { id: taskId },
			data: {
				assigneeId: assigneeId,
				updatedAt: new Date(),
			},
			include: {
				project: true,
				assignee: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		await tx.activityLog.create({
			data: {
				taskId: taskId,
				userId: assignedById,
				action: "Task Assigned",
				details: JSON.stringify({
					assignedTo: user.name,
					assignedToId: assigneeId,
				}),
			},
		});

		return updated;
	});

	return assignedTask;
};

// Unassign Task
const unassignTask = async (taskId: string, unassignedById: string) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			isDeleted: false,
		},
	});

	if (!task) {
		throw new Error("Task not found");
	}

	const unassignedTask = await prisma.$transaction(async (tx) => {
		const updated = await tx.task.update({
			where: { id: taskId },
			data: {
				assigneeId: null,
				updatedAt: new Date(),
			},
			include: {
				project: true,
				assignee: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		await tx.activityLog.create({
			data: {
				taskId: taskId,
				userId: unassignedById,
				action: "Task Unassigned",
				details: null,
			},
		});

		return updated;
	});

	return unassignedTask;
};

export const TaskService = {
	createTask,
	getAllTasks,
	updateTaskStatus,
	softDeleteTask,
	getSingleTask,
	updateTask,
	getMyAssignedTasks,
	assignTask,
	unassignTask,
};
