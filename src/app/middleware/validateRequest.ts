import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (schema: ZodTypeAny) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const parsedData = (await schema.parseAsync({
			body: req.body,
			query: req.query,
			params: req.params,
			cookies: req.cookies,
		})) as Record<string, unknown>;

		// Sanitized Data
		if (parsedData.body) req.body = parsedData.body;
		if (parsedData.query) req.query = parsedData.query as typeof req.query;
		if (parsedData.params) req.params = parsedData.params as typeof req.params;
		if (parsedData.cookies) req.cookies = parsedData.cookies;

		next();
	});
};
