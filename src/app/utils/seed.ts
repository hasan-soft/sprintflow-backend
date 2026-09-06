import bcrypt from "bcryptjs";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";

// Create Seed Admin
export const seedAdmin = async () => {
	try {
		const isAdminExist = await prisma.user.findFirst({
			where: {
				role: Role.ADMIN,
			},
		});

		if (isAdminExist) {
			console.log("Admin Already Exists!");
			return;
		}

		const name = config.admin_name;
		const email = config.admin_email;
		const password = config.admin_password;

		if (!name || !email || !password) {
			throw new Error("Admin Name, Email, or Password Missing In Env File!!!");
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const admin = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: Role.ADMIN,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log("Admin Created Successfully: ", admin.email);
	} catch (error) {
		console.log("Error Seeding Admin: ", error);
	}
};

// Create Seed Manager
export const seedManager = async () => {
	try {
		const isManagerExist = await prisma.user.findUnique({
			where: {
				email: config.manager_email,
			},
		});

		if (isManagerExist) {
			console.log("Manager Already Exists!");
			return;
		}

		const name = config.manager_name;
		const email = config.manager_email;
		const password = config.manager_password;

		if (!name || !email || !password) {
			throw new Error(
				"Manager Name, Email, or Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const manager = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: Role.MANAGER,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log("Manager Created Successfully: ", manager.email);
	} catch (error) {
		console.log("Error Seeding Manager: ", error);
	}
};

// Create Seed Member
export const seedMember = async () => {
	try {
		const isMemberExist = await prisma.user.findUnique({
			where: {
				email: config.member_email,
			},
		});

		if (isMemberExist) {
			console.log("Member Already Exists!");
			return;
		}

		const name = config.member_name;
		const email = config.member_email;
		const password = config.member_password;

		if (!name || !email || !password) {
			throw new Error("Member Name, Email, or Password Missing In Env File!!!");
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const member = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: Role.MEMBER,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log("Member Created Successfully: ", member.email);
	} catch (error) {
		console.log("Error Seeding Member: ", error);
	}
};
