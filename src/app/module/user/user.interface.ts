import type { Role } from "../../../generated/prisma/client";

export interface IUpdateUserPayload {
  name?: string;
}

export interface IUpdateUserRolePayload {
  role: Role;
}

export interface IUserFilterQuery {
  page?: string;
  limit?: string;
  role?: Role;
  searchTerm?: string;
}
