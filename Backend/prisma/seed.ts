import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { RoleName } from "@src/modules/global/auth/auth.decorator";
import { TicketPriority } from "@src/modules/ticket/ticket-priority/ticket-priority.enum";
import { TicketStatus } from "@src/modules/ticket/ticket-status/ticket-status.enum";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const generateUsers = async () => {
	if ((await prisma.user.count()) > 0) return;
	await upsertRoles();
	await generateCompanies(10);

	const customerRole = await prisma.userRole.findUnique({
		where: {
			name: "customer",
		},
	});
	const adminRole = await prisma.userRole.findUnique({
		where: {
			name: "admin",
		},
	});
	const superAdminRole = await prisma.userRole.findUnique({
		where: {
			name: "super-admin",
		},
	});

	const companies = await prisma.company.findMany({
		take: 10,
	});
	const normalUsers = await Promise.all(
		new Array(10).fill(null).map((_, i) => {
			return (async () => {
				const firstName = faker.person.firstName();
				const lastName = faker.person.firstName();
				const username = `${firstName}.${lastName}`;
				const email = `${username}@dummy.com`;
				const password = await bcrypt.hash("123123", 10);
				return prisma.user.upsert({
					where: { username },
					update: {},
					create: {
						username,
						email,
						password,
						settings: {
							create: {
								allowSortItemsByUrl: false,
								allowFilterItemsByUrl: false,
								allowSortItemsByLocalStorage: true,
								allowFilterItemsByLocalStorage: true,
							},
						},
						companyId: companies[i].id,
					},
				});
			})();
		})
	);
	const customers = await Promise.all(
		new Array(5).fill(null).map(() => {
			return (async () => {
				const firstName = faker.person.firstName();
				const lastName = faker.person.firstName();
				const username = `${firstName}.${lastName}`;
				const email = `${username}@customer.com`;
				const password = await bcrypt.hash("123123", 10);
				return prisma.user.upsert({
					where: { username },
					update: {},
					create: {
						username,
						email,
						password,
						settings: {
							create: {
								allowSortItemsByUrl: false,
								allowFilterItemsByUrl: false,
								allowSortItemsByLocalStorage: true,
								allowFilterItemsByLocalStorage: true,
							},
						},
						roleId: customerRole!.id,
					},
				});
			})();
		})
	);
	const admins = await Promise.all(
		new Array(2).fill(null).map(() => {
			return (async () => {
				const firstName = faker.person.firstName();
				const lastName = faker.person.firstName();
				const username = `${firstName}.${lastName}`;
				const email = `${username}@admin.com`;
				const password = await bcrypt.hash("123123", 10);
				return prisma.user.upsert({
					where: { username },
					update: {},
					create: {
						username,
						email,
						password,
						settings: {
							create: {
								allowSortItemsByUrl: false,
								allowFilterItemsByUrl: false,
								allowSortItemsByLocalStorage: true,
								allowFilterItemsByLocalStorage: true,
							},
						},
						roleId: adminRole!.id,
					},
				});
			})();
		})
	);

	const superAdmin = await prisma.user.upsert({
		where: { username: `super.admin` },
		update: {},
		create: {
			username: `super.admin`,
			email: `super.admin@superAdmin.com`,
			password: await bcrypt.hash("123123", 10),
			settings: {
				create: {
					allowSortItemsByUrl: false,
					allowFilterItemsByUrl: false,
					allowSortItemsByLocalStorage: true,
					allowFilterItemsByLocalStorage: true,
				},
			},
			emailConfirmed: true,
			roleId: superAdminRole!.id,
		},
	});

	return [...normalUsers, ...customers, ...admins, superAdmin];
};
const upsertRoles = async () => {
	const superAdminRoleName: RoleName = "super-admin";
	await prisma.userRole.upsert({
		where: {
			name: superAdminRoleName,
		},
		update: {},
		create: {
			name: superAdminRoleName,
			color: "cyan",
		},
	});
	const adminRoleName: RoleName = "admin";
	await prisma.userRole.upsert({
		where: {
			name: adminRoleName,
		},
		update: {},
		create: {
			name: adminRoleName,
			color: "blue",
		},
	});
	const customerRoleName: RoleName = "customer";
	await prisma.userRole.upsert({
		where: {
			name: customerRoleName,
		},
		update: {},
		create: {
			name: customerRoleName,
			color: "teal",
		},
	});
};
const upsertTicketStatus = async () => {
	await prisma.ticketStatus.upsert({
		where: {
			name: TicketStatus.processing,
		},
		update: {},
		create: {
			name: TicketStatus.processing,
			color: "green",
		},
	});
	await prisma.ticketStatus.upsert({
		where: {
			name: TicketStatus.solved,
		},
		update: {},
		create: {
			name: TicketStatus.solved,
			color: "green",
		},
	});
	await prisma.ticketStatus.upsert({
		where: {
			name: TicketStatus.rejected,
		},
		update: {},
		create: {
			name: TicketStatus.rejected,
			color: "red",
		},
	});
	await prisma.ticketStatus.upsert({
		where: {
			name: TicketStatus.assigned,
		},
		update: {},
		create: {
			name: TicketStatus.assigned,
			color: "gray",
		},
	});
	await prisma.ticketStatus.upsert({
		where: {
			name: TicketStatus.open,
		},
		update: {},
		create: {
			name: TicketStatus.open,
			color: "gray",
		},
	});
	await prisma.ticketStatus.upsert({
		where: {
			name: TicketStatus.putBack,
		},
		update: {},
		create: {
			name: TicketStatus.putBack,
			color: "gray",
		},
	});
};
const upsertTicketPriority = async () => {
	await prisma.ticketPriority.upsert({
		where: {
			name: TicketPriority.high,
		},
		update: {},
		create: {
			name: TicketPriority.high,
			color: "red",
		},
	});
	await prisma.ticketPriority.upsert({
		where: {
			name: TicketPriority.middle,
		},
		update: {},
		create: {
			name: TicketPriority.middle,
			color: "yellow",
		},
	});
	await prisma.ticketPriority.upsert({
		where: {
			name: TicketPriority.low,
		},
		update: {},
		create: {
			name: TicketPriority.low,
			color: "gray",
		},
	});
};
const generateTickets = async (amount: number) => {
	if ((await prisma.ticket.count()) > 0) return;

	await upsertTicketStatus();
	await upsertTicketPriority();

	const openTicketStatus = await prisma.ticketStatus.findFirst({
		where: {
			name: TicketStatus.open,
		},
	});

	const lowTicketPriority = await prisma.ticketPriority.findFirst({
		where: {
			name: TicketPriority.low,
		},
	});

	return prisma.ticket.createMany({
		data: new Array(amount).fill(null).map(() => ({
			title: `I have a problem with a device with no: ${faker.number.int({
				min: 10000,
				max: 99999,
			})}`,
			description: "",
			statusId: openTicketStatus!.id,
			priorityId: lowTicketPriority!.id,
		})),
	});
};

const generateCompanies = async (amount: number) => {
	if ((await prisma.company.count()) > 0) return;
	await prisma.company.createMany({
		data: new Array(amount).fill(null).map(() => ({
			name: faker.company.name(),
		})),
	});
};

async function main() {
	await upsertRoles();
	await upsertTicketStatus();
	await upsertTicketPriority();
	await generateUsers();
	await generateTickets(20);
	await generateCompanies(20);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
