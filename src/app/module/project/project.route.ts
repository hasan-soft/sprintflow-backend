import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ProjectController } from "./project.controller";
import { ProjectValidation } from "./project.validation";

const router = Router();

router.post(
	"/",
	auth(Role.ADMIN, Role.MANAGER),
	validateRequest(ProjectValidation.createProjectValidationSchema),
	ProjectController.createProject,
);

router.get(
	"/",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	ProjectController.getAllProjects,
);

router.get(
	"/:id",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	ProjectController.getSingleProject,
);

router.patch(
	"/:id",
	auth(Role.ADMIN, Role.MANAGER),
	validateRequest(ProjectValidation.updateProjectValidationSchema),
	ProjectController.updateProject,
);

router.delete(
	"/:id",
	auth(Role.ADMIN, Role.MANAGER),
	ProjectController.softDeleteProject,
);

export const ProjectRoutes = router;
