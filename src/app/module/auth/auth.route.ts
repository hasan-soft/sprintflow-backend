import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post(
	"/register",
	validateRequest(AuthValidation.registerUserValidationSchema),
	AuthController.registerUser,
);

router.post(
	"/login",
	validateRequest(AuthValidation.loginUserValidationSchema),
	AuthController.loginUser,
);

router.get(
	"/me",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	AuthController.getMe,
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
	"/google",
	validateRequest(AuthValidation.googleLoginValidationSchema),
	AuthController.googleLogin,
);

export const AuthRoutes = router;
