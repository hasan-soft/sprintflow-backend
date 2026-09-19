import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initiatePayment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment checkout session initiated successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const result = await PaymentService.confirmPayment(sessionId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment confirmed and subscription updated successfully",
    data: result,
  });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const result = await PaymentService.handleStripeWebhook(
    req.body as Buffer,
    signature,
  );
  res.status(httpStatus.OK).json(result);
});

const getPaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentService.getPaymentStatus(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment status fetched successfully",
    data: result,
  });
});

export const PaymentController = {
  initiatePayment,
  confirmPayment,
  handleWebhook,
  getPaymentStatus,
};
