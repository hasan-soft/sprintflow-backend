import type { Request, Response } from "express";
import httpStatus from "http-status";
import type { Role } from "../../../generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";

interface CustomRequest extends Request {
	user?: {
		userId: string;
		email: string;
		name: string;
		role: Role;
		organizationId?: string | null;
	};
}

const getProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as CustomRequest).user?.userId as string;
	const result = await UserService.getProfileFromDB(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User profile fetched successfully",
		data: result,
	});
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as CustomRequest).user?.userId as string;
	const result = await UserService.updateProfileInDB(userId, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User profile updated successfully",
		data: result,
	});
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const result = await UserService.getAllUsersFromDB();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Users fetched successfully",
		data: result,
	});
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { role } = req.body;
	const result = await UserService.updateUserRoleInDB(id, role);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User role updated successfully",
		data: result,
	});
});

const getAdminStats = catchAsync(async (req: Request, res: Response) => {
	const result = await UserService.getAdminStatsFromDB();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Admin statistics fetched successfully",
		data: result,
	});
});

export const UserController = {
	getProfile,
	updateProfile,
	getAllUsers,
	updateUserRole,
	getAdminStats,
};
