import type { Priority, TaskStatus } from "../../../generated/prisma/client";

export interface ICreateTaskPayload {
	title: string;
	description?: string;
	projectId: string;
	sprintId?: string;
	assigneeId?: string;
	priority?: Priority;
	dueDate?: string;
}

export interface ITaskFilterQuery {
	page?: string;
	limit?: string;
	priority?: Priority;
	status?: TaskStatus;
	assigneeId?: string;
	projectId?: string;
	sprintId?: string;
	searchTerm?: string;
}

export interface IUpdateTaskStatusPayload {
	status: TaskStatus;
}
