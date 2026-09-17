import type { SprintStatus } from "../../../generated/prisma/client";

export interface ICreateSprintPayload {
  name: string;
  projectId: string;
  startDate: string;
  endDate: string;
  status?: SprintStatus;
}

export interface IUpdateSprintStatusPayload {
  status: SprintStatus;
}
