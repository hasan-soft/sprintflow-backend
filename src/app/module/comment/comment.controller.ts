import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CommentService } from "./comment.service";

const createComment = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.userId;
	const result = await CommentService.createComment({
		...req.body,
		userId,
	});

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Comment added successfully",
		data: result,
	});
});

const getTaskComments = catchAsync(async (req: Request, res: Response) => {
	const { taskId } = req.params;
	const result = await CommentService.getTaskComments(taskId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Comments fetched successfully",
		data: result,
	});
});

export const CommentController = {
	createComment,
	getTaskComments,
};
