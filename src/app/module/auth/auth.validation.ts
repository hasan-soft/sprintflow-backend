import { z } from "zod";

const registerUserValidationSchema = z.object({
	body: z.object({
		name: z
			.string({ message: "Name must be a string" })
			.min(2, "Name must be at least 2 characters"),
		email: z
			.string({ message: "Email is required" })
			.email("Invalid email address"),
		password: z
			.string({ message: "Password is required" })
			.min(6, "Password must be at least 6 characters"),
		organizationName: z.string().optional(),
		role: z.enum(["ADMIN", "MANAGER", "MEMBER"]).optional(),
	}),
});

const loginUserValidationSchema = z.object({
	body: z.object({
		email: z
			.string({ message: "Email is required" })
			.email("Invalid email address"),
		password: z.string({ message: "Password is required" }),
	}),
});

const googleLoginValidationSchema = z.object({
	body: z.object({
		idToken: z.string({ message: "Google ID Token is required" }),
	}),
});

export const AuthValidation = {
	registerUserValidationSchema,
	loginUserValidationSchema,
	googleLoginValidationSchema,
};
