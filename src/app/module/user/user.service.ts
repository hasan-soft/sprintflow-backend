import type { Prisma, Role } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { IUpdateUserPayload, IUserFilterQuery } from "./user.interface";

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

const getAllUsersFromDB = async (query: IUserFilterQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const { role, searchTerm } = query;

  const whereConditions: Prisma.UserWhereInput = { isDeleted: false };

  if (role) whereConditions.role = role;

  if (searchTerm) {
    whereConditions.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: result,
  };
};

const updateUserRoleInDB = async (userId: string, role: Role) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
};

const getAdminStatsFromDB = async () => {
  const [
    totalUsers,
    totalOrganizations,
    totalProjects,
    totalSprints,
    totalTasks,
    totalSubtasks,
    totalComments,
    totalActivityLogs,
    totalSubscriptions,
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.organization.count(),
    prisma.project.count({ where: { isDeleted: false } }),
    prisma.sprint.count(),
    prisma.task.count({ where: { isDeleted: false } }),
    prisma.subtask.count(),
    prisma.comment.count(),
    prisma.activityLog.count(),
    prisma.subscription.count(),
  ]);

  return {
    overview: {
      users: totalUsers,
      organizations: totalOrganizations,
      projects: totalProjects,
      sprints: totalSprints,
      tasks: totalTasks,
      subtasks: totalSubtasks,
      comments: totalComments,
      activityLogs: totalActivityLogs,
      subscriptions: totalSubscriptions,
    },
  };
};

export const UserService = {
  getProfileFromDB,
  updateProfileInDB,
  getAllUsersFromDB,
  updateUserRoleInDB,
  getAdminStatsFromDB,
};
