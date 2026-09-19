import type { Role } from "../../../generated/prisma/client";

export interface IUpdateUserPayload {
	name?: string;
}

export interface IUpdateUserRolePayload {
	role: Role;
}
