import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { TaskController } from "./task.controller";
import { TaskValidation } from "./task.validation";

const router = Router();

// Create task
router.post(
  "/",
  auth(Role.ADMIN, Role.MANAGER),
  validateRequest(TaskValidation.createTaskValidationSchema),
  TaskController.createTask,
);

// Get all tasks
router.get(
  "/",
  auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  TaskController.getAllTasks,
);

// Get my assigned tasks
router.get(
  "/my-assigned",
  auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  TaskController.getMyAssignedTasks,
);

// Get single task by ID
router.get(
  "/:id",
  auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  TaskController.getSingleTask,
);

// Update task details
router.patch(
  "/:id",
  auth(Role.ADMIN, Role.MANAGER),
  validateRequest(TaskValidation.updateTaskValidationSchema),
  TaskController.updateTask,
);

// Update task status
router.patch(
  "/:id/status",
  auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validateRequest(TaskValidation.updateTaskStatusValidationSchema),
  TaskController.updateTaskStatus,
);

// Assign task to user
router.post(
  "/:id/assign",
  auth(Role.ADMIN, Role.MANAGER),
  validateRequest(TaskValidation.assignTaskValidationSchema),
  TaskController.assignTask,
);

// Unassign task from user
router.post(
  "/:id/unassign",
  auth(Role.ADMIN, Role.MANAGER),
  TaskController.unassignTask,
);

// Soft delete task
router.delete(
  "/:id",
  auth(Role.ADMIN, Role.MANAGER),
  TaskController.softDeleteTask,
);

export const TaskRoutes = router;
