import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { SubtaskController } from "./subtask.controller";
import { SubtaskValidation } from "./subtask.validation";

const router = Router();

router.post(
	"/",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	validateRequest(SubtaskValidation.createSubtaskValidationSchema),
	SubtaskController.createSubtask,
);

router.get(
	"/task/:taskId",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	SubtaskController.getSubtasksByTask,
);

router.patch(
	"/:id/toggle",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	SubtaskController.toggleSubtask,
);

router.delete(
	"/:id",
	auth(Role.ADMIN, Role.MANAGER),
	SubtaskController.deleteSubtask,
);

export const SubtaskRoutes = router;
