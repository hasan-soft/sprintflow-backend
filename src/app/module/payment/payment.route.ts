import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
	"/initiate",
	auth(Role.ADMIN, Role.MANAGER),
	PaymentController.initiatePayment,
);

router.post(
	"/confirm",
	auth(Role.ADMIN, Role.MANAGER),
	PaymentController.confirmPayment,
);

router.get(
	"/:id",
	auth(Role.ADMIN, Role.MANAGER),
	PaymentController.getPaymentStatus,
);

export const PaymentRoutes = router;
