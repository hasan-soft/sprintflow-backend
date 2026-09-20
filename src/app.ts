import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";

import { AuthRoutes } from "./app/module/auth/auth.route";
import { CommentRoutes } from "./app/module/comment/comment.route";
import { PaymentController } from "./app/module/payment/payment.controller";
import { PaymentRoutes } from "./app/module/payment/payment.route";

import { ProjectRoutes } from "./app/module/project/project.route";
import { SprintRoutes } from "./app/module/sprint/sprint.route";
import { SubtaskRoutes } from "./app/module/subtask/subtask.route";
import { TaskRoutes } from "./app/module/task/task.route";
import { UserRoutes } from "./app/module/user/user.route";

const app: Application = express();

app.use(helmet());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: {
		success: false,
		message: "Too many requests from this IP, please try again later.",
	},
});
app.use("/api", limiter);

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

app.post(
	"/api/v1/payments/webhook",
	express.raw({ type: "application/json" }),
	PaymentController.handleWebhook,
);

app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/projects", ProjectRoutes);
app.use("/api/v1/sprints", SprintRoutes);
app.use("/api/v1/tasks", TaskRoutes);
app.use("/api/v1/subtasks", SubtaskRoutes);
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/comments", CommentRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to SprintFlow System Backend",
	});
});

// Error Handler Middlewares
app.use(globalErrorHandler);
app.use(notFound);

export default app;
