import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AIService } from "./ai.service";

const getAIChatResponse = catchAsync(async (req: Request, res: Response) => {
	const { message } = req.body;
	const result = await AIService.generateChatResponse(message);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "AI Response fetched successfully",
		data: { reply: result },
	});
});

const getSearchSuggestions = catchAsync(async (req: Request, res: Response) => {
	const { query } = req.body;
	const result = await AIService.generateSearchSuggestions(query);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Search suggestions fetched successfully",
		data: { suggestions: result },
	});
});

export const AIController = {
	getAIChatResponse,
	getSearchSuggestions,
};
