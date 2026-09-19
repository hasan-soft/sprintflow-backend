import type { Prisma, ProjectStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type {
	ICreateProjectPayload,
	IProjectFilterQuery,
	IUpdateProjectPayload,
} from "./project.interface";

const createProject = async (payload: ICreateProjectPayload) => {
	return await prisma.$transaction(async (tx) => {
		// Create Project
		const project = await tx.project.create({
			data: {
				name: payload.name,
				description: payload.description,
				organizationId: payload.organizationId,
				status: (payload.status || "ACTIVE") as ProjectStatus,
			},
			include: {
				organization: true,
			},
		});
		await tx.sprint.create({
			data: {
				name: `${payload.name} - Sprint 1`,
				projectId: project.id,
				startDate: new Date(),
				endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
			},
		});

		return project;
	});
};

const getAllProjects = async (query: IProjectFilterQuery) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const { status, searchTerm } = query;

	const whereConditions: Prisma.ProjectWhereInput = {
		isDeleted: false,
	};

	if (status) {
		whereConditions.status = status;
	}

	if (searchTerm) {
		whereConditions.OR = [
			{ name: { contains: searchTerm, mode: "insensitive" } },
			{ description: { contains: searchTerm, mode: "insensitive" } },
		];
	}

	const result = await prisma.project.findMany({
		where: whereConditions,
		skip,
		take: limit,
		orderBy: { createdAt: "desc" },
		include: {
			organization: true,
			_count: {
				select: { tasks: true, sprints: true },
			},
		},
	});

	const total = await prisma.project.count({ where: whereConditions });

	return {
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
		data: result,
	};
};

const getSingleProject = async (id: string) => {
	const project = await prisma.project.findFirst({
		where: { id, isDeleted: false },
		include: {
			sprints: true,
			tasks: { where: { isDeleted: false } },
			organization: true,
		},
	});

	if (!project) {
		throw new Error("Project not found");
	}

	return project;
};

const updateProject = async (id: string, payload: IUpdateProjectPayload) => {
	const isProjectExists = await prisma.project.findFirst({
		where: { id, isDeleted: false },
	});

	if (!isProjectExists) {
		throw new Error("Project not found");
	}

	const updatedProject = await prisma.project.update({
		where: { id },
		data: payload,
	});

	return updatedProject;
};

const softDeleteProject = async (id: string) => {
	const isProjectExists = await prisma.project.findFirst({
		where: { id, isDeleted: false },
	});

	if (!isProjectExists) {
		throw new Error("Project not found");
	}

	const deletedProject = await prisma.project.update({
		where: { id },
		data: {
			isDeleted: true,
			deletedAt: new Date(),
		},
	});

	return deletedProject;
};

export const ProjectService = {
	createProject,
	getAllProjects,
	getSingleProject,
	updateProject,
	softDeleteProject,
};
