import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SubtaskService } from "./subtask.service";

const createSubtask = catchAsync(async (req: Request, res: Response) => {
	const result = await SubtaskService.createSubtask(req.body);
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Subtask created successfully",
		data: result,
	});
});

const getSubtasksByTask = catchAsync(async (req: Request, res: Response) => {
	const { taskId } = req.params;
	const result = await SubtaskService.getSubtasksByTask(taskId);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Subtasks fetched successfully",
		data: result,
	});
});

const toggleSubtask = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SubtaskService.toggleSubtask(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Subtask status toggled successfully",
		data: result,
	});
});

const deleteSubtask = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SubtaskService.deleteSubtask(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Subtask deleted successfully",
		data: result,
	});
});

export const SubtaskController = {
	createSubtask,
	getSubtasksByTask,
	toggleSubtask,
	deleteSubtask,
};
