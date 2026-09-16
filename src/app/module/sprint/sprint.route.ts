import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { SprintController } from "./sprint.controller";
import { SprintValidation } from "./sprint.validation";

const router = Router();

router.post(
	"/",
	auth(Role.ADMIN, Role.MANAGER),
	validateRequest(SprintValidation.createSprintValidationSchema),
	SprintController.createSprint,
);

router.get(
	"/project/:projectId",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	SprintController.getSprintsByProject,
);

router.patch(
	"/:id/status",
	auth(Role.ADMIN, Role.MANAGER),
	validateRequest(SprintValidation.updateSprintStatusValidationSchema),
	SprintController.updateSprintStatus,
);

export const SprintRoutes = router;
