import type { Role } from "../../../generated/prisma/client";

export interface ILoginUserPayload {
	email: string;
	password: string;
}

export interface IRegisterUserPayload {
	name: string;
	email: string;
	password: string;
	role?: Role;
	organizationName?: string;
}

export interface IRequestUser {
	userId: string;
	email: string;
	name: string;
	role: Role;
	organizationId?: string | null;
}

export interface IGoogleLoginPayload {
	idToken: string;
}
