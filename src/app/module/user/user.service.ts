import type { Role } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { IUpdateUserPayload } from "./user.interface";

const getProfileFromDB = async (userId: string) => {
	return await prisma.user.findUnique({
		where: { id: userId },
		select: { id: true, name: true, email: true, role: true, createdAt: true },
	});
};

const updateProfileInDB = async (
	userId: string,
	payload: IUpdateUserPayload,
) => {
	return await prisma.user.update({
		where: { id: userId },
		data: payload,
	});
};

const getAllUsersFromDB = async () => {
	return await prisma.user.findMany({
		select: { id: true, name: true, email: true, role: true },
	});
};

const updateUserRoleInDB = async (userId: string, role: Role) => {
	return await prisma.user.update({
		where: { id: userId },
		data: { role },
	});
};

const getAdminStatsFromDB = async () => {
	const totalUsers = await prisma.user.count();
	const totalProjects = await prisma.project.count({
		where: { isDeleted: false },
	});
	const totalTasks = await prisma.task.count({ where: { isDeleted: false } });

	return { totalUsers, totalProjects, totalTasks };
};

export const UserService = {
	getProfileFromDB,
	updateProfileInDB,
	getAllUsersFromDB,
	updateUserRoleInDB,
	getAdminStatsFromDB,
};
