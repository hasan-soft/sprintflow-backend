import express from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/client";

const router = express.Router();

// Get My Profile
router.get(
	"/me",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	UserController.getProfile,
);

// Update Profile
router.patch(
	"/me",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	UserController.updateProfile,
);

router.get("/", auth(Role.ADMIN, Role.MANAGER), UserController.getAllUsers);

router.patch("/:id/role", auth(Role.ADMIN), UserController.updateUserRole);

router.get("/admin/stats", auth(Role.ADMIN), UserController.getAdminStats);

export const UserRoutes = router;
