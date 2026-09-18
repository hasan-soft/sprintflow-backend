import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TaskService } from "./task.service";

const createTask = catchAsync(async (req: Request, res: Response) => {
	const result = await TaskService.createTask(req.body);
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Task created successfully",
		data: result,
	});
});

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
	const result = await TaskService.getAllTasks(req.query);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Tasks fetched successfully",
		meta: result.meta,
		data: result.data,
	});
});

const updateTaskStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await TaskService.updateTaskStatus(id, req.body.status);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Task status updated successfully",
		data: result,
	});
});

const softDeleteTask = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await TaskService.softDeleteTask(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Task deleted successfully",
		data: result,
	});
});

export const TaskController = {
	createTask,
	getAllTasks,
	updateTaskStatus,
	softDeleteTask,
};
