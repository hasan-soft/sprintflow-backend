import { SprintStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSprint = async (payload: {
	name: string;
	projectId: string;
	startDate: string;
	endDate: string;
	status?: SprintStatus;
}) => {
	const sprint = await prisma.sprint.create({
		data: {
			name: payload.name,
			projectId: payload.projectId,
			startDate: new Date(payload.startDate),
			endDate: new Date(payload.endDate),
			status: payload.status || SprintStatus.UPCOMING,
		},
	});
	return sprint;
};

const getSprintsByProject = async (projectId: string) => {
	const sprints = await prisma.sprint.findMany({
		where: { projectId },
		include: {
			tasks: { where: { isDeleted: false } },
		},
		orderBy: { createdAt: "desc" },
	});
	return sprints;
};

const updateSprintStatus = async (id: string, status: SprintStatus) => {
	const isSprintExist = await prisma.sprint.findUnique({ where: { id } });
	if (!isSprintExist) throw new Error("Sprint not found");

	const updatedSprint = await prisma.sprint.update({
		where: { id },
		data: { status },
	});
	return updatedSprint;
};

export const SprintService = {
	createSprint,
	getSprintsByProject,
	updateSprintStatus,
};
