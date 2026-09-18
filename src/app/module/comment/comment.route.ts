import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { CommentController } from "./comment.controller";
import { CommentValidation } from "./comment.validation";

const router = Router();

router.post(
	"/",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	validateRequest(CommentValidation.createCommentValidationSchema),
	CommentController.createComment,
);

router.get(
	"/task/:taskId",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	CommentController.getTaskComments,
);

export const CommentRoutes = router;
