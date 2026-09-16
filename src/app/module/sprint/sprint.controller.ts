import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SprintService } from "./sprint.service";

const createSprint = catchAsync(async (req: Request, res: Response) => {
	const result = await SprintService.createSprint(req.body);
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Sprint created successfully",
		data: result,
	});
});

const getSprintsByProject = catchAsync(async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const result = await SprintService.getSprintsByProject(projectId);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Sprints fetched successfully",
		data: result,
	});
});

const updateSprintStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SprintService.updateSprintStatus(id, req.body.status);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Sprint status updated successfully",
		data: result,
	});
});

export const SprintController = {
	createSprint,
	getSprintsByProject,
	updateSprintStatus,
};
