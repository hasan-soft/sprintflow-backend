import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProjectService } from "./project.service";

const createProject = catchAsync(async (req: Request, res: Response) => {
	const result = await ProjectService.createProject(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Project created successfully",
		data: result,
	});
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
	const result = await ProjectService.getAllProjects(req.query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Projects fetched successfully",
		meta: result.meta,
		data: result.data,
	});
});

const getSingleProject = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ProjectService.getSingleProject(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Project details fetched successfully",
		data: result,
	});
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ProjectService.updateProject(id, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Project updated successfully",
		data: result,
	});
});

const softDeleteProject = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ProjectService.softDeleteProject(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Project deleted successfully",
		data: result,
	});
});

export const ProjectController = {
	createProject,
	getAllProjects,
	getSingleProject,
	updateProject,
	softDeleteProject,
};
