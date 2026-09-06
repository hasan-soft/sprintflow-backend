import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";
import config from "../config";

export const globalErrorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (config.node_env === "development") {
		console.log("Error from Global Error Handler", err);
	}

	let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
	let errorMessage = "Internal Server Error";
	let errorSources: Array<{ path: string; message: string }> = [];

	const errorObj = err as Record<string, unknown>;

	if (err instanceof ZodError) {
		statusCode = httpStatus.BAD_REQUEST;
		errorMessage = "Validation Error";
		errorSources = err.issues.map((issue) => ({
			path: issue.path[issue.path.length - 1]?.toString() || "",
			message: issue.message,
		}));
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		statusCode = httpStatus.BAD_REQUEST;
		errorMessage = "You have provided incorrect field type or missing fields";
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		statusCode = httpStatus.BAD_REQUEST;
		if (err.code === "P2002") {
			errorMessage = "Duplicate Key Error";
		} else if (err.code === "P2003") {
			errorMessage = "Foreign key constraint failed";
		} else if (err.code === "P2025") {
			errorMessage =
				"An operation failed because it depends on one or more records that were required but not found.";
		}
	} else if (err instanceof Prisma.PrismaClientInitializationError) {
		if (err.errorCode === "P1000") {
			statusCode = httpStatus.UNAUTHORIZED;
			errorMessage =
				"Authentication failed against database server. Please Check Your Credentials";
		} else if (err.errorCode === "P1001") {
			statusCode = httpStatus.BAD_REQUEST;
			errorMessage = "Can't reach database server";
		}
	} else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		errorMessage = "Error occurred during query execution";
	} else if (err instanceof Error) {
		errorMessage = err.message;
	}

	res.status(statusCode).json({
		success: false,
		message: errorMessage,
		errors:
			errorSources.length > 0
				? errorSources
				: [{ path: "", message: errorMessage }],
		stack:
			config.node_env === "development"
				? (errorObj?.stack as string)
				: undefined,
	});
};
