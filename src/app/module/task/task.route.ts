import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { TaskController } from "./task.controller";
import { TaskValidation } from "./task.validation";

const router = Router();

router.post(
	"/",
	auth(Role.ADMIN, Role.MANAGER),
	validateRequest(TaskValidation.createTaskValidationSchema),
	TaskController.createTask,
);

router.get(
	"/",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	TaskController.getAllTasks,
);

router.patch(
	"/:id/status",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	validateRequest(TaskValidation.updateTaskStatusValidationSchema),
	TaskController.updateTaskStatus,
);

router.delete(
	"/:id",
	auth(Role.ADMIN, Role.MANAGER),
	TaskController.softDeleteTask,
);

export const TaskRoutes = router;
