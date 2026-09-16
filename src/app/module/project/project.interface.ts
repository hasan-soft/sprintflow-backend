import type { ProjectStatus } from "../../../generated/prisma/client";

export interface ICreateProjectPayload {
	name: string;
	description?: string;
	organizationId: string;
	status?: ProjectStatus;
}

export interface IUpdateProjectPayload {
	name?: string;
	description?: string;
	status?: ProjectStatus;
}

export interface IProjectFilterQuery {
	page?: string;
	limit?: string;
	status?: ProjectStatus;
	searchTerm?: string;
}
