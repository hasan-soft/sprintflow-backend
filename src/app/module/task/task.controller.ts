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

const getSingleTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TaskService.getSingleTask(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task retrieved successfully",
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await TaskService.updateTask(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const getMyAssignedTasks = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as unknown as IRequestUser;

  const result = await TaskService.getMyAssignedTasks(user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assigned tasks retrieved successfully",
    data: result,
  });
});

const assignTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { assigneeId } = req.body;
  const user = req.user as unknown as IRequestUser;

  const result = await TaskService.assignTask(id, assigneeId, user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task assigned successfully",
    data: result,
  });
});

const unassignTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as unknown as IRequestUser;

  const result = await TaskService.unassignTask(id, user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task unassigned successfully",
    data: result,
  });
});

export const TaskController = {
  createTask,
  getAllTasks,
  updateTaskStatus,
  softDeleteTask,
  getSingleTask,
  updateTask,
  getMyAssignedTasks,
  assignTask,
  unassignTask,
};
