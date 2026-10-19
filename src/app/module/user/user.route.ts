import express from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { UserController } from "./user.controller";

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
router.get("/admin/logs", auth(Role.ADMIN), UserController.getAuditLogs);
router.get(
	"/me/activities",
	auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	UserController.getMyActivities,
);

export const UserRoutes = router;
