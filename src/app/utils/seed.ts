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

// Seed Initial Workspace Data (Organization, Projects, Sprints, Tasks, Invoices, Logs)
export const seedWorkspaceData = async () => {
	try {
		// 1. Ensure Organization
		let org = await prisma.organization.findFirst();
		if (!org) {
			org = await prisma.organization.create({
				data: {
					name: "SprintFlow Technologies",
					slug: "sprintflow-hq",
					plan: "ENTERPRISE",
				},
			});
			console.log("Created Organization: ", org.name);
		}

		// Connect users to org if not connected
		await prisma.user.updateMany({
			where: { organizationId: null },
			data: { organizationId: org.id },
		});

		// 2. Seed Projects if none exist
		const projectCount = await prisma.project.count();
		if (projectCount === 0) {
			const member = await prisma.user.findFirst({
				where: { role: Role.MEMBER },
			});

			const projectSeeds = [
				{
					name: "AI Core & Vector Indexing Engine",
					description:
						"High-performance semantic vector search engine with Qdrant and Google Gemini embeddings.",
					status: "ACTIVE" as const,
				},
				{
					name: "FinTech Automated Settlement Gateway",
					description:
						"Multi-currency clearing system with automated fraud prevention and Stripe webhook reconciliation.",
					status: "ACTIVE" as const,
				},
				{
					name: "Kubernetes Multi-Region Auto-Scaler",
					description:
						"Zero-downtime cluster orchestration with automated failover and Prometheus telemetry.",
					status: "ACTIVE" as const,
				},
				{
					name: "Real-Time Fleet Dispatch Mobile Platform",
					description:
						"Low-latency WebSocket geofencing and real-time delivery route optimization.",
					status: "PLANNED" as const,
				},
				{
					name: "Enterprise SSO & Role Directory",
					description:
						"SAML 2.0 and OIDC federation with automated SCIM user provisioning and audit logs.",
					status: "COMPLETED" as const,
				},
				{
					name: "Next.js E-Commerce Microservices",
					description:
						"Sub-second edge rendered storefront with Algolia instant search and headless CMS.",
					status: "ACTIVE" as const,
				},
			];

			for (const p of projectSeeds) {
				const project = await prisma.project.create({
					data: {
						name: p.name,
						description: p.description,
						status: p.status,
						organizationId: org.id,
					},
				});

				const sprint = await prisma.sprint.create({
					data: {
						name: `${p.name} - Sprint 1`,
						goal: "Deliver MVP foundations and establish CI/CD test automation",
						status: "ACTIVE",
						projectId: project.id,
						startDate: new Date(),
						endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
					},
				});

				await prisma.task.createMany({
					data: [
						{
							title: `Architect core module for ${p.name}`,
							description:
								"Define schema, establish interface contracts, and configure unit tests",
							status: "DONE",
							priority: "HIGH",
							projectId: project.id,
							sprintId: sprint.id,
							assigneeId: member?.id,
						},
						{
							title: `Implement integration benchmarks for ${p.name}`,
							description:
								"Run load testing under simulated high concurrent traffic",
							status: "IN_PROGRESS",
							priority: "URGENT",
							projectId: project.id,
							sprintId: sprint.id,
							assigneeId: member?.id,
						},
						{
							title: `Code review and security audit for ${p.name}`,
							description: "Ensure OWASP compliance and zero vulnerabilities",
							status: "TODO",
							priority: "MEDIUM",
							projectId: project.id,
							sprintId: sprint.id,
							assigneeId: member?.id,
						},
					],
				});
			}
			console.log("Seeded initial projects, sprints, and tasks successfully.");
		}

		// 3. Seed Subscriptions (Invoices) if none exist
		const subCount = await prisma.subscription.count();
		if (subCount === 0) {
			await prisma.subscription.createMany({
				data: [
					{
						organizationId: org.id,
						amount: 99.0,
						currency: "USD",
						plan: "ENTERPRISE",
						status: "COMPLETED",
						gateway: "STRIPE",
						transactionId: "ch_3Pq9KlRtZvEnterprise01",
						createdAt: new Date("2026-10-01T10:00:00Z"),
					},
					{
						organizationId: org.id,
						amount: 99.0,
						currency: "USD",
						plan: "ENTERPRISE",
						status: "COMPLETED",
						gateway: "STRIPE",
						transactionId: "ch_3Po8JkQtYvEnterprise02",
						createdAt: new Date("2026-09-01T10:00:00Z"),
					},
					{
						organizationId: org.id,
						amount: 29.0,
						currency: "USD",
						plan: "PRO",
						status: "COMPLETED",
						gateway: "STRIPE",
						transactionId: "ch_3Pm7HjPtXvPro03",
						createdAt: new Date("2026-08-01T10:00:00Z"),
					},
				],
			});
			console.log("Seeded initial subscription invoices successfully.");
		}

		// 4. Seed ActivityLogs if none exist
		const activityCount = await prisma.activityLog.count();
		if (activityCount === 0) {
			const admin = await prisma.user.findFirst({
				where: { role: Role.ADMIN },
			});
			const member = await prisma.user.findFirst({
				where: { role: Role.MEMBER },
			});

			if (admin && member) {
				await prisma.activityLog.createMany({
					data: [
						{
							userId: admin.id,
							action: "User Role Escalation",
							details:
								"Granted MANAGER role to member user alex.m@enterprise.io",
							createdAt: new Date("2026-10-18T09:22:00Z"),
						},
						{
							userId: admin.id,
							action: "Stripe Webhook Signature Verified",
							details:
								"Processed monthly invoice payment for Enterprise Tier ($99.00 USD)",
							createdAt: new Date("2026-10-18T08:45:00Z"),
						},
						{
							userId: member.id,
							action: "Task Completed",
							details:
								"Completed sprint task: Redis idempotency lock in checkout handler",
							createdAt: new Date("2026-10-18T08:30:00Z"),
						},
						{
							userId: member.id,
							action: "Merged PR #142",
							details:
								"Merged Qdrant vector indexing microservice into main branch",
							createdAt: new Date("2026-10-18T09:14:00Z"),
						},
						{
							userId: admin.id,
							action: "Blocker Resolved",
							details:
								"Resolved blocking CORS policy on Stripe Webhook API routes",
							createdAt: new Date("2026-10-17T16:45:00Z"),
						},
					],
				});
				console.log("Seeded initial activity & audit logs successfully.");
			}
		}
	} catch (error) {
		console.log("Error Seeding Workspace Data: ", error);
	}
};
